// Studionet native transfer facts. Type-0 children have no model consensus;
// their generic NO_MAJORITY enum is not a failed intelligent-contract verdict.
export function nativeChildMatches(child,parentHash,contract,expected){
 return child?.type===0 && child.status==='FINALIZED' && child.value_credited===true && child.consensus_data===null &&
   typeof child.hash==='string' && /^0x[0-9a-fA-F]{64}$/.test(child.hash) && typeof child.triggered_by==='string' && child.triggered_by.toLowerCase()===parentHash.toLowerCase() && child.triggered_on==='finalized' &&
   typeof child.from_address==='string' && typeof child.to_address==='string' && child.from_address.toLowerCase()===contract.toLowerCase() && child.to_address.toLowerCase()===expected.recipient.toLowerCase() &&
   (typeof child.value==='string'||(typeof child.value==='number'&&Number.isSafeInteger(child.value))) && String(child.value)===String(expected.wei) &&
   child.data!==null && typeof child.data==='object' && !Array.isArray(child.data) && Object.getPrototypeOf(child.data)===Object.prototype && Object.keys(child.data).length===0;
}
export function parseNativeRpc(text){
 return JSON.parse(text,(key,value,context)=>{
  if(key!=='value'||typeof value!=='number')return value;
  if(context&&typeof context.source==='string'&&/^[0-9]+$/.test(context.source))return context.source;
  if(!Number.isSafeInteger(value))throw Error('RPC transfer amount cannot be decoded without loss.');
  return String(value);
 });
}
export function pairNativeChildren(children,parentHash,contract,outbox){
 if(children.length!==outbox.length)throw Error('Parent child count does not match expected transfers.');
 if(new Set(children.map(c=>String(c?.hash).toLowerCase())).size!==children.length)throw Error('Duplicate native child hash.');
 const used=new Set();
 return outbox.map(expected=>{
  const i=children.findIndex((c,i)=>!used.has(i)&&nativeChildMatches(c,parentHash,contract,expected));
  if(i<0)throw Error('A parent-linked native transfer is not finalized and credited to its exact recipient/value.');
  used.add(i);return {parent_hash:parentHash,child_hash:children[i].hash,recipient:expected.recipient,wei:String(expected.wei),kind:expected.kind,native_credit_verified:true};
 });
}
