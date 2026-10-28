// Optional browser regression. Requires Playwright and its Chromium browser.
// CHROMIUM_PATH and PLAYWRIGHT_MODULE can point to an existing installation.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),key='ipcheck-unified-night-v1',guideKey='ipcheck-campaign-guide-v1';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.mp3':'audio/mpeg'};
(async()=>{
  const server=http.createServer((req,res)=>{
    const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html')));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try{
    browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
    const url=`http://127.0.0.1:${server.address().port}/`,errors=[],contexts=[];
    async function open(options={}){
      const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',...options});contexts.push(context);
      const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));return {context,page};
    }
    const stored=(page,k=key)=>page.evaluate(k=>localStorage.getItem(k),k);
    const guideAction=(page,type,id)=>page.locator(`[data-guide-action="${type}"]${id?`[data-id="${id}"]`:''}`);
    const order=page=>page.locator('[data-response]').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.response,text:n.textContent})));
    async function screenshot(page,name){if(process.env.UI_SCREENSHOT_DIR){fs.mkdirSync(process.env.UI_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.UI_SCREENSHOT_DIR,name+'.png'),fullPage:true});}}
    async function noOverflow(page){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow');}
    async function investigate(page,checkDraft=false){
      await page.locator('[data-event="begin"]').click();
      if(checkDraft){
        await page.locator('#c-message').fill('这份材料的时间能再解释一下吗？');
        const before=await stored(page);await page.locator('#campaign-guide-open').click();
        await guideAction(page,'ask','journey').click();await page.locator('[data-guide-close="skip"]').click();
        assert.equal(await page.locator('#c-message').inputValue(),'这份材料的时间能再解释一下吗？');
        assert.equal(await stored(page),before,'guide actions preserve the save and unsent draft');
      }
      for(const topic of ['1','3'])await page.locator(`[data-question="${topic}"]`).click();
      await page.locator('[data-read="record"]').click();await page.locator('[data-pin="record"]').click();await page.locator('[data-event="simulate"]').click();
    }
    const {page}=await open();await page.goto(url);
    assert.equal(await page.locator('#campaign-guide').evaluate(d=>d.open),true,'first visit opens guide');
    await screenshot(page,'guide-mobile');await noOverflow(page);
    assert.equal(await stored(page),null);
    assert.equal(await guideAction(page,'next').isDisabled(),true);
    await guideAction(page,'ask','journey').click();assert.equal(await guideAction(page,'next').isDisabled(),true);
    await guideAction(page,'ask','location').click();await guideAction(page,'next').click();
    await guideAction(page,'read','echo').click();await guideAction(page,'select','echo').click();assert.equal(await guideAction(page,'next').isDisabled(),true);
    await guideAction(page,'read','original').click();await guideAction(page,'select','original').click();await guideAction(page,'next').click();
    await guideAction(page,'answer','agree').click();assert.equal(await guideAction(page,'next').isDisabled(),true);
    await guideAction(page,'answer','correct').click();await guideAction(page,'next').click();
    await guideAction(page,'verdict','out').click();assert.equal(await guideAction(page,'next').isDisabled(),true);
    await guideAction(page,'verdict','hold').click();await guideAction(page,'next').click();
    await page.locator('[data-guide-close="done"]').click();
    await page.waitForFunction(k=>localStorage.getItem(k)==='done',guideKey);
    assert.equal(await stored(page),null,'practice never creates a formal save');
    await page.reload();assert.equal(await page.locator('#campaign-guide').evaluate(d=>d.open),false);
    const skipped=await open({viewport:{width:320,height:568}});await skipped.page.goto(url);
    assert.ok(await skipped.page.locator('#campaign-guide').evaluate(d=>d.scrollWidth<=d.clientWidth),'small-screen guide has no internal horizontal overflow');
    await skipped.page.locator('[data-guide-close="skip"]').click();
    await skipped.page.waitForFunction(k=>localStorage.getItem(k)==='done',guideKey);
    await skipped.page.reload();assert.equal(await skipped.page.locator('#campaign-guide').evaluate(d=>d.open),false,'skipping is remembered');
    await page.locator('[data-ui="new"]').click();const firstSeed=JSON.parse(await stored(page)).seed;
    for(let chapter=0;chapter<3;chapter++){
      await investigate(page,chapter===0);
      if(chapter===0){
        assert.equal(await page.locator('.c-sim-help').evaluate(d=>d.open),false);
        assert.equal(await page.locator('.c-sim-evidence').evaluate(d=>d.open),false);
        await page.evaluate(()=>scrollTo(0,0));await noOverflow(page);
        const question=(await page.locator('#c-current-question').boundingBox()).y,choice=(await page.locator('[data-response]').first().boundingBox()).y;
        assert.ok(question<550,`mobile question y=${question}`);assert.ok(choice<670,`mobile first option y=${choice}`);
        console.log(`390px mobile: question starts at ${Math.round(question)}px; first option at ${Math.round(choice)}px.`);
        await screenshot(page,'compact-mobile');
        for(const width of [320,375,650,768,1440]){
          await page.setViewportSize({width,height:900});await noOverflow(page);
          if(width===320){await page.evaluate(()=>scrollTo(0,0));assert.ok((await page.locator('[data-response]').first().boundingBox()).y<800);}
          if(width===1440)await screenshot(page,'compact-desktop');
        }
        await page.setViewportSize({width:390,height:844});
        const before=await stored(page),buttons=await order(page);
        await page.locator('#campaign-guide-open').click();await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(()=>document.getElementById('campaign-guide').contains(document.activeElement)),true,'native modal contains keyboard focus');
        await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.getElementById('campaign-guide').open);
        assert.equal(await page.evaluate(()=>document.activeElement.id),'campaign-guide-open');
        assert.equal(await stored(page),before,'replaying and skipping guide preserve the exact formal save');
        assert.deepEqual(await order(page),buttons);
        await page.locator('.c-sim-evidence summary').click();
        assert.equal(await page.locator('.c-sim-evidence').evaluate(d=>d.open),true);
        assert.ok((await page.locator('.c-sim-evidence').textContent()).includes('南京公寓'));
        await page.locator('[data-ui="chat"]').click();await page.locator('[data-ui="reverse"]').click();
        assert.equal(await page.locator('.c-sim-evidence').evaluate(d=>d.open),true,'manual disclosure survives rerender');
        await page.locator('.c-sim-evidence summary').click();
        await page.reload();await page.locator('[data-ui="continue"]').click();assert.deepEqual(await order(page),buttons);
      }
      for(let round=0;round<3;round++){
        const answer=(await order(page)).find(x=>x.id==='0').text.replace(/^0[123]/,'');
        await page.locator('[data-response="0"]').click();
        assert.equal(JSON.parse(await stored(page)).simulation.history.at(-1).answer,answer);
        assert.equal(await page.locator('.c-sim-history').evaluate(d=>d.open),false,'history does not push current question down');
        if(round<2)assert.ok(await page.locator('#c-current-question').isVisible());
      }
      await page.locator('.c-sim-history summary').click();assert.equal(await page.locator('.c-sim-history article').count(),3);
      await page.locator(`[data-verdict="${['cn','out','hold'][chapter]}"]`).click();await page.locator('[data-event="next"]').click();
    }
    const finished=JSON.parse(await stored(page));assert.equal(finished.phase,'finished');assert.equal(finished.score,378);assert.equal(finished.fragments,3);
    await page.locator('[data-ui="new"]').click();assert.notEqual(JSON.parse(await stored(page)).seed,firstSeed);
    const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/campaign-v1.json'),'utf8'));
    const old=await open();await old.context.addInitScript(({key,legacy})=>localStorage.setItem(key,JSON.stringify(legacy)),{key,legacy});
    await old.page.goto(url);assert.equal(await old.page.locator('#campaign-guide').evaluate(d=>d.open),false,'existing saves do not trigger an onboarding interruption');
    await old.page.locator('[data-ui="continue"]').click();assert.deepEqual((await order(old.page)).map(x=>x.id),['2','1','0']);
    await old.page.locator('.c-sim-history summary').click();assert.ok((await old.page.locator('.c-sim-history').textContent()).includes(legacy.simulation.history[0].answer));
    await old.page.locator('[data-response="1"]').click();assert.equal(JSON.parse(await stored(old.page)).simulation.history.at(-1).delta,30);
    const blocked=await open();await blocked.context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')};});
    await blocked.page.goto(url);await blocked.page.locator('[data-guide-close="skip"]').click();
    await blocked.page.locator('[data-ui="new"]').click();await investigate(blocked.page);assert.equal(await blocked.page.locator('[data-response]').count(),3);
    await blocked.page.locator('#campaign-guide-open').click();await blocked.page.keyboard.press('Escape');assert.equal(await blocked.page.locator('[data-response]').count(),3);
    assert.deepEqual(errors,[]);for(const context of contexts)await context.close();
    console.log('Browser passed: full guide and wrong-answer retry, first-visit/skip/replay/Escape/focus, isolated formal saves, compact mobile positions, 320–1440px overflow, disclosures, three-case run, reload, legacy saves and blocked storage.');
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;});
