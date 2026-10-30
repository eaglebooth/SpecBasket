import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeExecution, decodeBusinessResult, normalizeHash, expectedPoststate, parseGen, formatGen, isAddress, readRecent, readTransactions, workspaceReady} from '../frontend/src/protocol.mjs';
import {freezeArguments} from '../scripts/live-state.mjs';
import {nativeChildMatches,pairNativeChildren,parseNativeRpc} from '../frontend/src/payment-proof.mjs';
test('SDK hash shapes normalized; malformed objects rejected',()=>{
  const h='0x'+'a'.repeat(64); assert.equal(normalizeHash(h),h); assert.equal(normalizeHash({txId:h}),h);
  for(const x of [{hash:h},'0x123',null])assert.throws(()=>normalizeHash(x));
});
test('finalized parent execution failure never becomes success',()=>{
  const base={statusName:'FINALIZED',result_name:'MAJORITY_AGREE'};
  assert.equal(decodeExecution({...base,consensus_data:{leader_receipt:[{mode:'leader',execution_result:'ERROR',result:{payload:'EXACT_VALUE_REQUIRED'}}]}}).ok,false);
  assert.equal(decodeExecution({...base,consensus_data:{leader_receipt:[{mode:'leader',execution_result:'SUCCESS',genvm_result:{error_code:'panic'}}]}}).ok,false);
  assert.equal(decodeExecution(base).ok,false);
});
test('receipt variants require explicit majority and execution success',()=>{
  assert.equal(decodeExecution({result_name:'MAJORITY_AGREE',consensus_data:{leader_receipt:{leader:{execution_result:'SUCCESS'}}}}).ok,true);
  assert.equal(decodeExecution({result_name:'UNDETERMINED',txExecutionResultName:'SUCCESS'}).ok,false);
});
test('business poststate differs from mere transaction success',()=>{
  assert.equal(expectedPoststate('fund_and_publish',['id','digest'],{state:'ASSESSED'},'0xabc'),false);
  assert.equal(expectedPoststate('fund_and_publish',['id','digest'],{state:'TRANSFERS_EMITTED',assessment_digest:'digest',outbox:[{}],received_wei:'10',emitted_wei:'9'},'0xabc'),false);
});
test('GEN parsing is integer exact and bounded',()=>{
  assert.equal(parseGen('0.0001'),'100000000000000');
  assert.equal(parseGen('0.000000000000000001'),'1');
  assert.equal(formatGen('100000000000000'),'0.0001');
  for(const v of ['0','-1','1.1','1e-4','0.0000000000000000001'])assert.throws(()=>parseGen(v));
});
test('missing and zero contract addresses rejected',()=>{assert.equal(isAddress(''),false);assert.equal(isAddress('0x'+'0'.repeat(40)),false);assert.equal(isAddress('0x'+'a'.repeat(40)),true);});
test('retry cannot claim success from a previous unresolved latest-final read',()=>{
 const prior={manifest_digest:'manifest',revision:4,attempts:{n:1},assessments:{n:{status:'UNRESOLVED'}}};
 assert.equal(expectedPoststate('assess_source',['basket','manifest','n'],prior,'0xa',prior),false);
 assert.equal(expectedPoststate('assess_source',['basket','manifest','n'],{...prior,revision:5,attempts:{n:2}},'0xa',prior),true);
});
test('corrupted local recent storage does not crash the app',()=>{
 assert.deepEqual(readRecent({getItem:()=>'{bad'}),[]);
 assert.deepEqual(readRecent({getItem:()=>'{}'}),[]);
 assert.deepEqual(readRecent({getItem:()=>'["id",4]'}),['id']);
});
test('dirty contract selector cannot leave old writes enabled',()=>{
 const a='0x'+'a'.repeat(40),b='0x'+'b'.repeat(40);
 assert.equal(workspaceReady(b,a),false);assert.equal(workspaceReady(a,a),true);assert.equal(workspaceReady(a,''),false);
});
test('persisted submitted links survive reload and reject malformed records',()=>{
 const record={hash:'0x'+'a'.repeat(64),contract:'0x'+'b'.repeat(40),basket:'id',method:'nominate'};
 const storage={getItem:()=>JSON.stringify([record,{hash:'bad'}])};
 assert.deepEqual(readTransactions(storage),[record]);assert.deepEqual(readTransactions({getItem:()=>'{'}),[]);
});
test('live resume reuses frozen revision but rejects changed source selection',()=>{
 const events=[{event:'intent',label:'core-freeze',input:{args:['basket',2,'["n1","n2"]']}}];
 assert.deepEqual(freezeArguments(events,'core-freeze','basket',5,['n1','n2']),['basket',2,'["n1","n2"]']);
 assert.throws(()=>freezeArguments(events,'core-freeze','basket',5,['n3']));
 assert.deepEqual(freezeArguments([],'fresh','basket',2,['n1']),['basket',2,'["n1"]']);
});
test('business rejection refund is decoded separately from execution success',()=>{
 const rejected={status:'REJECTED_REFUND_EMITTED',reason:'EXACT_VALUE_REQUIRED'};
 const tx={result_name:'MAJORITY_AGREE',consensus_data:{leader_receipt:[{mode:'leader',execution_result:'SUCCESS',result:{payload:{readable:JSON.stringify(JSON.stringify(rejected))}}}]}};
 assert.equal(decodeExecution(tx).ok,true);assert.deepEqual(decodeBusinessResult(tx),rejected);
});
test('native child credit requires parent/recipient/value binding, not AI majority',()=>{
 const parent='0x'+'1'.repeat(64),contract='0x'+'a'.repeat(40),recipient='0x'+'b'.repeat(40);
 const child={type:0,status:'FINALIZED',value_credited:true,consensus_data:null,result:5,hash:'0x'+'2'.repeat(64),triggered_by:parent,triggered_on:'finalized',from_address:contract,to_address:recipient,value:1,data:{}};
 const expected={recipient,wei:'1',kind:'REFUND'};
 assert.equal(nativeChildMatches(child,parent,contract,expected),true);
 for(const change of [{value_credited:false},{value_credited:1},{status:'ACCEPTED'},{triggered_by:'wrong'},{to_address:contract},{value:2},{value:true},{type:2},{data:{method:'call'}},{data:[]},{hash:'bad'}])assert.equal(nativeChildMatches({...child,...change},parent,contract,expected),false);
 assert.equal(pairNativeChildren([child],parent,contract,[expected])[0].native_credit_verified,true);
 assert.throws(()=>pairNativeChildren([child],parent,contract,[expected,expected]));
 assert.throws(()=>pairNativeChildren([child,child],parent,contract,[expected,expected]));
});
test('raw native RPC keeps exact wei above the JavaScript safe-integer range',()=>{
 const p=parseNativeRpc('{"result":{"value":1000000000000000001,"type":0}}');
 assert.equal(p.result.value,'1000000000000000001');assert.equal(p.result.type,0);
});
