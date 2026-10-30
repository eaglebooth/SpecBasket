import puppeteer from 'puppeteer-core';
import {preview} from 'vite';
import {writeFileSync} from 'node:fs';
const url=process.env.SPECBASKET_UI_URL;
if(url&&url!=='https://specbasket.vercel.app')throw Error('Unexpected URL');
const server=url?null:await preview({preview:{host:'127.0.0.1',port:5195,strictPort:true}});
let browser;
try{
 browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage();const observations=[];
 for(const width of [1440,390]){
  await page.setViewport({width,height:900});await page.goto(url||'http://127.0.0.1:5195/');
  async function click(text,selector,hash){
   await page.evaluate(t=>{window.scrollTo(0,0);[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim().startsWith(t)).click();},text);
   await page.waitForFunction((s,h)=>{const el=document.querySelector(s);return location.hash===h&&el&&el.getBoundingClientRect().top>=0&&el.getBoundingClientRect().top<innerHeight;},{},selector,hash);
   observations.push({width,action:text,hash:await page.evaluate(()=>location.hash),destination_visible:true});
  }
  await click('Create a research basket','.create-panel','#new-basket');
  await click('Source library','.source-card','#source-library');
  await click('Workspace','.open-bar','#workspace');
  await click('New basket','.create-panel','#new-basket');
  await click('Open an existing basket','.open-bar','#workspace');
  if(!await page.$eval('.open-bar input',e=>document.activeElement===e))throw Error('Basket ID not focused');
 }
 const report={checked_at:new Date().toISOString(),url:url||'local built UI',observations};
 writeFileSync(`docs/${url?'live-evidence':'local-evidence'}/navigation-check.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}finally{if(browser)await browser.close();if(server)await new Promise(r=>server.httpServer.close(r));}
