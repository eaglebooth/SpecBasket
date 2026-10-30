// Browser read/state/delivery verification. No injected wallet, signing or mock RPC.
import puppeteer from 'puppeteer-core';import {preview} from 'vite';
import {readFileSync,writeFileSync} from 'node:fs';
import {createClient} from 'genlayer-js';import {studionet} from 'genlayer-js/chains';
const address=process.env.SPECBASKET_CONTRACT,run=process.env.SPECBASKET_RUN||'primary';
if(!/^0x[0-9a-fA-F]{40}$/.test(address||''))throw Error('Set contract');
const events=readFileSync(`docs/live-evidence/run-${address.toLowerCase()}-${run}.jsonl`,'utf8').trim().split('\n').map(JSON.parse);
const owner=events[0].context.actors[0].toLowerCase(),id=owner+':core-'+run;
const publish=events.find(e=>e.event==='submitted'&&e.label==='core-publish');if(!publish)throw Error('No real publication');
const c=createClient({chain:studionet});const canonical=JSON.parse(String(await c.readContract({address,functionName:'get_basket',args:[id],transactionHashVariant:'latest-final'})));
const hosted=process.env.SPECBASKET_UI_URL;
if(hosted&&hosted!=='https://specbasket.vercel.app')throw Error('Unexpected production UI URL');
const server=hosted?null:await preview({preview:{host:'127.0.0.1',port:5196,strictPort:true}});let browser;
const check=(v,m)=>{if(!v)throw Error(m)};
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu','--no-first-run']});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.setDefaultTimeout(90000);
 await page.setViewport({width:1440,height:1100,deviceScaleFactor:1});await page.goto(hosted||'http://127.0.0.1:5196/',{waitUntil:'domcontentloaded'});await page.waitForSelector('h1');
 async function fill(selector,value){await page.click(selector);await page.keyboard.down('Control');await page.keyboard.press('KeyA');await page.keyboard.up('Control');await page.keyboard.press('Backspace');await page.type(selector,value);}
 await fill('.connection input',address);await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Sync contract').click());
 await page.waitForFunction(()=>document.querySelector('.feedback')?.textContent.includes('v0.2.0 verified')||document.querySelector('[role=alert]'));
 check(await page.$eval('.feedback',e=>e.textContent.includes('v0.2.0 verified')),'Live release sync failed');
 await fill('.open-bar input',id);await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Open / refresh ↗').click());
 await page.waitForSelector('.basket-title .badge');
 const observed=await page.evaluate(()=>({title:document.querySelector('.basket-title h3').textContent,state:document.querySelector('.badge').textContent,
   requirements:document.querySelectorAll('.brief-list li').length,supported:document.querySelectorAll('.matrix-cell.supported').length,
   not_supported:document.querySelectorAll('.matrix-cell.not_supported').length,outbox:[...document.querySelectorAll('.research-main>.panel:last-child .allocation')].map(e=>e.textContent),
   wallet_connected:!document.querySelector('.wallet').textContent.includes('Connect wallet')}));
 check(observed.title===canonical.title&&observed.state===canonical.state.replaceAll('_',' ')&&observed.requirements===3&&observed.supported===2&&observed.not_supported===4&&!observed.wallet_connected,'UI/state matrix mismatch');
 await page.click('.recovery-panel summary');await fill('.recovery-panel input',publish.hash);
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Check delivery ↗').click());
 await page.waitForFunction(()=>document.querySelector('.feedback')?.textContent.includes('native credits verified')||document.querySelector('[role=alert]'));
 check(await page.$eval('.feedback',e=>e.textContent.includes('native credits verified')),'Browser native-delivery proof failed');
 const childLinks=await page.$$eval('.recovery-panel .allocation a',xs=>xs.map(x=>x.href));check(childLinks.length===2,'UI missing native transfer links');
 await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
 await page.screenshot({path:`docs/live-evidence/ui-${hosted?'production':'live'}-desktop.png`,fullPage:true});
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});await page.screenshot({path:`docs/live-evidence/ui-${hosted?'production':'live'}-mobile.png`,fullPage:true});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);check(!overflow&&errors.length===0,'Live UI overflow/JS error');
 const report={checked_at:new Date().toISOString(),address,basket:id,parent:publish.hash,scope:'Built browser read-only real RPC state and native-child verification; no wallet/signing/approval popup journey',observed,childLinks,mobile_overflow:overflow,errors};
 if(hosted)report.url=hosted;
 writeFileSync(`docs/live-evidence/${hosted?'UI_PRODUCTION_READBACK':'UI_LIVE_READBACK'}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{if(browser)await browser.close();if(server)await new Promise(r=>server.httpServer.close(r));}
