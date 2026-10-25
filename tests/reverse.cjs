const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),C=require(fs.existsSync(path.join(__dirname,'../dist/reverse-core.js'))?'../dist/reverse-core.js':'../reverse-core.js');
let leaves=0,passes=0,fails=0;
function explore(s){assert.ok(s.risk>=0&&s.risk<=100);assert.deepEqual(C.restore(JSON.stringify(s)),s);if(s.finished){leaves++;const r=C.summary(s);r.passed?passes++:fails++;assert.equal(r.passed,s.risk<55);assert.ok(r.score>=0&&r.score<=100);return}for(const c of C.step(s).choices){const n=C.choose(s,c.id);assert.equal(s.history.length+1,n.history.length);explore(n)}}
for(let cover=0;cover<3;cover++)for(let persona=0;persona<3;persona++){
 let seed=0,s;do{s=C.create(String(seed++))}while(s.cover!==cover||s.persona!==persona);explore(s);
 let good=s;for(const id of ['work','home','work','correct','consistent'])good=C.choose(good,id);assert.equal(C.summary(good).passed,true);
 let bad=s;for(const id of ['work','conflict','game','agree','away'])bad=C.choose(bad,id);assert.equal(C.summary(bad).passed,false);assert.equal(C.choose(bad,'work'),bad);
 const work=C.choose(C.choose(s,'work'),'home'),game=C.choose(C.choose(s,'game'),'home');assert.ok(C.step(work).question!==C.step(game).question);assert.equal(C.choose(work,'game').history.at(-1).delta,28);
}
assert.equal(C.restore('{bad'),null);assert.equal(C.restore({v:1,seed:'x',daily:false,history:[{id:'nonexistent'}]}),null);
const canonical=C.create('tampered');const tampered={...canonical,risk:0,cover:99,facts:{activity:'game'}};assert.deepEqual(C.restore(tampered),canonical,'restore replays choices rather than trusting score or facts');
assert.deepEqual(C.create('daily-2026-10-25',true),C.create('daily-2026-10-25',true));
console.log(`Reverse: ${leaves} complete branches across all nine identity/personality pairs; ${passes} passing / ${fails} failing paths; consistency, early ending, daily seed, restored state and malformed saves passed.`);
