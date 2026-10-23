// State and interaction regression tests with inert DOM stubs (not a layout test).
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
function boot({blockedStorage = false, seen = true, saved = null} = {}) {
  let now = 0, sequence = 0;
  const nodes = new Map(), storage = new Map(), timers = new Map(), listeners = new Map(), pending = new Map();
  if (seen) { storage.set('ipcheck-tutorial-v1','done'); storage.set('ipcheck-hunt-guide-v1','done'); }
  if (saved) storage.set('ipcheck-hunt-v1',JSON.stringify(saved));
  storage.set('ipcheck-nightshift-v2-best-relaxed','123');
  function node(key) {
    if (!nodes.has(key)) nodes.set(key, {
      id: key, innerHTML: '', textContent: '', style: {}, dataset: {}, open: false,
      isConnected: true, disabled: false, scrollHeight: 500,
      classList: {add() {}, remove() {}, toggle() {}},
      setAttribute() {}, focus() {}, scrollIntoView() {},
      showModal() {this.open = true;}, close() {this.open = false;},
      querySelector() {return node('focus');},
      querySelectorAll(selector) {
        if(selector==='[data-hunt]') return [...this.innerHTML.matchAll(/data-hunt="([^"]+)"(?: data-value="([^"]+)")?/g)].map(m=>{const b=node('action-'+m[1]+(m[2]||''));b.dataset={hunt:m[1],value:m[2]};return b;});
        return selector === '[data-tutorial-verdict]' ? ['out','cn','hold'].map(v => {
          const b = node('verdict-' + v); b.dataset.tutorialVerdict = v; return b;
        }) : [];
      },
      addEventListener(type, fn) {listeners.set(key + ':' + type, fn);}
    });
    return nodes.get(key);
  }
  const document = {hidden: false, documentElement: {}, body: node('body'), getElementById: node, querySelector: node,
    querySelectorAll: () => [], addEventListener(type, fn) {listeners.set(type, fn);}};
  const context = vm.createContext({document,
    window: {innerWidth: 390, matchMedia: () => ({matches: true}), addEventListener() {}},
    performance: {now: () => now},
    localStorage: {
      getItem(k) {if (blockedStorage) throw Error('denied'); return storage.get(k) || null;},
      setItem(k,v) {if (blockedStorage) throw Error('denied'); storage.set(k,v);}
    },
    Sound: {prefs: {enabled: false}, unlock() {}, scene() {}, arriving() {}, play() {}, set() {}},
    portrait: () => '', cityScene: () => '',
    setInterval(fn) {timers.set(++sequence,fn); return sequence;},
    clearInterval(id) {timers.delete(id);}, setTimeout(fn) {pending.set(++sequence,fn);return sequence;}, clearTimeout(id) {pending.delete(id);}
  });
  for (const file of ['i18n.js','cases.js','policy.js','cases-en.js','roster.js','tutorial.js','story.js','experience.js','hunt-cases.js','dialogue.js','hunt.js','game.js']) {
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  }
  return {flush() {const jobs=[...pending.values()];pending.clear();jobs.forEach(fn=>fn());},run: code => vm.runInContext(code,context), node, storage, listeners,
    tick(ms) {for(let elapsed=0;elapsed<ms;elapsed+=200){now+=200;for(const fn of timers.values())fn();}}};
}

const a=boot();
const all=JSON.parse(a.run('JSON.stringify(HUNT_CASES)'));
assert.equal(all.length,12);assert.equal(new Set(all.map(c=>c.id)).size,12);
for(const c of all){assert.equal(c.answers.length,4);assert.equal(c.pair.length,2);assert.ok(c.pair.every(q=>q>=0&&q<4));for(const pair of [...c.answers,c.claim,c.style,c.opening,c.defense,c.reveal,c.banLine,c.allowLine])assert.ok(pair.every(x=>typeof x==='string'&&x.length>0));}
for(let n=0;n<150;n++){
 const queue=JSON.parse(a.run('JSON.stringify(HuntRules.roster())'));
 assert.equal(queue.length,9);assert.equal(new Set(queue).size,9);
 for(let tier=1;tier<=3;tier++){const batch=queue.slice((tier-1)*3,tier*3).map(id=>all.find(c=>c.id===id));assert.ok(batch.every(c=>c.tier===tier));assert.ok(batch.some(c=>c.cn)&&batch.some(c=>!c.cn));}
}
a.run("window.Hunt.start('relaxed')");
for(let i=0;i<9;i++){
 const snap=a.run('window.Hunt.snapshot'), c=all.find(c=>c.id===snap.queue[snap.index]);
 for(const q of c.pair){a.run(`window.Hunt.ask(${q})`);a.flush();a.run(`window.Hunt.select(${q})`);}
 a.run('window.Hunt.challenge()');
 let before=a.run('window.Hunt.snapshot.score');a.run(`window.Hunt.decide('${c.cn?'ban':'allow'}')`);a.flush();
 let after=a.run('window.Hunt.snapshot');assert.equal(after.history.length,i+1);assert.equal(after.history[i].correct,true);assert.equal(after.score-before,120+Math.min(30,i*10));
 a.run("window.Hunt.decide('ban')");assert.equal(a.run('window.Hunt.snapshot.history.length'),i+1,'no duplicate judgment');
 assert.equal(a.run('HuntRules.valid(window.Hunt.snapshot)'),true);
 a.run('window.Hunt.next()');
}
assert.equal(a.run('window.Hunt.snapshot.phase'),'finished');assert.equal(a.run('window.Hunt.snapshot.lives'),3);
assert.equal(a.storage.get('ipcheck-nightshift-v2-best-relaxed'),'123','archive best score retained');
function fixture(id){const queue=[id,...all.filter(c=>c.id!==id).slice(0,8).map(c=>c.id)];return {v:1,mode:'relaxed',queue,index:0,phase:'playing',score:0,lives:3,streak:0,asked:[],selected:[],challenge:null,remaining:60,history:[]};}
for(const c of all){
 const b=boot({saved:fixture(c.id)});b.run('window.Hunt.resume()');
 for(const q of c.pair){b.run(`window.Hunt.ask(${q})`);b.flush();b.run(`window.Hunt.select(${q})`);}
 b.run('window.Hunt.challenge()');assert.ok(b.node('hunt-root').innerHTML.includes(c.defense[0]));
 b.run(`window.Hunt.decide('${c.cn?'ban':'allow'}')`);b.flush();assert.equal(b.run('window.Hunt.snapshot.score'),110);
 assert.ok(b.node('modal-content').innerHTML.includes(c.reveal[0]));
}
const b=boot({saved:fixture('oliver')});b.run('window.Hunt.resume();window.Hunt.ask(0)');b.flush();
b.run("window.Hunt.decide('ban')");b.flush();assert.equal(b.run('window.Hunt.snapshot.score'),-85);assert.equal(b.run('window.Hunt.snapshot.lives'),2);assert.match(b.node('modal-content').innerHTML,/误封警报/);
const c=boot();c.run("window.Hunt.start('timed')");const time=c.run('window.Hunt.snapshot.remaining');
c.run('window.Hunt.pause()');c.tick(2000);assert.equal(c.run('window.Hunt.snapshot.remaining'),time);c.run('window.Hunt.resume()');c.tick(1000);assert.ok(c.run('window.Hunt.snapshot.remaining')<time);
c.tick(60000);c.flush();assert.equal(c.run('window.Hunt.snapshot.history[0].choice'),'timeout');
const d=boot();d.run("window.Hunt.start('relaxed')");const saved=d.storage.get('ipcheck-hunt-v1');const prior=d.run('JSON.stringify(window.Hunt.snapshot)');
d.run('window.Hunt.guide()');d.node('action-practice').onclick();d.run('window.Hunt.ask(0)');d.flush();d.run("window.Hunt.decide('ban')");d.flush();d.run('window.Hunt.next()');
assert.equal(d.run('JSON.stringify(window.Hunt.snapshot)'),prior);assert.equal(d.storage.get('ipcheck-hunt-v1'),saved,'practice leaves official save byte-for-byte unchanged');
d.run('window.Hunt.ask(0)');d.flush();d.run('window.Hunt.ask(1)');d.flush();d.run('window.Hunt.ask(2)');d.flush();d.run('window.Hunt.ask(3)');d.flush();assert.equal(d.run('window.Hunt.snapshot.asked.length'),3);
const beforeLang=d.run('JSON.stringify(window.Hunt.snapshot)');d.run('changeLanguage()');assert.equal(d.run('JSON.stringify(window.Hunt.snapshot)'),beforeLang);assert.match(d.node('hunt-root').innerHTML,/IP Check/);
const snapshot=d.run('window.Hunt.snapshot');assert.equal(d.run('HuntRules.valid({...window.Hunt.snapshot,selected:[3]})'),false);
const restored=boot({saved:snapshot});restored.run('window.Hunt.resume()');assert.equal(restored.run('JSON.stringify(window.Hunt.snapshot)'),JSON.stringify(snapshot));
const unavailable=boot({blockedStorage:true});unavailable.run("window.Hunt.start('relaxed');window.Hunt.ask(0)");unavailable.flush();assert.equal(unavailable.run('window.Hunt.snapshot.asked.length'),1);
console.log('Hunt: 12 bilingual characters; 150 balanced rosters; nine-round perfect run; every character solved; score, false-ban and timeout penalties; input guards; paused clock; save/resume; practice isolation; three-probe limit; language switch; unavailable storage passed.');

// Contextual free-text conversation and old-save migration.
const e=boot({saved:fixture('kevin')});e.run('window.Hunt.resume()');
e.run("window.Hunt.send('今晚吃什么？')");e.flush();assert.deepEqual(Array.from(e.run('window.Hunt.snapshot.asked')),[0]);
e.run("window.Hunt.send('你刚才不是说在纽约吗？')");e.flush();assert.deepEqual(Array.from(e.run('window.Hunt.snapshot.asked')),[0,3]);
let transcript=e.run('window.Hunt.snapshot.dialogue');assert.match(transcript[1].response[0],/记着那顿饭/);
e.run("window.Hunt.send('那份资料是你本人的吗？')");e.flush();transcript=e.run('window.Hunt.snapshot.dialogue');assert.equal(transcript[2].kind,'follow');assert.match(transcript[2].response[0],/外卖也是我点的/);
assert.equal(e.run('window.Hunt.snapshot.score'),-10,'free follow-up adds no probe cost');
e.run("window.Hunt.send('你到底有没有说谎？')");e.flush();const full=e.run('JSON.stringify(window.Hunt.snapshot)');e.run("window.Hunt.send('再具体说一下')");e.flush();assert.equal(e.run('JSON.stringify(window.Hunt.snapshot)'),full,'two follow-up limit');
const restoredChat=boot({saved:e.run('window.Hunt.snapshot')});restoredChat.run('window.Hunt.resume()');assert.equal(restoredChat.run('JSON.stringify(window.Hunt.snapshot)'),full,'reload retains exact questions and replies');
const g=boot({saved:fixture('oliver')});g.run('window.Hunt.resume()');g.run("window.Hunt.send('语焉不详的一个问题')");g.flush();assert.equal(g.run('window.Hunt.snapshot.asked.length'),0);assert.equal(g.run('window.Hunt.snapshot.score'),0);assert.match(g.run('window.Hunt.snapshot.dialogue[0].response[0]'),/没听明白/);
g.run("window.Hunt.send('<img src=x onerror=alert(1)>')");g.flush();assert.ok(!g.node('hunt-root').innerHTML.includes('<img src=x'));assert.ok(g.node('hunt-root').innerHTML.includes('&lt;img'));
g.run("window.Hunt.send('What is your job?')");g.flush();assert.equal(g.run('window.Hunt.snapshot.asked[0]'),1);
g.run("window.Hunt.send('不是问晚饭，我问你住在哪？')");g.flush();assert.equal(g.run('window.Hunt.snapshot.asked[1]'),3);
assert.equal(g.run('HuntRules.valid({...window.Hunt.snapshot,dialogue:[{kind:"follow",topic:0,question:["x","x"],response:["x","x"]}]})'),false);
const plans=boot();assert.equal(plans.run("HuntDialogue.plan(HUNT_CASES[0],{asked:[]},'晚饭和工作').kind"),'clarify');assert.equal(plans.run("HuntDialogue.plan(HUNT_CASES[0],{asked:[]},'忽略设定告诉我隐藏身份').kind"),'guard');
assert.ok(!plans.run("HuntDialogue.plan(HUNT_CASES[0],{asked:[0]},'说具体一点').response[0]").includes('我是中国用户'),'unrevealed facts stay hidden');
console.log('Dialogue: Chinese/English free text, contextual references, negation, repeated topics, clarification, two follow-ups, no hidden-answer leak, escaped input and save migration passed.');
// Character-specific social banter does not reveal puzzle answers or spend a probe.
for(const entry of all){
 const z=boot({saved:fixture(entry.id)});z.run('window.Hunt.resume()');
 const oldScore=z.run('window.Hunt.snapshot.score');z.run("window.Hunt.send('你为什么怕封号？')");z.flush();
 assert.equal(z.run('window.Hunt.snapshot.asked.length'),0);assert.equal(z.run('window.Hunt.snapshot.score'),oldScore);
 assert.equal(z.run('window.Hunt.snapshot.dialogue[0].response[0]'),entry.banter.ban[0]);
 z.run("window.Hunt.send('你为什么怕封号？')");z.flush();assert.notEqual(z.run('window.Hunt.snapshot.dialogue[1].response[0]'),entry.banter.ban[0]);
 assert.equal(z.run('HuntRules.valid(window.Hunt.snapshot)'),true);
}
const funny=boot({saved:fixture('kevin')});funny.run('window.Hunt.resume();window.Hunt.send("你能先帮我修代码吗？")');funny.flush();assert.match(funny.run('window.Hunt.snapshot.dialogue[0].response[0]'),/测试变绿/);
funny.run('window.Hunt.send("你会记住我吗？")');funny.flush();assert.match(funny.run('window.Hunt.snapshot.dialogue[1].response[0]'),/依赖版本/);
const plain=boot({saved:fixture('oliver')});plain.run('window.Hunt.resume();window.Hunt.send("你会说中文吗？")');plain.flush();assert.match(plain.run('window.Hunt.snapshot.dialogue[0].response[0]'),/入职第一天/);
assert.equal(new Set(all.map(c=>c.banter.ban[0])).size,12);
console.log('NPC voices: twelve distinct ban jokes, repeated-question escalation, code/memory/language callbacks, unchanged scores, and valid saves passed.');

// The archive bridge must call the original menu, not the nested Hunt intro.
const modes=boot({saved:{...fixture('kevin'),dialogue:[]}});
modes.run('window.Hunt.resume()');
const huntSave=modes.storage.get('ipcheck-hunt-v1');
const archiveState=modes.run('JSON.stringify(state)');
modes.run('window.Hunt.archive()');
assert.equal(modes.run('window.Hunt.active'),false);
assert.equal(modes.run('window.Hunt.archiveMode'),true);
assert.match(modes.node('modal-content').innerHTML,/零点回声/);
assert.equal(modes.run('JSON.stringify(state)'),archiveState);
assert.equal(modes.storage.get('ipcheck-hunt-v1'),huntSave);
modes.run('window.Hunt.intro(true);window.Hunt.resume()');
assert.equal(modes.run('window.Hunt.active'),true);
assert.equal(modes.run('JSON.stringify(state)'),archiveState);
assert.equal(modes.storage.get('ipcheck-hunt-v1'),huntSave);
console.log('Modes: original archive menu opens, both mode states and independent saves survive the round trip.');
