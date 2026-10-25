const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),publicRoot=fs.existsSync(path.join(root,'dist/campaign-core.js'))?path.join(root,'dist'):root;
const context=vm.createContext({});
for(const file of ['cases.js','hunt-cases.js','dialogue.js','campaign-core.js'])vm.runInContext(fs.readFileSync(path.join(publicRoot,file),'utf8'),context,{filename:file});
const C=vm.runInContext('NightCampaign',context),copy=x=>JSON.parse(JSON.stringify(x));
function act(s,e){const n=C.apply(s,e);assert.notEqual(n,s,`event accepted: ${JSON.stringify(e)}`);assert.deepEqual(copy(C.restore(n)),copy(n),'every accepted action restores from canonical events');return n;}
function open(){let s=act(C.create(),{type:'begin'});for(const text of ['最近在忙什么工作或学习？','核对一下地点与本人资料？'])s=act(s,{type:'ask',text});return s;}
function ready(s,id='record'){s=act(s,{type:'read',id});s=act(s,{type:'pin',id});return s;}
let s=C.create();
const sourceBefore=vm.runInContext('JSON.stringify(CASES)',context);
for(let i=0;i<3;i++){
 s=act(s,{type:'begin'});
 assert.equal(C.apply(s,{type:'decide',choice:'out'}),s,'cannot judge before the same visitor has been investigated');
 assert.equal(C.apply(s,{type:'read',id:'record'}),s,'original is locked before a relevant topic');
 for(const text of ['最近在忙什么工作或学习？','核对一下地点与本人资料？'])s=act(s,{type:'ask',text});
 assert.equal(s.asked.length,2);assert.equal(C.records(s).find(r=>r.id==='record').unlock,true);
 s=ready(s);
 for(const topic of [1,3])s=act(s,{type:'quote',topic});
 s=act(s,{type:'challenge'});assert.equal(s.challenge.hit,true);
 s=act(s,{type:'simulate'});const pinned=s.simulation.evidence;
 assert.equal(pinned,'record');assert.ok(C.simStep(s).question.includes(C.records(s).find(r=>r.id==='record').title));
 assert.equal(C.apply(s,{type:'pin',id:'record'}),s,'evidence cannot change inside its own simulation');
 for(let j=0;j<3;j++)s=act(s,{type:'respond',choice:0});
 assert.equal(s.simulation.finished,true);assert.ok(s.simulation.risk<55);assert.equal(s.fragments,i+1);
 assert.equal(C.records(s).find(r=>r.id==='audit').unlock,true,'successful reversal restores a log in the same case');
 const c=C.source(s);s=act(s,{type:'decide',choice:c.decision});
 assert.equal(s.history.at(-1).grounded,true);assert.equal(s.history.at(-1).caseId,c.id);
 assert.equal(C.apply(s,{type:'decide',choice:c.decision}),s,'no duplicate verdict or reward');
 s=act(s,{type:'next'});
}
assert.equal(s.phase,'finished');assert.equal(s.errors,0);assert.equal(s.fragments,3);assert.equal(s.score,402);assert.match(C.ending(s).rank,/恢复/);
assert.equal(vm.runInContext('JSON.stringify(CASES)',context),sourceBefore,'archive data is never rewritten by the campaign');
// All 27 reversal paths per chapter remain reachable, restore correctly and feed the verdict.
let paths=0;
for(let index=0;index<3;index++){
 let base=C.create();
 for(let i=0;i<index;i++){
  base=act(base,{type:'begin'});for(const text of ['最近在忙什么工作或学习？','核对一下地点与本人资料？'])base=act(base,{type:'ask',text});base=ready(base);base=act(base,{type:'simulate'});for(let j=0;j<3;j++)base=act(base,{type:'respond',choice:0});base=act(base,{type:'decide',choice:C.source(base).decision});base=act(base,{type:'next'});
 }
 base=act(base,{type:'begin'});for(const text of ['最近在忙什么工作或学习？','核对一下地点与本人资料？'])base=act(base,{type:'ask',text});base=ready(base);
 for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++){
  let n=act(base,{type:'simulate'});for(const choice of [a,b,c])n=act(n,{type:'respond',choice});
  assert.equal(n.simulation.finished,true);const p=n.simulation.risk<55;
  assert.equal(n.fragments,base.fragments+(p?1:0));assert.equal(C.records(n).some(r=>r.id==='audit'),p);
  const source=C.source(n);n=act(n,{type:'decide',choice:source.decision});assert.equal(n.history.at(-1).grounded,true,'failed simulation never replaces the original evidence');paths++;
 }
}
let cache=ready(open(),'echo'),original=ready(open());cache=act(cache,{type:'simulate'});original=act(original,{type:'simulate'});
assert.notEqual(C.simStep(cache).question,C.simStep(original).question,'selected evidence changes the reverse interrogation');
for(let j=0;j<3;j++)cache=act(cache,{type:'respond',choice:0});
cache=act(cache,{type:'decide',choice:'cn'});assert.equal(cache.history[0].correct,true);assert.equal(cache.history[0].grounded,false,'a correct guess with an auto-summary is not grounded');
let wrong=ready(open());wrong=act(wrong,{type:'simulate'});for(let j=0;j<3;j++)wrong=act(wrong,{type:'respond',choice:1});assert.equal(wrong.simulation.risk,100);assert.equal(wrong.fragments,0);wrong=act(wrong,{type:'decide',choice:'out'});assert.equal(wrong.errors,1);assert.equal(wrong.history[0].delta,-40);
const tampered={...copy(s),score:999999,fragments:999,phase:'desk'};assert.deepEqual(copy(C.restore(tampered)),copy(s),'saves replay events instead of trusting score, fragments or phase');
assert.equal(C.restore('{broken'),null);assert.equal(C.restore({v:1,events:[{type:'decide',choice:'cn'}]}),null);assert.equal(C.restore({v:1,events:Array(1001).fill({type:'begin'})}),null);
const gate=C.create();assert.equal(C.apply(gate,{type:'next'}),gate);assert.equal(C.apply(open(),{type:'respond',choice:0}).simulation,null);
console.log(`Campaign: one three-case run, shared score 402, all ${paths} reversal paths, contextual evidence, unlock gates, grounded/unsupported/wrong verdicts, save replay, duplicate guards and original-case immutability passed.`);
