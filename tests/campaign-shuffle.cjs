const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),context=vm.createContext({});
for(const file of ['cases.js','hunt-cases.js','dialogue.js','campaign-core.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const C=vm.runInContext('NightCampaign',context),copy=x=>JSON.parse(JSON.stringify(x));
function act(s,event){const next=C.apply(s,event);assert.notEqual(next,s);assert.deepEqual(copy(C.restore(next)),copy(next));return next;}
function investigate(s){
  for(const event of [{type:'begin'},{type:'ask',text:'最近在忙什么工作或学习？'},{type:'ask',text:'核对一下地点与本人资料？'},{type:'read',id:'record'},{type:'pin',id:'record'},{type:'simulate'}])s=act(s,event);
  return s;
}
// This fixture was recorded with the pre-upgrade engine, after a wrong answer.
const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'fixtures/campaign-v1.json'),'utf8'));
let old=C.restore(legacy);
assert.deepEqual(copy(old),legacy,'v1 transcript, risk and events survive byte-for-byte');
assert.equal(C.simStep(old).answers[1],'不要再查原件了，直接沿用 ECHO 的自动摘要。');
assert.deepEqual(copy(C.choiceOrder(old)),[2,1,0],'in-progress legacy button order stays unchanged');
old=act(old,{type:'respond',choice:0});old=act(old,{type:'respond',choice:0});
assert.equal(old.simulation.risk,50);assert.equal(old.v,1);assert.equal('seed' in old,false);
old=act(old,{type:'decide',choice:C.source(old).decision});
assert.equal(old.history[0].grounded,true);
old=act(old,{type:'next'});
for(let index=1;index<3;index++){
  old=investigate(old);
  for(let round=0;round<3;round++)old=act(old,{type:'respond',choice:0});
  old=act(old,{type:'decide',choice:C.source(old).decision});old=act(old,{type:'next'});
}
assert.equal(old.phase,'finished');assert.equal(old.fragments,3);

const layouts=Array.from({length:9},()=>new Set());
for(let seed=0;seed<60;seed++){
  let s=C.create('regression-'+seed);
  assert.equal(s.v,2);assert.equal(s.seed,'regression-'+seed);
  assert.deepEqual(copy(C.choiceOrder(s)),[]);
  for(let chapter=0;chapter<3;chapter++){
    s=investigate(s);
    for(let round=0;round<3;round++){
      const before=JSON.stringify(s),order=copy(C.choiceOrder(s)),step=C.simStep(s);
      assert.deepEqual([...order].sort(),[0,1,2],'each semantic answer appears once');
      assert.equal(JSON.stringify(s),before,'rendering choices never mutates the run');
      assert.deepEqual(copy(C.choiceOrder(s)),order,'rerenders do not reshuffle');
      assert.deepEqual(copy(C.choiceOrder(C.restore(JSON.stringify(s)))),order,'reload preserves visible positions');
      layouts[chapter*3+round].add(order.join(''));
      // Simulate clicking the visible position holding the evidence-based answer.
      const visiblePosition=order.indexOf(0),choice=order[visiblePosition];
      const expected={answer:step.answers[choice],reply:step.replies[choice],delta:step.deltas[choice]};
      s=act(s,{type:'respond',choice});const h=s.simulation.history.at(-1);
      assert.deepEqual(copy({answer:h.answer,reply:h.reply,delta:h.delta}),copy(expected));
    }
    assert.equal(s.simulation.risk,1,'position changes do not change scoring');
    assert.deepEqual(copy(C.choiceOrder(s)),[]);
    s=act(s,{type:'decide',choice:C.source(s).decision});s=act(s,{type:'next'});
  }
  assert.equal(s.fragments,3);assert.equal(s.errors,0);assert.equal(s.score,378);
}
for(const orders of layouts)assert.equal(orders.size,6,'all six permutations occur for every round across fixed test seeds');

// Every displayed position maps to the intended answer and its feedback,
// including wrong answers and follow-up text after a correction.
for(let position=0;position<3;position++){
  let s=investigate(C.create('position-'+position));
  for(let round=0;round<3&&!s.simulation.finished;round++){
    const step=C.simStep(s),choice=C.choiceOrder(s)[position],risk=s.simulation.risk;
    s=act(s,{type:'respond',choice});const h=s.simulation.history.at(-1);
    assert.equal(h.answer,step.answers[choice]);assert.equal(h.reply,step.replies[choice]);
    assert.equal(s.simulation.risk,Math.max(0,Math.min(100,risk+step.deltas[choice])));
  }
}
const seeded=investigate(C.create('saved-seed'));
assert.deepEqual(copy(C.restore({...copy(seeded),score:99999,fragments:999})),copy(seeded));
for(const seed of [undefined,null,5,'','x'.repeat(101)])assert.equal(C.restore({v:2,seed,events:[]}),null);
assert.equal(C.restore({v:3,seed:'future',events:[]}),null);
assert.equal(C.restore({v:2,seed:'valid',events:[{type:'respond',choice:0}]}),null);
console.log('Campaign upgrade: 60 seeded complete nights, all six display orders in every round, stable reloads, choice/feedback/score mapping, original v1 save continuation and invalid save guards passed.');
