/* Verify the live comparison using one browser, sequentially and within the RAM limit. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {chromium}=require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=__dirname;
const url='http://127.0.0.1:8788/';
const ps='C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
const report={checks:[],errors:[],externalRequests:[],memory:[],screenshots:[]};
function memory(){
  const free=Number(execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());
  report.memory.push(free);assert.ok(free>4000000000,`RAM sous 4 Go : ${free}`);
}
async function main(){
  let browser;
  try {
    memory();
    browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu']});
    memory();
    let context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
    let page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(url))report.externalRequests.push(r.url());});
    await page.goto(url);
    assert.equal(await page.locator('.card').count(),16);
    await page.locator('.stage img').evaluateAll(images=>images.forEach(img=>img.loading='eager'));
    await page.waitForFunction(()=>[...document.querySelectorAll('.stage img')].every(img=>img.complete&&img.naturalWidth>0));
    const sources=await page.locator('.stage img').evaluateAll(images=>images.map(img=>img.getAttribute('src')));
    assert.equal(sources.length,32);assert.ok(sources.every(src=>src.endsWith('.svg')));
    for(const card of await page.locator('.card').all()){
      const sizes=await card.locator('.stage img').evaluateAll(images=>images.map(img=>({w:img.clientWidth,h:img.clientHeight})));
      assert.deepEqual(sizes[0],sizes[1]);
    }
    report.checks.push('16 paires, 32 véritables SVG chargés, cadrage et échelle identiques');
    await page.screenshot({path:path.join(root,'apercus','preview-desktop.png'),fullPage:true});
    report.screenshots.push('preview-desktop.png');
    await page.locator('.toolbar [data-background="sombre"]').click();
    assert.equal(await page.locator('.stage').first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(24, 32, 24)');
    await page.screenshot({path:path.join(root,'apercus','preview-desktop-sombre.png'),fullPage:true});
    report.screenshots.push('preview-desktop-sombre.png');
    await context.close();
    for(let i=0;i<16;i++){
      memory();
      context=await browser.newContext({viewport:{width:1440,height:1050}});
      page=await context.newPage();
      page.on('pageerror',error=>report.errors.push(error.message));
      await page.goto(url);
      await page.locator(`.card [data-open="${i}"]`).first().click();
      await page.waitForFunction(()=>document.getElementById('detail-after').complete&&document.getElementById('detail-after').naturalWidth>0);
      await page.locator('#zoom').focus();
      for(let step=0;step<4;step++)await page.locator('#zoom').press('ArrowRight');
      assert.equal(await page.locator('#zoom-value').textContent(),'200 %');
      await page.locator('#after-view').evaluate(e=>{e.scrollTop=100;e.scrollLeft=50;});
      await page.waitForFunction(()=>document.getElementById('before-view').scrollTop===document.getElementById('after-view').scrollTop);
      if([1,3,7,14,15].includes(i)){
        await page.locator('#zoom').press('Home');
        await page.locator('#detail [data-background="clair"]').click();
        const id=await page.locator('#detail-title').textContent();
        const file=`detail-${id.slice(0,4)}.png`;
        await page.screenshot({path:path.join(root,'apercus',file)});report.screenshots.push(file);
      }
      await page.locator('#close').click();
      await context.close();
    }
    report.checks.push('16 agrandissements, zoom à 200 %, déplacement synchronisé et deux fonds');
    context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
    page=await context.newPage();await page.goto(url);
    await page.locator('.card [data-open="0"]').first().click();
    await page.locator('#before-source').selectOption('previous');
    await page.waitForFunction(()=>document.getElementById('detail-before').complete&&document.getElementById('detail-before').naturalWidth>0);
    assert.ok((await page.locator('#detail-before').getAttribute('src')).startsWith('iterations/v5/apres/'));
    await page.locator('#before-source').selectOption('concept');
    await page.locator('#close').click();
    report.checks.push('Reprise précédente archivée consultable en véritable SVG');
    await page.locator('.card [data-open="1"]').first().click();
    await page.locator('#verdict').selectOption('revise');
    await page.locator('#note').fill('Contrôle temporaire de la note, contexte navigateur isolé.');
    await page.locator('#close').click();
    await page.reload();
    assert.equal(await page.locator('[data-status="C001"]').textContent(),'À reprendre');
    await page.locator('.card [data-open="1"]').first().click();
    assert.equal(await page.locator('#note').inputValue(),'Contrôle temporaire de la note, contexte navigateur isolé.');
    await page.locator('#next').click();assert.ok((await page.locator('#detail-title').textContent()).startsWith('C159'));
    await page.keyboard.press('ArrowLeft');assert.ok((await page.locator('#detail-title').textContent()).startsWith('C001'));
    await page.keyboard.press('Escape');assert.equal(await page.locator('#detail').evaluate(e=>e.open),false);
    const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();
    const download=await downloadPromise;const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
    assert.equal(exported.reviews.length,16);assert.equal(exported.reviews.find(r=>r.id==='C001').verdict,'revise');
    report.checks.push('Notes et avis locaux persistants, export de 16 retours, navigation et fermeture au clavier');
    await context.close();
    memory();
    context=await browser.newContext({viewport:{width:390,height:844}});page=await context.newPage();
    await page.goto(url);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('.card [data-open="0"]').first().click();
    assert.ok(await page.locator('#detail').evaluate(e=>e.clientWidth<=innerWidth));
    await page.screenshot({path:path.join(root,'apercus','preview-mobile.png')});report.screenshots.push('preview-mobile.png');
    await context.close();report.checks.push('Galerie et agrandissement mobiles sans débordement');
    assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalRequests,[]);
    for(const resource of ['serve.py','dessiner.py','../../inventaire.json','%2e%2e%2f%2e%2e%2fUnsafe/005/FICHE.md','apercus/C001-clair.png']){
      const response=await fetch(url+resource);await response.arrayBuffer();assert.equal(response.status,404,resource);
    }
    const svgResponse=await fetch(url+'apres/C017.svg');await svgResponse.arrayBuffer();assert.equal(svgResponse.status,200);
    report.checks.push('Serveur sur loopback, liste explicite, photos et outils inaccessibles, aucune requête extérieure');
    memory();
    console.log(JSON.stringify(report,null,2));
  } finally {
    if(browser)await browser.close();
    fs.writeFileSync(path.join(root,'verification-preview.json'),JSON.stringify(report,null,2)+'\n');
  }
}
main().catch(error=>{report.failure=error.message;fs.writeFileSync(path.join(root,'verification-preview.json'),JSON.stringify(report,null,2)+'\n');console.error(error.message);process.exitCode=1;});
