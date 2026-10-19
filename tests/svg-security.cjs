const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const valid = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><defs><linearGradient id="g"><stop stop-color="red"/><stop offset="1" stop-color="blue"/></linearGradient></defs><rect width="100" height="50" fill="url(#g)"/><text x="5" y="25">Hello</text></svg>';
const bad = valid.replace('</svg>', '<script>window.pwned=1</script><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">bad</div></foreignObject><image href="https://evil.invalid/image"/><a href="javascript:alert(1)"><text>link</text></a><rect onmouseover="window.pwned=1" fill="url(https://evil.invalid/paint)"/><style>@import "https://evil.invalid/css";</style><animate attributeName="href" values="https://evil.invalid/x"/></svg>');
(async () => {
 const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args:['--no-sandbox']});
 try {
 const page = await browser.newPage(); const external=[];
 await page.route('**/*', route => {
  const u = new URL(route.request().url());
  if(u.hostname !== 'svg.test') {if(u.hostname !== 'fonts.googleapis.com') external.push(u.href);return route.abort();}
  if(u.pathname === '/') return route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'templates/index.html'),'utf8').replace(/\{\{ url_for\('static', filename='([^']+)'\) \}\}/g,'/static/$1')});
  if(u.pathname.startsWith('/static/')) return route.fulfill({path:path.join(root,u.pathname)});
  if(u.pathname === '/analyze_image') return route.fulfill({json:{metadata:'Offline fixture',semantic:'A rectangle',layout:'Centered',content_styling:'Gradient',ocr:'Hello'}});
  return route.fulfill({json:{svg_code:bad}});
 });
 await page.goto('http://svg.test');
 async function edit(code) {await page.locator('#svg-code-editor').fill(code);await page.waitForTimeout(400);}
 async function safe() {
  const unsafe=await page.locator('#svg-preview').evaluate(el=>!!el.querySelector('script,foreignObject,image,style,animate,[onmouseover],a[href^="javascript:"]'));
  assert.equal(unsafe,false,'preview must remove active content and resource loads');
 }
 await edit(bad); await safe();
 const variants = ['<g onload="alert(1)"/>', '<use href="//evil.invalid/x"/>', '<use href="data:image/svg+xml,bad"/>', '<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://evil.invalid/x"/>', '<rect style="fill:url(https://evil.invalid/x)"/>', '<rect fill="url(&quot;https://evil.invalid/x&quot;)"/>', '<a href="java&#x73;cript:alert(1)">x</a>', '<set attributeName="onload" to="alert(1)"/>'];
 for (const payload of variants) {
  const clean = await page.evaluate(source=>SvgSafety.serializeSvg(source),valid.replace('</svg>',payload+'</svg>'));
  assert(clean && !/evil.invalid|onload|javascript:|xlink:href|<set|style=/.test(clean),payload);
 }
 assert.deepEqual(external,[],'no external loads');
 assert.equal(await page.evaluate(()=>window.pwned),undefined);
 // Saved history is untrusted, including legacy records.
 await page.evaluate(svgCode=>sessionStorage.setItem('svgGeneratorHistory',JSON.stringify([{prompt:'history',svgCode,complexity:3,colorUsage:3,timestamp:Date.now()}])),bad);
 await page.reload(); await page.locator('#history-list li').first().click();await safe();
 await page.locator('#prompt').fill('offline');await page.locator('#generate-btn').click();await page.waitForTimeout(200);await safe();
 await page.locator('#refinement-prompt').fill('offline refine');await page.locator('#refine-btn').click();
 await page.waitForFunction(()=>document.querySelector('#refine-status').textContent.includes('successful'));await safe();
 await page.locator('[data-tab="extractor-tab-content"]').click();
 await page.locator('#image-upload').setInputFiles({name:'fixture.svg',mimeType:'image/svg+xml',buffer:Buffer.from(bad)});
 await page.locator('#analyze-btn').click();await page.waitForFunction(()=>document.querySelector('#analysis-metadata')?.value === 'Offline fixture');
 assert.equal(await page.evaluate(()=>window.pwned),undefined,'uploaded SVG stays in image context');
 await page.locator('[data-tab="generator-tab-content"]').click();
 // Export immediately after editing, inside the preview debounce window.
 await page.locator('#svg-code-editor').fill(bad);
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
 await edit('<svg>');assert.equal(await page.locator('#svg-preview svg').count(),0);
 assert.deepEqual(external,[],'no untrusted external loads across all workflows');
 console.log('PASS: malicious editor/history/mocked generation/refinement, image analysis/upload isolation, URL variants, immediate sanitized SVG download, valid geometry/gradient/text, default/custom PNG dimensions and pixels, invalid SVG');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
