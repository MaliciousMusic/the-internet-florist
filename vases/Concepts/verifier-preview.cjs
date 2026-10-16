/* Exercise the actual gallery and its selection file; restore the initial choices. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const {chromium} = require('C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = __dirname;
const url = 'http://127.0.0.1:8787/';
const version = 'belai-vases-400-v1';
const file = path.join(root,'selection.json');
const original = fs.readFileSync(file);
const report = {checks:[],errors:[],externalRequests:[],memory:[]};
const ps = 'C:/Users/agent/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/powershell/pwsh.exe';
function memory() {
  const bytes = Number(execFileSync(ps,['-NoProfile','-Command','(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory * 1024'],{encoding:'utf8'}).trim());
  report.memory.push({freeBytes:bytes});
  assert.ok(bytes>4000000000,`RAM libre insuffisante : ${bytes}`);
}
async function saved(page) {
  await page.waitForFunction(()=>document.getElementById('save-state').textContent==='Enregistré dans selection.json');
}
async function main() {
  let browser;
  try {
    memory();
    browser = await chromium.launch({headless:true,args:['--disable-gpu']});
    memory();
    let context = await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true});
    let page = await context.newPage();
    const observe = page => {
      page.on('pageerror',error=>report.errors.push(error.message));
      page.on('request',request=>{if(/^https?:/.test(request.url())&&!request.url().startsWith(url))report.externalRequests.push(request.url());});
    };
    observe(page);
    await page.goto(url); await saved(page);
    assert.equal(await page.locator('.card').count(),48);
    assert.equal(await page.evaluate(()=>VASE_CONCEPTS.length),400);
    assert.equal(await page.locator('#family option').count(),21);
    await page.locator('.card img').evaluateAll(images=>images.forEach(image=>image.loading='eager'));
    await page.waitForFunction(()=>[...document.querySelectorAll('.card img')].every(image=>image.complete&&image.naturalWidth>0));
    await page.screenshot({path:path.join(root,'preview-desktop.png')});
    report.checks.push('400 concepts, 48 cartes par page, SVG chargés');

    await page.locator('[data-id="C001"] .sketch').click();
    await page.locator('#detail-note').fill('Garder le profil, essayer un bronze clair.');
    await page.locator('#detail-selected').check(); await saved(page);
    let data = JSON.parse(fs.readFileSync(file));
    assert.ok(data.selectedIds.includes('C001'));
    assert.equal(data.notes.C001,'Garder le profil, essayer un bronze clair.');
    await page.screenshot({path:path.join(root,'preview-detail.png')});
    await page.locator('#close-detail').click();
    await page.locator('#search').fill('C042');
    assert.equal(await page.locator('.card').count(),1);
    await page.locator('[data-id="C042"] input').check(); await saved(page);
    await page.reload(); await saved(page);
    assert.equal(await page.locator('#selected-count').textContent(),'2');
    report.checks.push('Cases et notes écrites sur disque et retrouvées après rechargement');

    await page.locator('#show-vocabulary').click();
    await page.waitForFunction(()=>document.querySelectorAll('#vocabulary tr').length===117);
    await page.locator('#close-vocabulary').click();
    await page.locator('#family').selectOption('Feuillage');
    assert.equal(await page.locator('.card').count(),20);
    await page.locator('#select-results').click(); await saved(page);
    assert.equal(JSON.parse(fs.readFileSync(file)).selectedIds.length,21);
    await page.locator('#unselect-results').click(); await saved(page);
    assert.deepEqual(JSON.parse(fs.readFileSync(file)).selectedIds,['C042']);
    await page.locator('#clear-filters').click();
    await page.locator('#material').selectOption('Bronze patiné');
    assert.equal(await page.locator('#result-count').textContent(),'55 pistes');
    await page.locator('#shape').selectOption('Amphore');
    assert.ok((await page.locator('.card').count())<48);
    await page.locator('#search').fill('aucun-vase-de-ce-nom');
    assert.ok(await page.locator('#empty').isVisible());
    await page.locator('#clear-filters').click();
    await page.locator('#next').click();
    assert.equal(await page.locator('.card').first().getAttribute('data-id'),'C049');
    await page.locator('#page-size').selectOption('400');
    assert.equal(await page.locator('.card').count(),400);
    report.checks.push('116 traits, filtres combinés, sélection groupée, pagination et vue 400');

    const downloadWait=page.waitForEvent('download');
    await page.locator('#export').click();
    const download=await downloadWait;
    const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
    assert.deepEqual(exported.selectedIds,['C042']);
    await page.locator('#import').setInputFiles({name:'test-selection.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({catalogueVersion:version,selectedIds:['C007','C400'],notes:{C400:'Tester le verre bleu.'}}))});
    await saved(page);
    assert.deepEqual(JSON.parse(fs.readFileSync(file)).selectedIds,['C007','C400']);
    await page.locator('#selected-view').click();
    assert.equal(await page.locator('.card').count(),2);
    await page.locator('#import').setInputFiles({name:'test-invalide.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({catalogueVersion:version,selectedIds:['C999']}))});
    await page.waitForFunction(()=>document.getElementById('storage-note').textContent.includes('numéro inconnu'));
    assert.deepEqual(JSON.parse(fs.readFileSync(file)).selectedIds,['C007','C400']);
    report.checks.push('Export/import JSON et rejet des numéros inconnus');

    await context.close();
    context=await browser.newContext({viewport:{width:390,height:844}});
    page=await context.newPage(); observe(page);
    await page.goto(url); await saved(page);
    assert.equal(await page.locator('#selected-count').textContent(),'2');
    await page.locator('[data-id="C007"] .sketch').click();
    await page.locator('#detail-next').click();
    await page.locator('#close-detail').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(root,'preview-mobile.png')});
    report.checks.push('Sélection reprise dans un nouveau navigateur, vue mobile sans débordement');
    await context.close();
    memory();

    const invalid = {catalogueVersion:version,selectedIds:['C999'],notes:{}};
    let response = await fetch(url+'api/selection',{method:'PUT',headers:{Origin:url.slice(0,-1),'Content-Type':'application/json'},body:JSON.stringify(invalid)});
    assert.equal(response.status,400);
    response = await fetch(url+'api/selection',{method:'PUT',headers:{Origin:'https://example.org','Content-Type':'application/json'},body:JSON.stringify({catalogueVersion:version,selectedIds:[],notes:{}})});
    assert.equal(response.status,403);
    assert.equal((await fetch(url+'inventaire.json')).status,404);
    assert.equal((await fetch(url+'%2e%2e%2fUnsafe/001/FICHE.md')).status,404);
    assert.equal((await fetch(url+'serve.py')).status,404);
    report.checks.push('Sauvegarde validée, origine extérieure et fichiers de référence inaccessibles');

    context=await browser.newContext(); page=await context.newPage();
    await page.goto('file:///'+path.join(root,'index.html').replace(/\\/g,'/'));
    assert.equal(await page.locator('.card').count(),48);
    await page.locator('#show-vocabulary').click();
    await page.waitForFunction(()=>document.querySelectorAll('#vocabulary tr').length===117);
    await context.close();
    report.checks.push('Mode fichier autonome, avec catalogue et traits disponibles');
    assert.deepEqual(report.errors,[]);
    assert.deepEqual(report.externalRequests,[]);
    console.log(JSON.stringify(report,null,2));
  } finally {
    if(browser) await browser.close();
    fs.writeFileSync(path.join(root,'.selection-restore.tmp'),original);
    fs.renameSync(path.join(root,'.selection-restore.tmp'),file);
    fs.writeFileSync(path.join(root,'verification-preview.json'),JSON.stringify(report,null,2)+'\n');
  }
}
main().catch(error=>{console.error(error);process.exitCode=1;});
