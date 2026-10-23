// State and interaction regression tests with inert DOM stubs (not a layout test).
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
function boot({blockedStorage = false, seen = false} = {}) {
  let now = 0, sequence = 0;
  const nodes = new Map(), storage = new Map(), timers = new Map(), listeners = new Map();
  if (seen) storage.set('ipcheck-tutorial-v1', 'done');
  function node(key) {
    if (!nodes.has(key)) nodes.set(key, {
      id: key, innerHTML: '', textContent: '', style: {}, dataset: {}, open: false,
      isConnected: true, disabled: false, scrollHeight: 500,
      classList: {add() {}, remove() {}, toggle() {}},
      setAttribute() {}, focus() {}, scrollIntoView() {},
      showModal() {this.open = true;}, close() {this.open = false;},
      querySelector() {return node('focus');},
      querySelectorAll(selector) {
        return selector === '[data-tutorial-verdict]' ? ['out','cn','hold'].map(v => {
          const b = node('verdict-' + v); b.dataset.tutorialVerdict = v; return b;
        }) : [];
      },
      addEventListener(type, fn) {listeners.set(key + ':' + type, fn);}
    });
    return nodes.get(key);
  }
  const document = {hidden: false, documentElement: {}, getElementById: node, querySelector: node,
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
    clearInterval(id) {timers.delete(id);}, setTimeout() {return ++sequence;}, clearTimeout() {}
  });
  for (const file of ['i18n.js','cases.js','policy.js','cases-en.js','roster.js','tutorial.js','story.js','experience.js','game.js']) {
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
  }
  return {run: code => vm.runInContext(code,context), node, storage, listeners,
    tick(ms) {now += ms; for (const fn of timers.values()) fn();}};
}
const a = boot();
assert.equal(a.run('modalKind'), 'tutorial', 'new visitors see the practice');
const original = a.run('JSON.stringify(state)');
a.node('tutorial-next').onclick();
assert.equal(a.run('tutorialSession.step'),1);
a.node('tutorial-next').onclick();
assert.equal(a.run('tutorialSession.step'),1,'cannot skip the investigation action');
a.node('tutorial-investigate').onclick(); a.node('tutorial-next').onclick();
a.node('tutorial-next').onclick();
assert.equal(a.run('tutorialSession.step'),2,'must select evidence');
a.node('tutorial-evidence').onclick();
a.run('changeLanguage()');
assert.equal(a.run('tutorialSession.selected'),true,'language switch retains practice progress');
assert.match(a.node('modal-content').innerHTML,/Step 2: select your evidence/);
a.node('tutorial-next').onclick();
a.node('verdict-cn').onclick(); a.node('tutorial-next').onclick();
assert.equal(a.run('tutorialSession.step'),3,'wrong stamp invites a retry');
assert.match(a.node('modal-content').innerHTML,/Try again/);
a.listeners.get('keydown')({key:'s',preventDefault(){}});
assert.equal(a.run('tutorialSession.verdict'),'hold','practice shortcuts select a practice stamp');
a.node('tutorial-next').onclick();
assert.equal(a.run('tutorialSession.step'),4);
assert.equal(a.run('JSON.stringify(state)'),original,'all practice actions leave the run untouched');
a.node('tutorial-next').onclick();
assert.equal(a.run('modalKind'),'intro');
assert.equal(a.storage.get('ipcheck-tutorial-v1'),'done');
assert.equal(a.storage.has('ipcheck-nightshift-v2'),false,'practice does not save a run');
a.node('intro-tutorial').onclick(); a.node('tutorial-skip').onclick();
assert.equal(a.run('modalKind'),'intro','replay returns to its caller');
a.run("start('timed');closeDialog();openTutorial()");
const ongoing = a.run('JSON.stringify(state)');
a.tick(20000);
assert.equal(a.run('JSON.stringify(state)'),ongoing,'tutorial pauses the formal timer');
let prevented = false;
a.listeners.get('modal:cancel')({preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(a.run('modal.open'),false,'Esc exits the tutorial');
a.tick(1000);
assert.equal(a.run('state.remaining'),89,'timer resumes without charging practice time');
assert.equal(a.run('state.history.length'),0);
assert.equal(a.run('valid(state)'),true,'formal save remains valid');
const b = boot({seen:true});
assert.equal(b.run('modalKind'),'intro','returning players skip automatic practice');
const c = boot({blockedStorage:true});
c.node('tutorial-skip').onclick();
assert.equal(c.run('modalKind'),'intro','blocked storage does not trap the player');
const d = boot({seen:true});
d.run("start('relaxed');closeDialog();investigate(2)");
const beforeReview = d.run('JSON.stringify(state)');
d.node('tutorial-open').onclick();
d.node('tutorial-skip').onclick();
assert.equal(d.run('JSON.stringify(state)'),beforeReview,'header replay preserves an investigated case');
d.run('state.selected=[...cur().required];decide(cur().decision)');
assert.equal(d.run('state.result.grounded'),true,'formal evidence assessment still works');
assert.equal(d.run('state.history.length'),1,'only the formal decision enters history');
console.log('PASS: first visit, gated practice, wrong-answer retry, bilingual progress, unchanged run/save, replay/skip/Esc, paused/resumed clock and unavailable storage.');
