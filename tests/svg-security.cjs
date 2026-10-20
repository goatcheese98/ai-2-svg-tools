const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {valid,bad} = require('./fixtures.json');
(async () => {
 const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
 try {
 const page = await browser.newPage();
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}})); const external=[]; const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin=process.env.APP_URL || 'http://svg.test';
 await page.emulateMedia({colorScheme:'dark'});
 await page.route('**/*', route => {
  const u = new URL(route.request().url());
  if(u.origin !== origin) {if(u.hostname !== 'fonts.googleapis.com') external.push(u.href);return route.abort();}
  if(process.env.APP_URL) return route.continue();
  if(u.pathname === '/') return route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'templates/index.html'),'utf8').replace(/\{\{ url_for\('static', filename='([^']+)'\) \}\}/g,'/static/$1')});
  if(u.pathname.startsWith('/static/')) return route.fulfill({path:path.join(root,u.pathname)});
  if(u.pathname === '/analyze_image') return route.fulfill({json:{metadata:'Offline fixture',semantic:'A rectangle',layout:'Centered',content_styling:'Gradient',ocr:'Hello'}});
  if(u.pathname === '/refine_svg') assert.equal(typeof route.request().postDataJSON().svg_code,'string');
  if(u.pathname === '/convert_to_svg') assert.equal(route.request().postDataJSON().analysis_data.metadata,'Offline fixture');
  return route.fulfill({json:{svg_code:bad}});
 });
 await page.goto(origin);
 if(process.env.SCREENSHOT_DIR) {fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'desktop-before.png'),fullPage:true});}
 async function edit(code) {await page.locator('#svg-code-editor').fill(code);await page.waitForTimeout(400);}
 async function safe() {
  const unsafe=await page.locator('#svg-preview').evaluate(el=>!!el.querySelector('script,foreignObject,image,style,animate,[onmouseover],a[href^="javascript:"]'));
  assert.equal(unsafe,false,'preview must remove active content and resource loads');
 }
 await edit(bad); await safe();
 const variants = ['<g onload="alert(1)"/>', '<use href="//evil.invalid/x"/>', '<use href="data:image/svg+xml,bad"/>', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://evil.invalid/x"/>', '<rect style="fill:url(https://evil.invalid/x)"/>', '<rect fill="url(&quot;https://evil.invalid/x&quot;)"/>', '<a href="java&#x73;cript:alert(1)">x</a>', '<set attributeName="onload" to="alert(1)"/>'];
 for (const payload of variants) {
  await edit(valid.replace('</svg>',payload+'</svg>'));
  const clean = await page.locator('#svg-preview svg').evaluate(el=>el.outerHTML);
  assert(clean && !/evil.invalid|onload|javascript:|xlink:href|<set|style=/.test(clean),payload);
 }
 assert.deepEqual(external,[],'no external loads');
 assert.equal(await page.evaluate(()=>window.pwned),undefined);
 // Saved history is untrusted, including legacy records.
 await page.evaluate(svgCode=>sessionStorage.setItem('svgGeneratorHistory',JSON.stringify([{prompt:'history',svgCode,complexity:3,colorUsage:3,model:'offline',timestamp:new Date().toISOString()}])),bad);
 await page.reload(); await page.locator('#history-list li').first().click();await safe();
 await page.locator('#prompt').fill('offline');await page.locator('#generate-btn').click();await page.waitForTimeout(200);await safe();
 await page.locator('#refinement-prompt').fill('offline refine');await page.locator('#refine-btn').click();
 await page.waitForFunction(()=>document.querySelector('#refine-status').textContent.includes('successful'));await safe();
 await page.locator('[data-tab="extractor-tab-content"]').click();
 await page.locator('#image-upload').setInputFiles({name:'fixture.svg',mimeType:'image/svg+xml',buffer:Buffer.from(bad)});
 assert.equal(await page.evaluate(()=>window.pwned),undefined,'uploaded SVG remains isolated');
 await page.locator('#image-upload').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')});
 await page.locator('#analyze-btn').click();await page.waitForFunction(()=>document.querySelector('#analysis-metadata')?.value === 'Offline fixture');
 assert.equal(await page.evaluate(()=>window.pwned),undefined,'uploaded SVG stays in image context');
 await page.locator('#recreate-svg-btn').click();
 await page.waitForFunction(()=>document.querySelector('#recreate-svg-status').textContent.includes('successful'),null,{timeout:5000});await safe();
 if(process.env.SCREENSHOT_DIR) await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'recreation.png'),fullPage:true});
 await page.locator('[data-tab="generator-tab-content"]').click();
 // Export immediately after editing, inside the preview debounce window.
 await page.locator('#svg-code-editor').fill(bad);
 await page.locator('#copy-btn').click();const copied=await page.evaluate(()=>window.__copied);assert(copied && !/foreignObject|onmouseover|evil.invalid|javascript:|<script/.test(copied),'clipboard sanitizes current editor');
 const downloadPromise=page.waitForEvent('download');await page.locator('#save-btn').click();
 const downloaded=await downloadPromise; const svg=fs.readFileSync(await downloaded.path(),'utf8');
 assert(!/onmouseover|foreignObject|javascript:|evil.invalid|<script/.test(svg),'SVG download must be sanitized');
 await edit(valid);assert.equal(await page.locator('#svg-preview linearGradient').count(),1);assert.equal(await page.locator('#svg-preview text').textContent(),'Hello');
 for(const custom of [false,true]) {
  if(custom) await page.locator('#png-width-input').fill('200');
  const pending=page.waitForEvent('download');await page.locator(custom?'#save-custom-png-btn':'#save-png-btn').click();
  const png=fs.readFileSync(await (await pending).path());assert.equal(png.subarray(1,4).toString(),'PNG');
  assert.equal(png.readUInt32BE(16),custom?200:100);assert.equal(png.readUInt32BE(20),custom?100:50);
  const pixel=await page.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return Array.from(ctx.getImageData(1,1,1,1).data)},'data:image/png;base64,'+png.toString('base64'));
  assert(pixel[0]>pixel[2] && pixel[3]===255,'PNG must render the red end of the gradient');
 }
 await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('16px Geist') && document.fonts.check('16px "Geist Mono"')),'self-hosted fonts loaded');
 await page.locator('#prompt').focus();assert.equal(await page.locator('#prompt').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
 assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()),'#0a0a0b');
 if(process.env.SCREENSHOT_DIR) {
  await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'desktop.png'),fullPage:true});
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true,'no mobile horizontal overflow');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()),'#fff');
  assert.equal(await page.locator('#prompt').evaluate(el=>parseFloat(getComputedStyle(el).fontSize)),16);
  assert.equal(await page.locator('#generate-btn').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'mobile-light.png'),fullPage:true});
 }
 await edit(valid.replace('width="100"','width="100000"'));
 let warned=false;page.once('dialog',async dialog=>{warned=true;await dialog.accept();});await page.locator('#save-png-btn').click();assert(warned,'oversized PNG blocked');
 await edit('<svg>');assert.equal(await page.locator('#svg-preview svg').count(),0);
 assert.deepEqual(external,[],'no untrusted external loads across all workflows');
 await page.evaluate(()=>sessionStorage.setItem('svgGeneratorHistory','{bad JSON'));await page.reload();assert.equal(await page.locator('#history-list li').count(),0);
 assert.deepEqual(errors,[],'no browser runtime errors');
 console.log('PASS: malicious editor/history/mocked generation/refinement, image analysis/upload isolation and recreation, URL variants, immediate sanitized SVG download, valid geometry/gradient/text, default/custom PNG dimensions and pixels, invalid SVG, raster cap, fonts/focus/themes');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
