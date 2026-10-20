const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const {valid,bad} = require('./fixtures.json');
(async () => {
 const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH === '' ? undefined : (process.env.CHROMIUM_PATH || '/usr/bin/chromium'), args:['--no-sandbox']});
 try {
 const page = await browser.newPage();
 await page.addInitScript(()=>{const Parser=window.DOMParser;window.__parserCalls=0;window.DOMParser=class extends Parser {parseFromString(...args) {window.__parserCalls++;return super.parseFromString(...args);}};});
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.__copied=text;}}})); const external=[]; const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin=process.env.APP_URL || 'http://svg.test';
 await page.emulateMedia({colorScheme:'dark'});
 await page.route('**/*', route => {
  const u = new URL(route.request().url());
  if(u.origin !== origin) {if(u.hostname !== 'fonts.googleapis.com') external.push(u.href);return route.abort();}
  if(process.env.APP_URL) return route.continue();
  if(u.pathname === '/') return route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'templates/index.html'),'utf8').replace(/\{% for model_id, label in models.items\(\) %\}[\s\S]*?\{% endfor %\}/g,'<option value="gemini-3.8-flash">Gemini 3.8 Flash</option>') .replace(/\{\{ url_for\('static', filename='([^']+)'\) \}\}/g,'/static/$1')});
  if(u.pathname.startsWith('/static/')) return route.fulfill({path:path.join(root,u.pathname)});
  if(u.pathname === '/analyze_image') return route.fulfill({json:{metadata:'Offline fixture',semantic:'A rectangle',layout:'Centered',content_styling:'Gradient',ocr:'Hello'}});
  if(u.pathname === '/refine_svg') assert.equal(typeof route.request().postDataJSON().svg_code,'string');
  if(u.pathname === '/convert_to_svg') assert.equal(route.request().postDataJSON().analysis_data.metadata,'Offline fixture');
  return route.fulfill({json:{svg_code:bad}});
 });
 await page.goto(origin);
 if(process.env.SCREENSHOT_DIR) {fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.SCREENSHOT_DIR,'desktop-before.png'),fullPage:true});}
 async function edit(code) {
  const revision=await page.locator('#svg-preview').getAttribute('data-revision');
  await page.locator('#svg-code-editor').fill(code);
  await page.waitForFunction(old=>document.querySelector('#svg-preview').dataset.revision !== old,revision);
 }
 async function safe() {
  const unsafe=await page.locator('#svg-preview').evaluate(el=>!!el.querySelector('script,foreignObject,image,style,animate,[onmouseover],a[href^="javascript:"]'));
  assert.equal(unsafe,false,'preview must remove active content and resource loads');
 }
 // DTD/entity amplification is rejected before either XML parser is invoked.
 await page.evaluate(()=>window.__parserCalls=0);
 await edit('<!DOCTYPE svg [<!ENTITY a "amplified text">]><svg xmlns="http://www.w3.org/2000/svg"><text>&a;</text></svg>');
 assert.equal(await page.evaluate(()=>window.__parserCalls),0,'declarations rejected before parsing');
 assert((await page.locator('#svg-preview').textContent()).includes('DTD/entity'));
 // Complexity limits reject the complete document, never silently truncate it.
 const wrap=body=>`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50">${body}</svg>`;
 for(const [code,reason] of [
  [wrap('<rect/>'.repeat(2000)), 'elements'],
  [wrap('<rect x="1" y="1" width="1" height="1" rx="1" ry="1" opacity="1"/>'.repeat(1900)), 'attributes'],
  [wrap('<g>'.repeat(32)+'<rect/>'+'</g>'.repeat(32)), 'nesting'],
  [wrap('<path d="M0 0 '+ 'L1 1 '.repeat(10000)+'"/>'), 'geometry'],
  [wrap('<text>'+ 'x'.repeat(32769)+'</text>'), 'text'],
  [wrap('<defs><g id="a"><use href="#a"/></g></defs><use href="#a"/>'),'Cyclic'],
  [wrap('<defs><g id="a">'+ '<rect/>'.repeat(100)+'</g></defs>'+ '<use href="#a"/>'.repeat(100)), 'expansion'],
  [wrap('<pattern id="p" width="0.001" height="0.001"/>'), 'Pattern'],
  [wrap('<rect width="1e999"/>'), 'finite'],
  [wrap('<use href="#missing"/>'), 'no definition'],
  [' '.repeat(262145), 'source length'],
 ]) {
  await edit(code);assert.equal(await page.locator('#svg-preview svg').count(),0);
  assert((await page.locator('#svg-preview').textContent()).includes(reason),reason);
  assert.equal(await page.locator('#save-btn').isDisabled(),true);
 }
 const nearNodes=valid.replace('</svg>','<g>'+ '<circle r="1"/>'.repeat(1980)+'</g></svg>');
 await edit(nearNodes);assert.equal(await page.locator('#svg-preview circle').count(),1980,'near-node-limit geometry preserved');
 assert.equal(await page.locator('#svg-preview text').textContent(),'Hello');
 assert.equal(await page.locator('#svg-preview linearGradient').count(),1);
 const nearGeometry=valid.replace('</svg>','<path d="M0 0 '+ 'L1 1 '.repeat(9990)+'"/></svg>');
 await edit(nearGeometry);assert((await page.locator('#svg-preview path').getAttribute('d')).trim() === ('M0 0 '+ 'L1 1 '.repeat(9990)).trim(),'near-geometry-limit path not truncated');
 const nearText='x'.repeat(32760);
 await edit(valid.replace('Hello',nearText));assert.equal((await page.locator('#svg-preview text').textContent()).length,32760,'near-text-limit content preserved');
 const nearDepth=valid.replace('</svg>','<g>'.repeat(29)+'<circle r="1"/>'+'</g>'.repeat(29)+'</svg>');
 await edit(nearDepth);assert.equal(await page.locator('#svg-preview circle').count(),1);
 const nearReferences=valid.replace('</svg>','<defs><g id="many">'+ '<circle r="1"/>'.repeat(99)+'</g></defs>'+ '<use href="#many"/>'.repeat(97)+'</svg>');
 await edit(nearReferences);assert.equal(await page.locator('#svg-preview use').count(),97,'near-expansion-limit references preserved: '+(await page.locator('#svg-preview').textContent()).slice(0,300));
 const nearSource=valid.replace('</svg>','<!--'+ 'x'.repeat(262144-valid.length-7)+'--></svg>');
 await edit(nearSource);assert.equal(await page.locator('#svg-preview text').textContent(),'Hello');
 await edit(nearGeometry);
 const nearDownload=page.waitForEvent('download');await page.locator('#save-btn').click();
 assert(fs.readFileSync(await (await nearDownload).path(),'utf8').includes('Hello'),'near-limit SVG exports valid text');
 const nearPng=page.waitForEvent('download');await page.locator('#save-png-btn').click();assert.equal(fs.readFileSync(await (await nearPng).path()).subarray(1,4).toString(),'PNG');
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
 await page.reload(); await page.locator('#refine-btn').focus();await page.keyboard.press('Tab');assert(await page.locator('#history-list button').first().evaluate(el=>el===document.activeElement),'history is in the native Tab order');await page.keyboard.press('Enter');await safe();
 await edit(valid);await page.locator('#history-list button').first().focus();await page.keyboard.press('Space');await safe();
 await page.locator('#prompt').fill('offline');
 if(process.env.APP_URL) {
  const localSource=await page.locator('#svg-code-editor').inputValue();
  await page.locator('#generate-btn').click();
  await page.waitForFunction(()=>document.querySelector('#status-message').textContent.includes('Sign in'));
  await safe();assert.equal(await page.locator('#svg-code-editor').inputValue(),localSource,'authorization failure preserves local work');
  const forged=await page.evaluate(async()=>{const r=await fetch('/generate',{method:'POST',headers:{'Content-Type':'application/json','X-User':'alice',Origin:location.origin,Authorization:'Bearer forged'},body:JSON.stringify({prompt:'fixture'})});return r.status;});
  assert.equal(forged,401,'caller-chosen headers are not identity');
  const identity=JSON.parse(fs.readFileSync(path.join(root,'work/browser-identity.json'),'utf8'));
  await page.setExtraHTTPHeaders({Authorization:'Bearer '+identity.token});
 }
 await page.locator('#generate-btn').click();await page.waitForFunction(()=>document.querySelector('#status-message').textContent.includes('successfully'));await safe();
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
 console.log('PASS: malicious editor/history/mocked generation/refinement, image analysis/upload isolation and recreation, URL variants, immediate sanitized SVG download, valid geometry/gradient/text, default/custom PNG dimensions and pixels, invalid SVG, raster cap, fonts/focus/themes, paid unauthorized/authorized admission, native keyboard history');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
