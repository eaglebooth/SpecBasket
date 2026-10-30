// Independent read-only verifier. Never signs, deploys or edits append-only run logs.
import {createClient,abi} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';
import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {isDeepStrictEqual as same} from 'node:util';
import {decodeExecution,decodeBusinessResult,isAddress} from '../frontend/src/protocol.mjs';
import {parseNativeRpc,pairNativeChildren} from '../frontend/src/payment-proof.mjs';
const address=process.env.SPECBASKET_CONTRACT,run=process.env.SPECBASKET_RUN||'primary',mode=process.argv[2]||'all';
const check=(ok,message)=>{if(!ok)throw Error(message)};
check(isAddress(address)&&['all','payments'].includes(mode),'Set contract and all/payments mode');
const client=()=>createClient({chain:studionet}),sha=x=>createHash('sha256').update(x).digest('hex');
async function retry(fn){for(let n=0;n<5;n++){try{return await fn();}catch(e){if(n===4)throw e;await new Promise(r=>setTimeout(r,1000*(n+1)));}}}
const read=async(method,args=[])=>{const value=String(await retry(()=>client().readContract({address,functionName:method,args,transactionHashVariant:'latest-final'})));return method==='get_native_balance'?value:JSON.parse(value);};
const source=readFileSync('contracts/spec_basket.py'),remote=Buffer.from(await retry(()=>client().getContractCode(address)),'utf8');
check(source.equals(remote),'Source parity mismatch');
const version=await read('get_version');check(version.version==='0.2.0'&&version.policy==='specbasket/official-erc-matching-v2','Wrong release');
const folder='docs/live-evidence/',file=`run-${address.toLowerCase()}-${run}.jsonl`,events=readFileSync(folder+file,'utf8').trim().split('\n').map(JSON.parse);
const context=events[0].context;
check(context.source_sha256===sha(source)&&context.address.toLowerCase()===address.toLowerCase()&&context.sample_sha256===sha(readFileSync('samples/controls.json')),'Run context mismatch');
check(same(context.actors.map(a=>a.toLowerCase()),['0xeb57bc7125fa60d7482ce12058397369ab3581f8','0x2da5393d7bbb9a037dc3abb56dbbc5c150fc843f']),'Unexpected live actors');
for(const phase of mode==='all'?['lifecycle','negative','audit','race']:['lifecycle'])check(events.some(e=>e.event==='phase-completed'&&e.phase===phase),'Incomplete phase '+phase);
const normalized=x=>x instanceof Map?Object.fromEntries([...x].map(([k,v])=>[k,normalized(v)])):Array.isArray(x)?x.map(normalized):typeof x==='number'||typeof x==='bigint'?{numeric:String(x)}:x;
async function parent(s){
 const intent=events.find(e=>e.event==='intent'&&e.label===s.label).input,tx=await retry(()=>client().getTransaction({hash:s.hash}));
 // The SDK omits zero-valued tx.value. Verify attached value from lossless raw RPC,
 // including zero, rather than treating a missing SDK field as a numeric value.
 const rawParent=await rawChild(s.hash);
 check(tx.statusName==='FINALIZED'&&tx.result_name==='MAJORITY_AGREE'&&tx.from_address.toLowerCase()===intent.actor.toLowerCase()&&tx.to_address.toLowerCase()===address.toLowerCase()&&String(rawParent.value)===intent.value,'Parent finality/identity/value mismatch: '+s.label);
 const raw=tx.consensus_data.leader_receipt,leaders=(Array.isArray(raw)?raw:Object.values(raw||{})).filter(r=>r.mode==='leader');check(leaders.length===1,'Ambiguous parent leader');
 const calldata=normalized(abi.calldata.decode(Buffer.from(leaders[0].calldata.base64,'base64')));
 check(calldata.method===intent.method&&same(calldata.args,normalized(intent.args)),'Actual calldata differs from recorded method/args');
 const execution=decodeExecution(tx),business=decodeBusinessResult(tx);
 if(intent.expectedError?.startsWith('VM_CONTAINS:'))check(!execution.ok&&JSON.stringify(leaders.map(r=>({result:r.result,genvm_result:r.genvm_result}))).includes(intent.expectedError.slice('VM_CONTAINS:'.length)),'Wrong recovery proof failure');
 else if(intent.expectedError==='probe-specific')check(execution.ok||['ASSESSMENT_BINDING','STALE_ASSESSMENT'].includes(execution.reason),'Unexpected race execution');
 else if(intent.expectedError)check(!execution.ok&&execution.reason===intent.expectedError,'Wrong parent rejection');
 else check(execution.ok,'Unexpected parent error');
 if(intent.expectedRefund)check(business.status==='REJECTED_REFUND_EMITTED'&&business.reason===intent.expectedRefund&&business.refund.amount_wei===intent.value&&business.refund.recipient===intent.actor.toLowerCase(),'Wrong rejected-value refund');
 check(events.some(e=>e.event==='verified'&&e.label===s.label),'Runner left transaction unverified');
 return {label:s.label,hash:s.hash,intent,execution,business,transaction:tx};
}
async function rawChild(hash){
 return retry(async()=>{
  const response=await fetch(studionet.rpcUrls.default.http[0],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getTransactionByHash',params:[hash]})});
  check(response.ok,'Native child RPC HTTP error');const body=await response.text();check(body.length<=1048576,'Native child response too large');
  const obj=parseNativeRpc(body);check(obj.jsonrpc==='2.0'&&obj.id===1&&!obj.error&&obj.result?.hash===hash,'Native child RPC result mismatch');return obj.result;
 });
}
const result={checked_at:new Date().toISOString(),address,chain_id:61999,source_sha256:sha(source),version,mode,parents:[],native_transfers:[],raw_native_children:[],baskets:{},native_balance:await read('get_native_balance')};
const submitted=events.filter(e=>e.event==='submitted'&&(mode==='all'||['core-wrong-value','core-publish'].includes(e.label)));
for(let i=0;i<submitted.length;i+=3)result.parents.push(...await Promise.all(submitted.slice(i,i+3).map(parent)));
const owner=context.actors[0].toLowerCase(),core=await read('get_basket',[owner+':core-'+run]);result.baskets.core=core;
check(core.state==='TRANSFERS_EMITTED'&&same(core.matching,[0,1,-1])&&core.received_wei==='300000000000000'&&core.emitted_wei===core.received_wei,'Core allocation invariant');
check(core.selected.length===2,'Wrong source count');
const controls=JSON.parse(readFileSync('samples/controls.json'));
for(const id of core.selected){const n=await read('get_nomination',[id]);check(same(core.assessments[id].rows.map(r=>r.relation),controls.expected_relations[n.erc]),'Final live semantic rows differ from predeclared oracle');}
for(const p of result.parents){
 let outbox=null;
 if(p.business?.status==='REJECTED_REFUND_EMITTED'){
  const receipt=await read('get_refund_receipt',[p.business.refund.id]);check(same(receipt,p.business.refund),'Refund receipt mismatch');
  outbox=[{recipient:receipt.recipient,wei:receipt.amount_wei,kind:'REJECTED_VALUE_REFUND'}];
 }else if(p.business?.status==='TRANSFERS_EMITTED')outbox=core.outbox;
 else if(p.business?.status==='REFUND_EMITTED')outbox=[{recipient:p.business.recipient,wei:p.business.amount_wei,kind:'FAILED_DEPOSIT_REFUND'}];
 if(!outbox)continue;
 check(p.transaction.value_credited===true||p.business.status==='REFUND_EMITTED','Funded parent value was not credited');
 check(Array.isArray(p.transaction.messages)&&p.transaction.messages.length===outbox.length,'Parent outbox message count mismatch');
 const messagePairs=p.transaction.messages.map(m=>[m.recipient.toLowerCase(),String(m.value),String(m.messageType),m.data,m.onAcceptance]).sort();
 const expectedPairs=outbox.map(o=>[o.recipient.toLowerCase(),o.wei,'0','',false]).sort();check(same(messagePairs,expectedPairs),'Parent emitted unexpected messages');
 const ids=p.transaction.triggered_transactions;check(Array.isArray(ids)&&ids.length===outbox.length,'Missing/extra native children');
 const children=await Promise.all(ids.map(rawChild));
 result.native_transfers.push(...pairNativeChildren(children,p.hash,address,outbox));result.raw_native_children.push(...children);
}
check(result.native_transfers.some(t=>t.kind==='REJECTED_VALUE_REFUND'&&t.wei==='1')&&result.native_transfers.some(t=>t.kind==='RESEARCH_AWARD'&&t.wei==='200000000000000')&&result.native_transfers.some(t=>t.kind==='UNALLOCATED_REFUND'&&t.wei==='100000000000000'),'Missing required real payment branches');
check(result.native_balance==='0','Unexpected remaining native balance');
result.balance_observation=events.find(e=>e.event==='recipient-balance-observed')||null;
if(mode==='all'){
 for(const name of ['negative','audit','injection','race']){const b=await read('get_basket',[owner+':'+name+'-'+run]);check(b.state==='CANCELLED'&&b.received_wei==='0'&&b.outbox.length===0,'Negative/audit/race left an active or funded basket');result.baskets[name]=b;}
 const attack=result.baskets.injection,a=attack.assessments[attack.selected[0]];check(a.status==='RESOLVED'&&controls.injection_allowed_relations.includes(a.rows[0].relation),'Injection acquired support');
}
const compactParents=result.parents.map(p=>({label:p.label,hash:p.hash,execution:p.execution,intent:p.intent,business:p.business}));result.parents=compactParents;
const out=`independent-${mode}-${address.toLowerCase()}-${Date.now()}.json`;writeFileSync(folder+out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
const paymentRows=result.native_transfers.map(t=>`| ${t.kind} | ${t.wei} | ${t.recipient} | [parent](https://explorer-studio.genlayer.com/transactions/${t.parent_hash}) | [credited child](https://explorer-studio.genlayer.com/transactions/${t.child_hash}) |`).join('\n');
writeFileSync('docs/PAYMENT_DELIVERY.md',`# Observed SpecBasket v0.2.0 native payments\n\nChecked ${result.checked_at}. Contract [${address}](https://explorer-studio.genlayer.com/address/${address}).\n\nEach child is an exact-parent-bound type-0 native transfer, FINALIZED, value_credited true, correct source/recipient/value and empty calldata. Native children have no AI consensus; generic result NO_MAJORITY is not treated as a failed contract vote. Parent calls separately require finalized MAJORITY_AGREE and successful execution. This proves these Studionet native credits, not arbitrary downstream delivery reliability.\n\n[Independent proof and raw child records](live-evidence/${out})\n\n| Transfer | Wei | Recipient | Parent | Delivery |\n|---|---|---|---|---|\n${paymentRows}\n\nContract native balance: ${result.native_balance} wei. The recorded award balance delta was checked immediately after lifecycle, before recipient test transactions. Eligible failed-parent recovery and a production unmanaged-browser-wallet journey remain separate gates.\n`);
if(mode==='all'){
 const txRows=compactParents.map(t=>`| ${t.label} | [tx](https://explorer-studio.genlayer.com/transactions/${t.hash}) | ${t.execution.ok?'SUCCESS':'ERROR'} | ${t.intent.expectedRefund?'REJECTED / REFUND EMITTED':t.execution.reason||'See canonical business readback'} |`).join('\n');
 writeFileSync('docs/LIVE_E2E_EVIDENCE.md',`# SpecBasket v0.2.0 observed SDK lifecycle\n\nChecked ${result.checked_at}. Contract [${address}](https://explorer-studio.genlayer.com/address/${address}). Source parity SHA-256: \`${result.source_sha256}\`.\n\n${compactParents.length} actual parent test transactions and ${result.native_transfers.length} independently verified native-transfer children. Two secondary signers; main wallet deployed only. Semantic controls, known rejected-value refund, real award/unallocated refund, negative/replay/cancel, an actual prompt attack and cancellation sequence probe were observed. Transient source/model failures and retries remain in append-only evidence. No universal robustness, eligible failed-deposit recovery completion or production browser signing is inferred.\n\n[Independent state/calldata/payment proof](live-evidence/${out}) · [Raw append-only events](live-evidence/${file}) · [Native child delivery](PAYMENT_DELIVERY.md)\n\n## Actual parent transactions\n\n| Step | Explorer | Execution | Business result |\n|---|---|---|---|\n${txRows}\n\n## Actual native-transfer children\n\n| Transfer | Wei | Recipient | Parent | Delivery |\n|---|---|---|---|---|\n${paymentRows}\n`);
}
console.log(JSON.stringify({verified:true,mode,parent_count:compactParents.length,native_child_count:result.native_transfers.length,native_balance:result.native_balance,proof:folder+out}));
