const assert=require('node:assert/strict');
const P=require('../campaign-guide.js');
let s=P.create();
const act=e=>{const before=JSON.stringify(s),previous=s;const next=P.act(s,e);assert.equal(JSON.stringify(previous),before,'practice actions never mutate prior state');s=next;};
assert.equal(P.ready(s),false);act({type:'next'});assert.equal(s.step,0);
act({type:'ask',id:'unknown'});assert.deepEqual(s.asked,[]);
act({type:'ask',id:'journey'});act({type:'ask',id:'journey'});assert.equal(s.asked.length,1);
act({type:'ask',id:'location'});assert.equal(P.ready(s),true);act({type:'next'});assert.equal(s.step,1);
act({type:'select',id:'original'});assert.equal(P.ready(s),false,'unread evidence cannot be selected');
act({type:'read',id:'echo'});act({type:'select',id:'echo'});assert.equal(P.ready(s),false);assert.match(s.feedback,/推断/);
act({type:'read',id:'original'});act({type:'select',id:'original'});assert.equal(P.ready(s),true);
act({type:'next'});assert.equal(s.step,2);
for(const id of ['agree','guess']){act({type:'answer',id});assert.equal(P.ready(s),false);assert.match(s.feedback,/再试一次/);}
act({type:'answer',id:'correct'});assert.equal(P.ready(s),true);act({type:'next'});assert.equal(s.step,3);
for(const id of ['out','cn']){act({type:'verdict',id});assert.equal(P.ready(s),false);}
act({type:'verdict',id:'hold'});act({type:'next'});assert.equal(s.step,4);
act({type:'next'});assert.equal(s.step,4);act({type:'back'});assert.equal(s.step,3);assert.equal(P.ready(s),true);
act({type:'next'});assert.equal(s.step,4);
assert.deepEqual(P.create(),{step:0,asked:[],opened:[],selected:null,answer:null,verdict:null,feedback:''},'reopening practice starts independently');
assert.equal('score' in s,false);assert.equal('events' in s,false);
console.log('Campaign guide: five-step practice, two-topic gate, read-before-select, original vs summary, wrong-answer retries, verdict gate, back/replay and isolated state passed.');
