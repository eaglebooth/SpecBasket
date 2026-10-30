import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {checkRelease, connectWallet, readContract, sendWrite, verifyNativeDelivery} from './network';
import {EXPLORER, expectedPoststate, formatGen, isAddress, parseGen, readRecent, readTransactions, workspaceReady} from './protocol.mjs';
import type {Basket, Nomination} from './types';
import resources from '../../samples/resources.json';
import deployment from '../../deployments/studionet.json';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/libre-caslon-display/latin-400.css';
import './style.css';

const short = (x: string) => x.length > 20 ? x.slice(0, 8) + '…' + x.slice(-6) : x;
const initialContract = localStorage.getItem('specbasket:contract') || import.meta.env.VITE_SPECBASKET_CONTRACT || deployment.address;
const starter = ['Represent fungible and non-fungible token types within one contract.', 'Retrieve royalty recipient and royalty amount for a given sale price.', 'Require every marketplace to pay royalties automatically.'];

function App() {
  const [contractInput, setContractInput] = useState(initialContract);
  const [contract, setContract] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [wallet, setWallet] = useState('');
  const [basketId, setBasketId] = useState('');
  const [basket, setBasket] = useState<Basket | null>(null);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [tab, setTab] = useState<'desk' | 'new' | 'sources'>(() => location.hash === '#new-basket' ? 'new' : location.hash === '#source-library' ? 'sources' : 'desk');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [tx, setTx] = useState('');
  const [transactionHistory, setTransactionHistory] = useState<{hash:string;contract:string;basket:string;method:string}[]>(() => readTransactions(localStorage));
  const [history, setHistory] = useState<string[]>(() => readRecent(localStorage));
  const generation = useRef(0);
  const [title, setTitle] = useState('NFT marketplace standards research');
  const [slug, setSlug] = useState('research-' + Math.floor(Date.now() / 1000));
  const [questions, setQuestions] = useState(starter);
  const [members, setMembers] = useState('');
  const [reward, setReward] = useState('0.0001');
  const [erc, setErc] = useState('1155');
  const [note, setNote] = useState('');
  const [failedDeposit, setFailedDeposit] = useState('');
  const [paymentParent,setPaymentParent]=useState('');
  const [deliveryProof,setDeliveryProof]=useState<{parent_hash:string;child_hash:string;recipient:string;wei:string;kind:string;native_credit_verified:boolean}[]>([]);
  const sponsor = !!basket && wallet.toLowerCase() === basket.sponsor;
  const contributor = !!basket && basket.contributors.includes(wallet.toLowerCase());
  const participant = sponsor || contributor;
  const disabled = busy || !wallet || !workspaceReady(contractInput, contract) || releaseVersion!=='0.2.0';

  useEffect(() => {
    const changed = () => {generation.current++; setWallet(''); setNotice('Wallet changed. Reconnect before making another write.');};
    window.ethereum?.on?.('accountsChanged', changed); window.ethereum?.on?.('chainChanged', changed);
    return () => {window.ethereum?.removeListener?.('accountsChanged', changed); window.ethereum?.removeListener?.('chainChanged', changed);};
  }, []);

  function navigate(next: 'desk' | 'new' | 'sources', openExisting = false) {
    setTab(next);
    const hash = next === 'new' ? '#new-basket' : next === 'sources' ? '#source-library' : '#workspace';
    window.history.replaceState(null, '', hash);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(openExisting ? '.open-bar' : '.workspace-heading');
      target?.scrollIntoView({behavior: 'instant', block: 'start'});
      const focus = openExisting ? target?.querySelector<HTMLInputElement>('input') : target?.querySelector<HTMLElement>('h2');
      focus?.focus({preventScroll: true});
    });
  }

  async function action(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await fn(); } catch (e) {setError(e instanceof Error ? e.message : String(e));}
    finally {setBusy(false);}
  }
  async function syncContract() {
    if (!isAddress(contractInput)) throw Error('Enter a valid deployed contract address.');
    const version=await checkRelease(contractInput);
    generation.current++; setContract(contractInput); setReleaseVersion(version.version); setBasket(null); setNominations([]);
    localStorage.setItem('specbasket:contract', contractInput);
    setNotice(version.version==='0.1.0'?'Historical v0.1.0 verified for reading only. Its custody gate failed; use corrected v0.2.0 for writes.':'SpecBasket v0.2.0 verified on Studionet.');
  }
  async function load(id: string, address = contract) {
    if (!address) throw Error('Sync a deployed contract first.');
    const b = await readContract<Basket>(address, 'get_basket', [id]);
    const entries = await Promise.all(b.nomination_ids.map(n => readContract<Nomination>(address, 'get_nomination', [n])));
    setBasket(b); setNominations(entries); setBasketId(id); setSelected(b.selected);
    const recent = [id, ...history.filter(x => x !== id)].slice(0, 8); setHistory(recent); localStorage.setItem('specbasket:recent', JSON.stringify(recent));
    return b;
  }
  async function write(method: string, args: (string | number)[], id: string, value = 0n) {
    if (!workspaceReady(contractInput, contract)) throw Error('Sync the displayed contract before signing.');
    const gen = generation.current;
    const before = method === 'assess_source' ? await readContract<Basket>(contract, 'get_basket', [id]) : basket;
    const {hash} = await sendWrite(contract, wallet, method, args, value, (message, hash) => {
      setNotice(message);
      if (hash) {
        setTx(hash);
        setTransactionHistory(previous => {
          if (previous.some(x=>x.hash===hash)) return previous;
          const next=[{hash,contract,basket:id,method},...previous].slice(0,20);
          try {localStorage.setItem('specbasket:transactions',JSON.stringify(next));} catch { /* Link remains visible in memory if browser storage is full. */ }
          return next;
        });
      }
    }, () => generation.current === gen);
    let b: Basket | undefined;
    for (let i = 0; i < 8; i++) {
      b = await load(id);
      if (generation.current !== gen) throw Error('Workspace changed during readback; inspect the transaction.');
      if (expectedPoststate(method, args, b, wallet, before)) break;
      b = undefined; await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!b) throw Error('Execution finalized, but expected business state was not verified. Inspect the transaction.');
    setNotice(method === 'fund_and_publish' ? 'Allocation published; external transfers emitted. Recipient delivery still needs chain confirmation.' : method === 'assess_source' ? 'Assessment recorded. Read each relation below; transaction success does not mean the source supports the requirements.' : 'Verified against canonical contract state.');
    setTx(hash); setTab('desk');
  }
  async function recoverDeposit(){
    if(disabled)throw Error('Connect a wallet and sync corrected v0.2.0 first.');
    if(!/^0x[0-9a-fA-F]{64}$/.test(failedDeposit))throw Error('Enter the complete failed transaction hash.');
    const gen=generation.current;
    const {hash,business}=await sendWrite(contract,wallet,'recover_failed_deposit',[failedDeposit],0n,(message,hash)=>{
      setNotice(message);if(hash){setTx(hash);setTransactionHistory(previous=>{const next=[{hash,contract,basket:'failed-deposit:'+failedDeposit,method:'recover_failed_deposit'},...previous.filter(x=>x.hash!==hash)].slice(0,20);try{localStorage.setItem('specbasket:transactions',JSON.stringify(next));}catch{}return next;});}
    },()=>generation.current===gen);
    if(!business||typeof business!=='object'||business.status!=='REFUND_EMITTED'||typeof business.id!=='string')throw Error('Refund business result could not be verified. Inspect the saved transaction.');
    const receipt=await readContract<{status:string;recipient:string;deposit_hash:string;amount_wei:string}>(contract,'get_refund_receipt',[business.id]);
    if(receipt.status!=='REFUND_EMITTED'||receipt.recipient!==wallet.toLowerCase()||receipt.deposit_hash!==failedDeposit.toLowerCase())throw Error('Refund receipt binding mismatch.');
    setNotice(`Refund of ${formatGen(receipt.amount_wei)} GEN emitted to your wallet. Recipient delivery requires a separate chain check.`);setTx(hash);
  }

  return <><header className="site-header"><a className="brand" href="#" onClick={e => {e.preventDefault(); setTab('desk');}}><img src="/logo.png" alt="SpecBasket research basket"/><span>SpecBasket<small>ETHEREUM RESEARCH DESK</small></span></a><nav aria-label="Main navigation">{(['desk','new','sources'] as const).map(t => <button key={t} className={tab === t ? 'nav-active' : ''} onClick={() => navigate(t)}>{t === 'desk' ? 'Workspace' : t === 'new' ? 'New basket' : 'Source library'}</button>)}</nav><button className="wallet" disabled={busy} onClick={() => action(async () => {setWallet(await connectWallet()); setNotice('Wallet connected.');})}>{wallet ? short(wallet) : 'Connect wallet'} <span>↗</span></button></header>
  <main><section className="intro"><div><div className="eyebrow"><span className="dot"/> STANDARDS, SUBSTANTIATED.</div><h1>Good research.<br/><em>Accountable rewards.</em></h1><p>Turn product requirements into a source-backed collection of Ethereum standards. Independent judgment. A transparent allocation.</p><div className="intro-actions"><button className="primary" onClick={() => navigate('new')}>Create a research basket <span>↗</span></button><a href="#workspace" onClick={e => {e.preventDefault(); navigate('desk', true);}}>Open an existing basket ↓</a></div></div><div className="hero-art"><img src="/logo.png" alt="Ethereum standards collected and examined in a blue basket"/><div className="art-caption"><span>01 / THE RESEARCH WORKSPACE</span><span>ERC → EVIDENCE → ALLOCATION</span></div></div></section>
  <section className="connection" id="connection" aria-label="Contract connection"><div className="network"><span className="dot"/><div><strong>GenLayer Studionet</strong><small>{contract ? 'Release verified · 61999' : 'Sync deployment to verify · 61999'}</small></div></div><label>Active contract<input value={contractInput} placeholder="0x… paste deployed SpecBasket address" onChange={e => {generation.current++; setContractInput(e.target.value); setContract(''); setBasket(null); setNominations([]);}} disabled={busy}/></label><button className="secondary" disabled={busy} onClick={() => action(syncContract)}>Sync contract</button>{contract && <a className="external" href={`${EXPLORER}/address/${contract}`} target="_blank" rel="noreferrer">Explorer ↗</a>}</section>
  {(notice || error || tx) && <section className={'feedback ' + (error ? 'error' : '')} role={error ? 'alert' : 'status'} aria-live="polite">{busy && <span className="spinner"/>}<div>{error || notice}{tx && <a href={`${EXPLORER}/transactions/${tx}`} target="_blank" rel="noreferrer">Inspect transaction {short(tx)} ↗</a>}</div></section>}
  <details className="recovery-panel"><summary>Verify a GEN award or refund delivery</summary><p>Read the parent and its native-transfer children. Verification requires finalized credit to each exact recipient and amount; it does not resend a transaction.</p><form onSubmit={e=>{e.preventDefault();action(async()=>{setDeliveryProof([]);const proof=await verifyNativeDelivery(contract,paymentParent);setDeliveryProof(proof);setNotice('Parent-linked Studionet native credits verified. This observation is separate from the contract’s transfer-emitted state.');});}}><label>Parent transaction hash<input value={paymentParent} onChange={e=>setPaymentParent(e.target.value)} maxLength={66} placeholder="0x… publication or refund parent hash" required/></label><button className="secondary" disabled={busy||!contract}>Check delivery ↗</button></form>{deliveryProof.map(p=><div className="allocation" key={p.child_hash}><span>Verified native credit<small>{short(p.recipient)} · <a href={`${EXPLORER}/transactions/${p.child_hash}`} target="_blank" rel="noreferrer">Child transfer ↗</a></small></span><strong>{formatGen(p.wei)} GEN</strong></div>)}</details>
  <details className="recovery-panel"><summary>Recover a failed credited deposit</summary><p>For this corrected contract only: prove a finalized rollback credited GEN without emitting messages. Only the original sender can request its refund, once. This cannot recover funds from another deployment.</p><form onSubmit={e=>{e.preventDefault();action(recoverDeposit);}}><label>Failed transaction hash<input value={failedDeposit} onChange={e=>setFailedDeposit(e.target.value)} maxLength={66} placeholder="0x… complete failed transaction hash" required/></label><button className="secondary" disabled={disabled}>Verify deposit & emit refund ↗</button></form></details>
  {transactionHistory.length>0 && <details className="transaction-history"><summary>Submitted transactions · saved on this browser</summary>{transactionHistory.map(t=><a key={t.hash} href={`${EXPLORER}/transactions/${t.hash}`} target="_blank" rel="noreferrer">{t.method} · {short(t.contract)} · {short(t.hash)} ↗</a>)}</details>}
  <div className="workspace-heading" id={tab === 'new' ? 'new-basket' : tab === 'sources' ? 'source-library' : 'workspace'}><div><div className="eyebrow">THE WORKBENCH</div><h2 tabIndex={-1}>{tab === 'new' ? 'Start with a precise question.' : tab === 'sources' ? 'Published standards. Exact revisions.' : 'Your research, in the open.'}</h2></div><span className="mini-label">01—03 REQUIREMENTS / BASKET</span></div>
  {tab === 'new' ? <section className="panel create-panel"><div className="panel-heading"><span className="number">01</span><div><h3>Define the research brief</h3><p>Reward source discovery and accurate specification coverage, not claims about deployed software.</p></div></div><form onSubmit={e => {e.preventDefault(); action(async () => {const q = questions.filter(x => x.trim()); const contributorAddresses = members.split(/[\s,]+/).filter(Boolean); if (!contributorAddresses.length || contributorAddresses.some(a => !isAddress(a))) throw Error('Enter valid contributor wallet addresses.'); await write('create_basket', [slug,title,JSON.stringify(q),JSON.stringify(contributorAddresses),parseGen(reward)], wallet.toLowerCase() + ':' + slug);});}}><div className="form-grid"><label>Basket title<input value={title} onChange={e => setTitle(e.target.value)} required minLength={4} maxLength={100}/></label><label>Unique reference<input value={slug} pattern="[a-z][a-z0-9_-]{0,23}" onChange={e => setSlug(e.target.value)} required maxLength={24}/></label></div><div className="requirements-editor">{questions.map((q,i) => <label key={i}><span className="row-label"><b>Q{String(i+1).padStart(2,'0')}</b> Specification requirement {questions.length > 1 && <button type="button" onClick={() => setQuestions(questions.filter((_,j) => j !== i))}>Remove</button>}</span><textarea value={q} onChange={e => setQuestions(questions.map((s,j) => i === j ? e.target.value : s))} required minLength={15} maxLength={700} rows={2}/></label>)}{questions.length < 3 && <button type="button" className="text-button" onClick={() => setQuestions([...questions,''])}>+ Add a requirement</button>}</div><div className="form-grid"><label>Contributor wallets<textarea value={members} placeholder="One to three addresses, separated by commas. Use wallets distinct from the sponsor." onChange={e => setMembers(e.target.value)} required rows={3}/><small>Each contributor has three nomination slots. Sponsor selects the final source set.</small></label><label>Reward per covered requirement · GEN<input inputMode="decimal" value={reward} onChange={e => setReward(e.target.value)} required/><small>Funding is optional after assessment. No GEN is held while research is pending; no reward is guaranteed until funded.</small></label></div><div className="form-bottom"><span>The connected wallet becomes this basket’s sponsor.</span><button className="primary" disabled={disabled}>Create basket ↗</button></div></form></section>
  : tab === 'sources' ? <section className="source-grid">{resources.resources.map(r => <article className="source-card" key={r.erc}><div className="source-top"><span>OFFICIAL PUBLICATION</span><span>↗</span></div><h3>ERC-{r.erc}</h3><p>{r.erc === 1155 ? 'Multi Token Standard' : r.erc === 2981 ? 'NFT Royalty Standard' : r.erc === 721 ? 'Non-Fungible Token Standard' : 'Token Standard'}</p><dl><dt>Repository</dt><dd>ethereum/ERCs</dd><dt>Full revision</dt><dd className="mono">{r.commit}</dd><dt>Fetched source</dt><dd>{r.bytes.toLocaleString()} bytes · SHA-256 bound</dd></dl><a href={r.url} target="_blank" rel="noreferrer">Read exact document ↗</a></article>)}<aside className="source-boundary">A specification establishes what its document says. It does not prove implementation compliance, security, marketplace adoption or a completed payment.</aside></section>
  : <><section className="open-bar"><label>Basket ID<input value={basketId} onChange={e => setBasketId(e.target.value)} placeholder="0xSponsorAddress:basket-reference" disabled={busy}/></label><button className="secondary" disabled={busy || !contract || !basketId} onClick={() => action(async () => {await load(basketId); setNotice('Canonical basket state refreshed.');})}>Open / refresh ↗</button></section>{history.length > 0 && <div className="recent"><span>RECENT</span>{history.map(id => <button key={id} disabled={busy || !contract} onClick={() => action(async () => {await load(id);})}>{short(id)}</button>)}</div>}
  {!basket ? <section className="empty-workspace"><div className="empty-grid" aria-hidden="true"><span>REQUIREMENT</span><span>SOURCE</span><span>JUDGMENT</span><i>01</i><i>ERC—</i><i>—</i><i>02</i><i>ERC—</i><i>—</i></div><div><h3>A considered answer starts here.</h3><p>Create a basket or open one by its ID. You can read published research without connecting a wallet.</p><button className="text-button" onClick={() => navigate('new')}>Build your first brief ↗</button></div></section>
  : <div className="basket-layout"><section className="research-main"><div className="panel basket-overview"><div className="basket-title"><div><div className="eyebrow">BASKET / {short(basket.id)}</div><h3>{basket.title}</h3></div><span className="badge">{basket.state.replaceAll('_',' ')}</span></div><dl className="basket-meta"><div><dt>Sponsor</dt><dd>{short(basket.sponsor)} {sponsor && '· you'}</dd></div><div><dt>Per requirement</dt><dd>{formatGen(basket.reward_wei)} GEN</dd></div><div><dt>Maximum budget</dt><dd>{formatGen((BigInt(basket.reward_wei)*BigInt(basket.requirements.length)).toString())} GEN</dd></div></dl><ol className="brief-list">{basket.requirements.map((q,i) => <li key={q}><span>Q{String(i+1).padStart(2,'0')}</span><p>{q}</p></li>)}</ol></div>
  <section className="panel"><div className="panel-heading"><span className="number">02</span><div><h3>Evidence nominations</h3><p>Only the fixed official source is assessed. Contributor notes cannot change its contents.</p></div></div>{nominations.length === 0 ? <p className="muted">No documents nominated yet.</p> : nominations.map(n => <article className="nomination" key={n.id}><div><strong>ERC-{n.erc}</strong><small>by {short(n.contributor)}</small>{n.note && <p>{n.note}</p>}<a href={n.url} target="_blank" rel="noreferrer">Exact source ↗</a></div>{sponsor && basket.state === 'OPEN' ? <label className="checkbox"><input type="checkbox" checked={selected.includes(n.id)} disabled={busy} onChange={e => setSelected(e.target.checked ? [...selected,n.id] : selected.filter(x => x !== n.id))}/> Select</label> : <span className="mini-label">{basket.selected.includes(n.id) ? 'IN FROZEN SET' : 'NOT SELECTED'}</span>}</article>)}{basket.state === 'OPEN' && contributor && <form className="nomination-form" onSubmit={e => {e.preventDefault(); action(async () => {await write('nominate',[basket.id,basket.policy_digest,erc,note],basket.id); setNote('');});}}><label>Official document<select value={erc} onChange={e => setErc(e.target.value)}>{resources.resources.map(r => <option key={r.erc} value={String(r.erc)}>ERC-{r.erc}</option>)}</select></label><label>Research note · optional<textarea value={note} maxLength={900} onChange={e => setNote(e.target.value)} rows={2} placeholder="Explain why this document is relevant. This note is not authoritative evidence."/></label><button className="primary" disabled={disabled}>Nominate document ↗</button></form>}</section>
  {basket.selected.length > 0 && <section className="panel"><div className="panel-heading"><span className="number">03</span><div><h3>The coverage matrix</h3><p>Each cell records a bounded specification judgment. Matching is calculated by contract code.</p></div></div><div className="matrix" style={{gridTemplateColumns:`minmax(90px,1fr) repeat(${basket.requirements.length},minmax(0,1fr))`}}><div className="matrix-label">SOURCE / BRIEF</div>{basket.requirements.map((_,i) => <div className="matrix-label" key={i}>Q{String(i+1).padStart(2,'0')}</div>)}{basket.selected.map(id => {const n=nominations.find(n => n.id===id); const a=basket.assessments[id]; return <React.Fragment key={id}><strong>ERC-{n?.erc}</strong>{basket.requirements.map((_,i) => <div className={'matrix-cell '+(a?.rows[i]?.relation || '').toLowerCase()} key={i} title={a?.rows[i]?.quote || a?.code || 'Not assessed'}><span>{a?.rows[i]?.relation === 'SUPPORTED' ? '✓' : a?.rows[i]?.relation === 'NOT_SUPPORTED' ? '×' : '·'}</span><small>{a?.rows[i]?.relation?.replaceAll('_',' ') || (a?.status === 'UNRESOLVED' ? 'UNRESOLVED' : 'PENDING')}</small></div>)}</React.Fragment>;})}</div>{basket.selected.map(id => {const n=nominations.find(n=>n.id===id),a=basket.assessments[id];return <details key={id}><summary>ERC-{n?.erc} · {a?.status || 'Pending assessment'} · inspect evidence</summary>{a?.rows.map((r,i)=><div className="quote" key={i}><strong>Q{i+1} · {r.relation}</strong>{r.quote && <blockquote>{r.quote}</blockquote>}</div>)}{a?.rows.some(r=>r.relation==='UNCERTAIN') && <p>Uncertainty blocks funding. This resolved observation cannot be retried; cancel this unfunded basket if the requirements need clarification.</p>}{basket.state==='FROZEN' && participant && a?.status !== 'RESOLVED' && (basket.attempts[id] || 0)<2 && <button className="secondary" disabled={disabled} onClick={()=>action(async()=>{await write('assess_source',[basket.id,basket.manifest_digest,id],basket.id);})}>{a ? 'Retry source assessment' : 'Assess this source'} ↗</button>}{a?.status==='UNRESOLVED' && <p>{a.code} · no positive allocation is available.</p>}</details>;})}</section>}
  {basket.state==='TRANSFERS_EMITTED' && <section className="panel"><div className="eyebrow">PUBLIC ALLOCATION</div><h3>Research published. Delivery is a separate check.</h3><p>These are emitted external transfers, not recipient-delivery confirmations. Do not resend a published basket.</p>{basket.outbox.map((o,i)=><div className="allocation" key={i}><span>{o.kind==='RESEARCH_AWARD'?'Research award':'Unallocated refund'}<small>{o.recipient}</small></span><strong>{formatGen(o.wei)} GEN</strong></div>)}</section>}
  </section><aside className="basket-sidebar"><section className="panel action-panel"><div className="eyebrow">NEXT ACTION</div><h3>{basket.state==='OPEN'?'Build the source set.':basket.state==='FROZEN'?'Examine the evidence.':basket.state==='ASSESSED'?'Publish the allocation.':basket.state==='CANCELLED'?'Basket cancelled.':'Transfers emitted.'}</h3><p>{basket.state==='OPEN'?'Contributors nominate documents. The sponsor freezes up to three distinct ERCs.':basket.state==='FROZEN'?'A participant assesses each selected source. Uncertainty never becomes support.':basket.state==='ASSESSED'?'Review the deterministic match before attaching the exact GEN budget.':'Read the canonical record below.'}</p>{sponsor && basket.state==='OPEN' && <button className="primary" disabled={disabled || !selected.length || selected.length>3} onClick={()=>action(async()=>{await write('freeze',[basket.id,basket.revision,JSON.stringify(selected)],basket.id);})}>Freeze {selected.length} sources ↗</button>}{basket.state==='ASSESSED' && <><ul className="matching-list">{basket.matching.map((n,i)=><li key={i}><span>Q{i+1}</span><strong>{n<0?'Unallocated':`ERC-${nominations.find(x=>x.id===basket.selected[n])?.erc}`}</strong></li>)}</ul>{sponsor && <button className="primary" disabled={disabled} onClick={()=>action(async()=>{if(!window.confirm('Attach the exact research budget and emit awards/refund? External delivery is asynchronous. This action cannot be repeated.'))return;await write('fund_and_publish',[basket.id,basket.assessment_digest],basket.id,BigInt(basket.reward_wei)*BigInt(basket.requirements.length));})}>Fund & publish ↗</button>}</>}{sponsor && ['OPEN','FROZEN','ASSESSED'].includes(basket.state) && <button className="danger-button" disabled={disabled} onClick={()=>action(async()=>{if(window.confirm('Cancel this unfunded basket? No GEN is held.'))await write('cancel',[basket.id,basket.policy_digest],basket.id);})}>Cancel unfunded basket</button>}{!wallet && <small>Connect a wallet to see your available actions.</small>}{wallet && !participant && <small>You can read this basket. Writes require its sponsor or an invited contributor. Create a separate basket to use your own wallets.</small>}</section><section className="sidebar-note"><span className="eyebrow">TRUST BOUNDARY</span><p>Source identity is fixed. GenLayer judges specification coverage. Contract code allocates rewards.</p><p>No implementation audit. No compulsory royalty claim. No payment confirmation from a parent receipt.</p><dl><dt>Policy commitment</dt><dd className="mono">{basket.policy_digest}</dd><dt>Frozen source set</dt><dd className="mono">{basket.manifest_digest||'Not frozen'}</dd></dl></section></aside></div>}</>}
  <section className="how"><div className="eyebrow">HOW IT WORKS</div><div><article><span>01</span><h3>A precise brief.</h3><p>Define up to three requirements and invite contributors. Each basket has its own authority.</p></article><article><span>02</span><h3>Independent reading.</h3><p>Validators read exact official documents and independently challenge overbroad interpretations.</p></article><article><span>03</span><h3>A bounded outcome.</h3><p>Code computes the matching. Optional GEN awards use real messages, with delivery verified separately.</p></article></div></section>
  </main><footer><span>SpecBasket <small>A clearer basis for building.</small></span><span>STUDIONET · SPECIFICATION RESEARCH, NOT A SECURITY AUDIT</span></footer></>;
}
createRoot(document.getElementById('root')!).render(<App/>);
