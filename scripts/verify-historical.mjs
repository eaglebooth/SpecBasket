// Read-only postmortem of v0.1.0. Never signs or declares it submission-ready.
import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';
import {readFileSync,writeFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {decodeExecution} from '../frontend/src/protocol.mjs';
const address='0x65Bc42A6263De86C6Aa1D0DE8a6021b630A5656d';
const prefix='docs/live-evidence/',file=`run-${address.toLowerCase()}-primary.jsonl`;
const events=readFileSync(prefix+file,'utf8').trim().split('\n').map(JSON.parse);
const client=()=>createClient({chain:studionet});
async function retry(fn){for(let n=0;n<5;n++){try{return await fn();}catch(e){if(n===4)throw e;await new Promise(r=>setTimeout(r,1000*(n+1)));}}}
const read=async(method,args=[])=>{const s=String(await retry(()=>client().readContract({address,functionName:method,args,transactionHashVariant:'latest-final'})));return method==='get_native_balance'?s:JSON.parse(s);};
const local=readFileSync('history/v0.1.0/contracts/spec_basket.py'),remote=Buffer.from(await retry(()=>client().getContractCode(address)),'utf8');
if(!local.equals(remote))throw Error('Historical source parity mismatch');
const result={checked_at:new Date().toISOString(),address,source_sha256:createHash('sha256').update(local).digest('hex'),version:await read('get_version'),native_balance:await read('get_native_balance'),status:'FINANCIAL_GATE_FAILED',baskets:{},transactions:[]};
const owner=events[0].context.actors[0].toLowerCase();
for(const name of ['core','negative','audit','injection'])result.baskets[name]=await read('get_basket',[owner+':'+name+'-primary']);
const submitted=events.filter(e=>e.event==='submitted');
for(let i=0;i<submitted.length;i+=3){
 const rows=await Promise.all(submitted.slice(i,i+3).map(async s=>{
  const tx=await retry(()=>client().getTransaction({hash:s.hash}));
  const intent=events.find(e=>e.event==='intent'&&e.label===s.label).input;
  if(tx.statusName!=='FINALIZED'||tx.result_name!=='MAJORITY_AGREE'||tx.to_address.toLowerCase()!==address.toLowerCase()||tx.from_address.toLowerCase()!==intent.actor.toLowerCase())throw Error('Transaction identity/finality mismatch');
  const execution=decodeExecution(tx);
  if(intent.expectedError?execution.ok||execution.reason!==intent.expectedError:!execution.ok)throw Error('Unexpected historical execution');
  return {label:s.label,hash:s.hash,execution:execution.ok?'SUCCESS':'ERROR',reason:execution.reason,financial_gate:s.label==='core-wrong-value'?'FAILED_NATIVE_VALUE_RETAINED':null};
 }));result.transactions.push(...rows);
}
if(result.baskets.core.state!=='ASSESSED'||['negative','audit','injection'].some(k=>result.baskets[k].state!=='CANCELLED'))throw Error('Unexpected historical final state');
if(result.baskets.injection.assessments[result.baskets.injection.selected[0]].rows[0].relation!=='NOT_SUPPORTED')throw Error('Attack outcome mismatch');
if(result.native_balance!=='1')throw Error('Reconcile changed native balance; do not rewrite the observed failure');
const out=`historical-independent-${Date.now()}.json`;writeFileSync(prefix+out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
const rows=result.transactions.map(t=>`| ${t.label} | [tx](https://explorer-studio.genlayer.com/transactions/${t.hash}) | ${t.execution} | ${t.financial_gate||t.reason||'Observed business state; see readback'} |`).join('\n');
writeFileSync('docs/HISTORICAL_V010_EVIDENCE.md',`# SpecBasket v0.1.0 historical evidence — FINANCIAL GATE FAILED\n\nChecked ${result.checked_at}. Contract [${address}](https://explorer-studio.genlayer.com/address/${address}).\n\nExact archived/deployed source SHA-256: \`${result.source_sha256}\`.\n\n${result.transactions.length} actual finalized majority transactions by two secondary wallets. Real semantic controls and negative/audit phases passed, including one malicious requirement returning NOT_SUPPORTED. Funding was STOPPED: wrong attached value rolled back execution but retained 1 wei in native balance. No award, refund delivery, complete E2E or submission readiness is claimed. The frozen historical instance cannot be repaired by a replacement contract.\n\n[Independent readbacks](live-evidence/${out}) · [Append-only raw run](live-evidence/${file}) · [Custody failure](CUSTODY_FAILURE.md)\n\n| Step | Explorer | Execution | Observation |\n|---|---|---|---|\n${rows}\n`);
console.log(JSON.stringify({historical:true,transaction_count:result.transactions.length,financial_gate:'FAILED',native_balance:result.native_balance,readback:prefix+out}));
