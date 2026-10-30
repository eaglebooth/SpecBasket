export const POLICY = 'specbasket/official-erc-matching-v2';
export const CHAIN = 61999;
export const EXPLORER = 'https://explorer-studio.genlayer.com';
export function normalizeHash(value) {
  const hash = typeof value === 'string' ? value : value?.txId;
  if (typeof hash !== 'string' || !/^0x[0-9a-fA-F]{64}$/.test(hash)) throw Error('Wallet returned no valid transaction hash.');
  return hash;
}
export function isAddress(value) { return /^0x[0-9a-fA-F]{40}$/.test(value) && !/^0x0{40}$/i.test(value); }
export function formatGen(wei) {
  const n = BigInt(wei), scale = 10n ** 18n;
  const decimals = (n % scale).toString().padStart(18, '0').replace(/0+$/, '');
  return (n / scale).toString() + (decimals ? '.' + decimals : '');
}
export function parseGen(raw) {
  if (!/^(0|[1-9][0-9]*)(\.[0-9]{1,18})?$/.test(raw)) throw Error('Enter a GEN amount with at most 18 decimal places.');
  const [a, b = ''] = raw.split('.');
  const n = BigInt(a) * 10n ** 18n + BigInt(b.padEnd(18, '0'));
  if (n <= 0n || n > 10n ** 18n) throw Error('Reward per requirement must be greater than zero and at most 1 GEN.');
  return n.toString();
}
export function decodeExecution(tx) {
  const raw = tx?.consensus_data?.leader_receipt;
  const values = Array.isArray(raw) ? raw : Object.values(raw || {});
  const leader = values.find(x => x?.mode === 'leader') || values[0];
  const result = leader?.genvm_result?.error_code ? 'ERROR' : leader?.execution_result || tx?.txExecutionResultName;
  if (tx?.result_name !== 'MAJORITY_AGREE') return {ok: false, reason: 'Consensus is not accepted.'};
  if (result !== 'SUCCESS') return {ok: false, reason: typeof leader?.result?.payload === 'string' ? leader.result.payload : 'Execution outcome could not be verified.'};
  return {ok: true, reason: ''};
}
export function decodeBusinessResult(tx){
  const raw=tx?.consensus_data?.leader_receipt;
  const values=Array.isArray(raw)?raw:Object.values(raw||{});
  const leader=values.find(x=>x?.mode==='leader')||values[0];
  let value=leader?.result?.payload;
  if(value&&typeof value==='object'&&typeof value.readable==='string')value=value.readable;
  for(let i=0;i<2&&typeof value==='string';i++){try{value=JSON.parse(value);}catch{break;}}
  return value;
}
/** @param {{attempts: Record<string, number>, revision: number} | null} before */
export function expectedPoststate(method, args, basket, account, before = null) {
  const actor = account.toLowerCase();
  if (method === 'create_basket') return basket.id === actor + ':' + args[0] && basket.sponsor === actor && basket.state === 'OPEN';
  if (method === 'nominate') return basket.nomination_ids.includes(basket.id + ':' + actor + ':erc-' + args[2]);
  if (method === 'freeze') return basket.state === 'FROZEN' && basket.manifest_digest.length === 64;
  if (method === 'assess_source') return !!basket.assessments[args[2]] && basket.manifest_digest === args[1] && before !== null &&
    (basket.attempts[args[2]] || 0) > (before.attempts[args[2]] || 0) && basket.revision > before.revision;
  if (method === 'cancel') return basket.state === 'CANCELLED';
  if (method === 'fund_and_publish') return basket.state === 'TRANSFERS_EMITTED' && basket.assessment_digest === args[1] && basket.outbox.length > 0 && basket.received_wei === basket.emitted_wei;
  return false;
}
export function readRecent(storage) {
  try {const values=JSON.parse(storage.getItem('specbasket:recent') || '[]');return Array.isArray(values)?values.filter(v=>typeof v==='string').slice(0,8):[];}
  catch {return [];}
}
export function readTransactions(storage) {
  try {const rows=JSON.parse(storage.getItem('specbasket:transactions') || '[]');return Array.isArray(rows)?rows.filter(r=>r&&typeof r.hash==='string'&&/^0x[0-9a-fA-F]{64}$/.test(r.hash)&&isAddress(r.contract)&&typeof r.method==='string'&&typeof r.basket==='string').slice(0,20):[];}
  catch {return [];}
}
export function workspaceReady(input, verified) {return isAddress(verified) && input.trim().toLowerCase() === verified.toLowerCase();}
