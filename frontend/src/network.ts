import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionHashVariant, type Hash} from 'genlayer-js/types';
import {CHAIN, POLICY, decodeExecution, decodeBusinessResult, normalizeHash} from './protocol.mjs';
import {parseNativeRpc,pairNativeChildren} from './payment-proof.mjs';
import releases from './releases.json';
export type Provider = NonNullable<NonNullable<Parameters<typeof createClient>[0]>['provider']> & {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};
declare global { interface Window { ethereum?: Provider } }
export const publicClient = () => createClient({chain: studionet});
export async function readContract<T>(address: string, method: string, args: string[] = []): Promise<T> {
  const result = await publicClient().readContract({address: address as `0x${string}`, functionName: method, args, transactionHashVariant: TransactionHashVariant.LATEST_FINAL});
  return JSON.parse(String(result)) as T;
}
export async function checkRelease(address: string, write = false) {
  const v = await readContract<{name: string; version: string; policy: string; network: number}>(address, 'get_version');
  const current=v.version==='0.2.0'&&v.policy===POLICY;
  const historical=v.version==='0.1.0'&&v.policy==='specbasket/official-erc-matching-v1';
  if (v.name !== 'SpecBasket' || (!current&&!historical) || v.network !== CHAIN) throw Error('This address is not a supported SpecBasket release.');
  const source=await publicClient().getContractCode(address as `0x${string}`);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(source)));
  const sourceHash=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
  const release=releases[v.version as keyof typeof releases];
  if(!release||release.source_sha256!==sourceHash||release.policy!==v.policy)throw Error('Deployed source does not match this supported release.');
  if(write&&!current)throw Error('Historical v0.1.0 is read-only after its failed custody gate. Use a corrected v0.2.0 deployment.');
  return v;
}
export async function verifyNativeDelivery(address: string, parentHash: string){
  const hash=normalizeHash(parentHash);await checkRelease(address);
  const tx=await publicClient().getTransaction({hash:hash as Hash});
  const execution=decodeExecution(tx);
  const sender=tx.from_address?.toLowerCase();
  if(tx.statusName!=='FINALIZED'||!execution.ok||!sender||tx.to_address?.toLowerCase()!==address.toLowerCase())throw Error('Parent must be a successful finalized SpecBasket call.');
  const business=decodeBusinessResult(tx);
  type Transfer={recipient:string;wei:string;kind:string};let outbox:Transfer[];
  if(business?.status==='TRANSFERS_EMITTED'){
    const b=await readContract<{state:string;sponsor:string;outbox:Transfer[]}>(address,'get_basket',[business.basket_id]);
    if(b.state!=='TRANSFERS_EMITTED'||b.sponsor!==sender)throw Error('Publication state/sponsor mismatch.');outbox=b.outbox;
  }else if(business?.status==='REJECTED_REFUND_EMITTED'||business?.status==='REFUND_EMITTED'){
    const record=business.status==='REJECTED_REFUND_EMITTED'?business.refund:business;
    const r=await readContract<{status:string;recipient:string;amount_wei:string}>(address,'get_refund_receipt',[record.id]);
    if(r.status!=='REFUND_EMITTED'||r.recipient!==sender||r.amount_wei!==record.amount_wei)throw Error('Refund identity/value mismatch.');
    outbox=[{recipient:r.recipient,wei:r.amount_wei,kind:'REFUND'}];
  }else throw Error('This transaction has no supported research award or refund result.');
  const children=(tx as unknown as {triggered_transactions?:string[]}).triggered_transactions;
  if(!Array.isArray(children)||children.length!==outbox.length)throw Error('Child transfers are not available yet. Recheck later; do not resend the payment.');
  const raw=await Promise.all(children.map(async h=>{
    const response=await fetch(studionet.rpcUrls.default.http[0],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'eth_getTransactionByHash',params:[h]})});
    if(!response.ok)throw Error('Native-transfer RPC unavailable.');
    const text=await response.text();if(text.length>1048576)throw Error('Unexpected native-transfer response size.');
    const obj=parseNativeRpc(text);if(obj.error||obj.result?.hash!==h)throw Error('Native child response mismatch.');return obj.result;
  }));
  return pairNativeChildren(raw,hash,address,outbox);
}
export async function connectWallet(): Promise<string> {
  const p = window.ethereum;
  if (!p) throw Error('Install an Ethereum-compatible browser wallet, then reload.');
  const accounts = await p.request({method: 'eth_requestAccounts'}) as string[];
  if (!accounts[0]) throw Error('No wallet account selected.');
  if (Number(await p.request({method: 'eth_chainId'})) !== CHAIN) {
    try { await p.request({method: 'wallet_switchEthereumChain', params: [{chainId: '0xf22f'}]}); }
    catch (e) {
      if ((e as {code?: number}).code !== 4902) throw e;
      await p.request({method: 'wallet_addEthereumChain', params: [{chainId: '0xf22f', chainName: studionet.name, nativeCurrency: studionet.nativeCurrency, rpcUrls: [...studionet.rpcUrls.default.http], blockExplorerUrls: ['https://explorer-studio.genlayer.com']}]});
    }
  }
  if (Number(await p.request({method: 'eth_chainId'})) !== CHAIN) throw Error('Switch the wallet to GenLayer Studionet.');
  return accounts[0];
}
export async function sendWrite(address: string, account: string, method: string, args: (string | number)[], value: bigint, progress: (text: string, hash?: string) => void, stillCurrent: () => boolean) {
  const provider = window.ethereum;
  if (!provider) throw Error('Connect a browser wallet first.');
  const live = await provider.request({method: 'eth_accounts'}) as string[];
  if (live[0]?.toLowerCase() !== account.toLowerCase() || Number(await provider.request({method: 'eth_chainId'})) !== CHAIN) throw Error('Account or network changed. Connect again.');
  await checkRelease(address, true);
  if (!stillCurrent()) throw Error('Workspace changed before signing.');
  progress('Confirm this action in your wallet.');
  const client = createClient({chain: studionet, account: account as `0x${string}`, provider});
  const hash = normalizeHash(await client.writeContract({address: address as `0x${string}`, functionName: method, args, value}));
  progress('Submitted. Waiting for finality; business outcome is not verified yet.', hash);
  for (let i = 0; i < 180; i++) {
    if (!stillCurrent()) throw Error('Account, network or contract changed. Use the saved transaction link to inspect the submitted action.');
    const tx = await publicClient().getTransaction({hash: hash as Hash});
    if (tx.statusName === 'FINALIZED') {
      if (tx.from_address?.toLowerCase() !== account.toLowerCase() || tx.to_address?.toLowerCase() !== address.toLowerCase()) throw Error('Receipt sender/target mismatch.');
      const execution = decodeExecution(tx);
      if (!execution.ok) throw Error(execution.reason);
      const business=decodeBusinessResult(tx);
      if(business&&typeof business==='object'&&business.status==='REJECTED_REFUND_EMITTED')throw Error(`Action rejected: ${business.reason}. Attached GEN refund emitted; delivery is not yet confirmed. Inspect the saved transaction.`);
      progress('Finalized execution. Checking canonical state…', hash);
      return {hash,business};
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
  }
  throw Error('Finality is taking longer than expected. Inspect the saved transaction; do not blindly resend.');
}
