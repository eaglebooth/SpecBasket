import puppeteer from 'puppeteer-core';
import {preview} from 'vite';
import fs from 'node:fs';
const server=await preview({preview:{host:'127.0.0.1',port:5197,strictPort:true}});
let browser;
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu','--no-first-run']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 page.setDefaultTimeout(15000);await page.setViewport({width:1440,height:1100,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:5197/',{waitUntil:'domcontentloaded',timeout:15000});await page.waitForSelector('h1');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
 fs.mkdirSync('docs/local-evidence',{recursive:true});await page.screenshot({path:'docs/local-evidence/desktop.png',fullPage:true});
 const desktop=await page.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,logo:document.querySelector('img')?.naturalWidth,noDeployment:document.body.innerText.includes('Awaiting your deployment')}));
 await page.evaluate(()=>[...document.querySelectorAll('nav button')].find(b=>b.textContent==='New basket').click());
 await page.waitForSelector('textarea');await page.screenshot({path:'docs/local-evidence/create-basket.png',fullPage:true});
 const create=await page.evaluate(()=>({fields:document.querySelectorAll('textarea').length,submitDisabled:[...document.querySelectorAll('button')].find(x=>x.textContent==='Create basket ↗')?.disabled}));
 await page.evaluate(()=>[...document.querySelectorAll('nav button')].find(b=>b.textContent==='Source library').click());
 await page.waitForSelector('.source-card');const sources=await page.$$eval('.source-card',x=>x.length);
 await page.setViewport({width:390,height:844,deviceScaleFactor:1});await page.reload({waitUntil:'domcontentloaded'});await page.waitForSelector('h1');await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>document.getAnimations().forEach(a=>a.finish()));
 await page.screenshot({path:'docs/local-evidence/mobile.png',fullPage:true});
 const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
 await page.click('.connection input');await page.keyboard.down('Control');await page.keyboard.press('KeyA');await page.keyboard.up('Control');await page.keyboard.press('Backspace');await page.type('.connection input','invalid');
 await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Sync contract').click());await page.waitForSelector('[role=alert]');
 const missingAddressRejected=await page.$eval('[role=alert]',x=>x.textContent.includes('valid deployed contract'));
 const result={checked_at:new Date().toISOString(),scope:'Built local UI only; no wallet signing, mock RPC or deployed state',desktop,create,sources,mobile,missingAddressRejected,errors};
 fs.writeFileSync('docs/local-evidence/ui-check.json',JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result));
 if(desktop.overflow||mobile.overflow||!desktop.logo||!create.submitDisabled||sources!==4||!missingAddressRejected||errors.length)throw Error('UI verification failed');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));}
