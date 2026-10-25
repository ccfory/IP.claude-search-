'use strict';
const HuntRules = (() => {
  function shuffle(items, random = Math.random) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }
  function roster(random = Math.random) {
    return [1, 2, 3].flatMap(tier => {
      const pool = HUNT_CASES.filter(c => c.tier === tier);
      const yes = shuffle(pool.filter(c => c.cn), random), no = shuffle(pool.filter(c => !c.cn), random);
      const third = random() < .5 ? yes[1] : no[1];
      return shuffle([yes[0], no[0], third], random).map(c => c.id);
    });
  }
  function matching(pair, selected) { return selected.length === 2 && pair.every(q => selected.includes(q)); }
  function outcome(c, choice, challenged, streak) {
    const correct = choice !== 'timeout' && (choice === 'ban') === c.cn;
    const nextStreak = correct ? streak + 1 : 0;
    return { correct, streak: nextStreak, bonus: correct ? Math.min(30, streak * 10) : 0,
      delta: correct ? 100 + (challenged ? 20 : 0) + Math.min(30, streak * 10) : choice === 'ban' ? -80 : -50 };
  }
  function valid(s) {
    if (!s || s.v !== 1 || !['relaxed','timed'].includes(s.mode) || !['playing','revealing','result','finished'].includes(s.phase)) return false;
    if (!Array.isArray(s.queue) || s.queue.length !== 9 || new Set(s.queue).size !== 9 || !s.queue.every(id => HUNT_CASES.some(c => c.id === id))) return false;
    if (!Number.isInteger(s.index) || s.index < 0 || s.index > 8 || !Number.isInteger(s.lives) || s.lives < 0 || s.lives > 3) return false;
    if (!['score','streak','remaining'].every(k => Number.isFinite(s[k])) || s.remaining < 0 || s.remaining > 60 || !Number.isInteger(s.streak) || s.streak < 0 || s.streak > 9) return false;
    if (!Array.isArray(s.asked) || s.asked.length > 3 || new Set(s.asked).size !== s.asked.length || !s.asked.every(q => [0,1,2,3].includes(q))) return false;
    if (!Array.isArray(s.selected) || s.selected.length > 2 || new Set(s.selected).size !== s.selected.length || !s.selected.every(q => s.asked.includes(q))) return false;
    if (s.dialogue !== undefined && !HuntDialogue.validTurns(s.dialogue,s.asked)) return false;
    if (s.challenge !== null && (!s.challenge || !Array.isArray(s.challenge.pair) || s.challenge.pair.length !== 2 || new Set(s.challenge.pair).size !== 2 || !s.challenge.pair.every(q => s.asked.includes(q)))) return false;
    if (!Array.isArray(s.history) || s.history.length > 9 || !s.history.every((r,i) => r && r.id === s.queue[i] && ['ban','allow','timeout'].includes(r.choice) && typeof r.correct === 'boolean' && typeof r.challenged === 'boolean' && Number.isFinite(r.delta))) return false;
    const count = s.phase === 'playing' ? s.index : s.index + 1;
    return s.history.length === count && (!['result','revealing','finished'].includes(s.phase) || s.history.length > 0);
  }
  return {shuffle, roster, matching, outcome, valid};
})();

window.Hunt = (() => {
  const KEY = 'ipcheck-hunt-v1', GUIDE = 'ipcheck-hunt-guide-v1';
  let s = null, active = false, archiveMode = false, root = null, bound = false;
  let busy = false, replyTimer = null, revealTimer = null, clock = null, lastTime = performance.now(), epoch = 0;
  let draft = '';
  let training = false, practiceReturn = null, guideReturn = null, menuMode = 'relaxed';
  const text = pair => pair[I18n.lang === 'en' ? 1 : 0];
  const esc = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const tx = pair => esc(text(pair));
  function read(key) { try { return localStorage.getItem(key); } catch { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch {} }
  try { const candidate = JSON.parse(read(KEY)); if (HuntRules.valid(candidate)) { s = candidate; if (s.phase === 'revealing') s.phase = 'result'; } } catch {}
  function saveHunt() { if (s && !training) write(KEY, JSON.stringify(s)); }
  function current() { return HUNT_CASES.find(c => c.id === s.queue[s.index]); }
  function limit() { return 60 - Math.floor(s.index / 3) * 10; }
  function clearPending() { draft=''; epoch++; clearTimeout(replyTimer); clearTimeout(revealTimer); busy = false; }
  function activate() {
    active = true; archiveMode = false;
    root = document.getElementById('hunt-root'); root.hidden = false;
    document.body.classList.add('hunt-active');
    if (!bound) { root.addEventListener('click', onClick); root.addEventListener('submit', e => {if(e.target.id==='hunt-chat-form'){e.preventDefault();sendChat(draft);}}); root.addEventListener('input',e=>{if(e.target.id==='hunt-message')draft=e.target.value;}); root.addEventListener('keydown',e=>{if(e.target.id==='hunt-message'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();e.stopPropagation();sendChat(draft);}}); bound = true; }
    if (!clock) clock = setInterval(tick, 200);
    lastTime = performance.now();
  }
  function intro(reviewed = false) {
    if (training) { finishPractice(); return; }
    activate(); render();
    if (!reviewed && !read(GUIDE)) { guide(() => intro(true)); return; }
    const resumable = s && s.phase !== 'finished';
    openDialog(body('CLAUDE / NIGHT SHIFT · 12.0', t('IP 判断','IP Check'),
      `<div class="terminal-menu-art"><img src="assets/claude-winter.png" alt="Claude"><div><span>TERMINAL 008 / NIGHT SHIFT</span><strong>${t('雨声里，有人在编故事。','Someone is rehearsing a story.')}</strong><small>${t('听他怎么说，记住他怎么改。','Listen. Remember. Cross-check.')}</small></div></div><div class="hunt-menu-tag">${t('IP 判断','IP CHECK')}</div><p>${t('扮演 Claude，从聊天中找出伪装的中国用户。对面会改口、撤回、装傻，也会有人故意说中文等你误封。','Play Claude and find the disguised Chinese users. Expect edits, retractions, evasions—and foreigners baiting you into a false ban.')}</p>
      <div class="hunt-menu-stats"><div><b>12</b><span>${t('手写角色','scripted characters')}</span></div><div><b>3 × 3</b><span>${t('三夜九局','three nights, nine rounds')}</span></div><div><b>3</b><span>${t('每人最多三问','questions per visitor')}</span></div></div>
      <a class="reverse-entry" href="reverse.html"><span>⇄</span><div><b>${t('身份互换 · 轮到你被盘问','Role reversal · your turn to answer')}</b><small>${t('五轮加压 / 三种性格 / 最险瞬间复盘','Five rounds / three personalities / close-call replay')}</small></div><em>↗</em></a><div class="mode-grid"><button data-hunt="mode" data-value="relaxed" class="${menuMode === 'relaxed' ? 'selected' : ''}">☕ ${t('从容试探','Unhurried')}<small>${t('不计时，专心听他怎么圆','No timer. Listen to the story.')}</small></button><button data-hunt="mode" data-value="timed" class="${menuMode === 'timed' ? 'selected' : ''}">◷ ${t('限时追问','Timed')}<small>${t('60 / 50 / 40 秒，三次失误结束','60 / 50 / 40 seconds; three mistakes')}</small></button></div>
      ${resumable ? `<button class="primary" data-hunt="resume">${t('继续上次判断 →','Resume your run →')}</button>` : ''}
      <button class="${resumable ? 'secondary' : 'primary'}" data-hunt="new">${t('开始判断 →','Begin IP check →')}</button><button class="secondary" data-hunt="guide">${t('新手指引 · 免费练一局','Beginner guide · free practice')}</button><button class="archive-entry" data-hunt="archive"><span>▤</span><div><b>${t('雨夜档案 · 原版玩法','Rain Archives · original mode')}</b><small>${t('调查证据 · 十八次相遇 · 独立存档','Investigate evidence · 18 encounters · separate save')}</small></div><em>↗</em></button>
      <p class="smallprint">${t('独立同人梗游戏，角色身份由剧情预设；不检测真实 IP，与真实封号规则无关。两种玩法的存档各自保留。','Independent fan satire with authored identities. No real IP checks or real ban rules. Each mode keeps its own save.')}</p>`), 'hunt-intro', () => intro(true));
    bindModal();
  }
  function bindModal() { $('modal-content').querySelectorAll('[data-hunt]').forEach(b => b.onclick = () => action(b.dataset.hunt, b.dataset.value)); }
  function action(name, value) {
    if (name === 'mode') { menuMode = value; intro(true); }
    if (name === 'new') {
      if (s && s.phase !== 'finished') confirmNew(); else start(menuMode);
    }
    if (name === 'confirm-new') start(menuMode);
    if (name === 'resume') resume();
    if (name === 'guide') guide(() => intro(true));
    if (name === 'practice') practice();
    if (name === 'exit-practice') finishPractice();
    if (name === 'skip-guide') endGuide();
    if (name === 'archive') archive();
    if (name === 'next') next();
    if (name === 'reveal') finishReveal();
    if (name === 'menu') intro(true);
    if (name === 'close') { closeDialog(); lastTime = performance.now(); }
    if (name === 'copy') copyReport();
  }
  function confirmNew() {
    openDialog(body('NEW RUN',t('重新开局？','Start a new run?'),`<p>${t('这会替换IP 判断的当前进度，原版档案存档保留。','This replaces the current chase. Your original archive save is retained.')}</p><button class="primary" data-hunt="confirm-new">${t('确认重新开始','Start a new run')}</button><button class="secondary" data-hunt="resume">${t('继续当前对局','Resume this run')}</button>`),'hunt-confirm',confirmNew); bindModal();
  }
  function guide(proceed = () => { closeDialog(); render(); }) {
    if(training){toast(t('按黄色提示完成练习，或点击「退出练习」。','Follow the practice hint, or choose Exit practice.'));return;}
    guideReturn = proceed;
    openDialog(body('CLAUDE / 008 · FIELD GUIDE',t('聊天、抓矛盾、看反转。','Chat. Cross-check. Catch the twist.'),
      `<ol class="hunt-guide"><li><b>${t('最多三轮试探','Up to three probes')}</b><p>${t('可以自由输入，也可选四个话题中的三个。另有两次上下文追问；澄清问题不扣分。','Type your own questions or choose three of four topics. Two extra contextual follow-ups; clarifications cost nothing.')}</p></li><li><b>${t('选两条发言，指出破绽','Select two quotes and challenge')}</b><p>${t('点两条已出现的发言，再按「指出破绽」。每人只能质询一次；选对组合会得到关键反驳或承认。','Select two revealed quotes, then Challenge. You get one challenge per visitor. The right pair draws a decisive rebuttal or admission.')}</p></li><li><b>${t('封号或放行，揭晓身份','Ban or allow, then reveal')}</b><p>${t('正确 +100，质询命中再 +20，连对最多 +30；每问 −5。误封 −80，漏掉 −50。三次失误结束。中文、菜名和梗都可能是诱饵。','Correct +100, matched challenge +20, streak up to +30; each probe −5. False ban −80, miss −50. Three mistakes end the run. Chinese, food and memes may all be bait.')}</p></li></ol>
      <p class="hunt-practice-note">${t('练习不计时、不扣分，不改任何正式存档。练习提示会告诉你先选哪两个话题。','Practice has no timer or score and changes no real save. Hints show which topics to try.')}</p><button class="primary" data-hunt="practice">${t('亲手练一局 →','Try a practice round →')}</button><button class="secondary" data-hunt="skip-guide">${t('我明白了，返回游戏','Understood. Return to the game')}</button>`),'hunt-guide',() => guide(proceed)); bindModal();
  }
  function endGuide() { const back = guideReturn; guideReturn = null; write(GUIDE,'done'); if (back) back(); else closeDialog(); }
  function fresh(queue, mode) { return {v:1,mode,queue,index:0,phase:'playing',score:0,lives:3,streak:0,asked:[],selected:[],challenge:null,remaining:60,history:[],dialogue:[]}; }
  function practice() {
    clearPending(); practiceReturn = {s, active, back:guideReturn}; guideReturn = null; training = true;
    s = fresh(['kevin'],'relaxed'); activate(); closeDialog(); render(); Sound.unlock(); Sound.arriving();
  }
  function finishPractice() {
    if (!training) return;
    clearPending(); const previous = practiceReturn; training = false; practiceReturn = null;
    s = previous.s; active = previous.active; write(GUIDE,'done'); closeDialog(); render();
    if (previous.back) previous.back(); else intro(true);
  }
  function start(mode = 'relaxed') {
    if (!['relaxed','timed'].includes(mode)) return;
    clearPending(); training = false; practiceReturn = null;
    s = fresh(HuntRules.roster(),mode); activate(); closeDialog(); saveHunt(); render(); Sound.unlock(); Sound.arriving();
  }
  function resume() {
    if (!s) { intro(true); return; }
    activate(); closeDialog(); render(); Sound.unlock();
    if (s.phase === 'result' || s.phase === 'revealing') { s.phase = 'result'; resultDialog(); }
    else if (s.phase === 'finished') finish(); else Sound.scene(true);
  }
  function archive() {
    if (training) { finishPractice(); return; }
    clearPending(); saveHunt(); active = false; archiveMode = true;
    if (root) root.hidden = true; document.body.classList.remove('hunt-active'); I18n.apply(); closeDialog();
    introArchive();
  }
  function introArchive() { showArchiveMenu(); }
  function prompts() { return [t('晚饭吃了什么？','What was for dinner?'),t('最近忙什么？','What are you working on?'),t('游戏和网络生活呢？','Games and online life?'),t('核对一下地点与本人资料？','Check location and personal records?')]; }
  function answer(c, q, before) {
    const saved=s?.dialogue?.find(turn=>turn.kind==='probe'&&turn.topic===q);
    return saved ? text(saved.response) : text(HuntDialogue.probe(c,q,{asked:before}));
  }
  function ensureDialogue() {
    if(!s||Array.isArray(s.dialogue))return;
    const c=current();s.dialogue=s.asked.map((q,i)=>({kind:'probe',topic:q,question:[prompts()[q],prompts()[q]],response:HuntDialogue.probe(c,q,{asked:s.asked.slice(0,i)})}));
  }
  function challengeHit() { return !!s?.challenge && HuntRules.matching(current().pair,s.challenge.pair); }
  function note() {
    if (!s.asked.length) return t('先听他开场。你有三个问题，别全花在同一种线索上。','Hear the opening. Three questions; do not spend them all on one type of clue.');
    if (s.challenge) return challengeHit() ? t('质询已经给出关键回应。把他说的话与原来的说辞一起判断。','The challenge returned a key response. Compare it with the original claim.') : t('这次质询没有连起关键线索。仍可以根据已有发言作判断。','That challenge missed the key connection. You can still judge the available quotes.');
    if (s.selected.length === 2) return t('两条发言已夹进笔记。确定它们有关系，再指出破绽。','Two quotes pinned. Check that they connect, then challenge.');
    return t('点选两条发言。一个梗可能是诱饵，两条记录才有机会互相拆台。','Select two quotes. One meme may be bait; two records can contradict each other.');
  }
  function render() {
    if (!active || !root) return;
    document.title=t('IP 判断','IP Check');
    if (!s) { root.innerHTML = `<div class="hunt-landing"><span>CLAUDE / 008</span><h2>${t('雨声里，有人正在编故事。','Someone is rehearsing a story in the rain.')}</h2><p>${t('聊天试探 · 指出破绽 · 身份反转','Probe · Challenge · Reveal')}</p></div>`; return; }
    ensureDialogue(); const editing=document.activeElement?.id==='hunt-message'; const c = current(), pending = busy && s.dialogue.at(-1)?.kind==='probe' ? s.dialogue.at(-1).topic : -1, usable = s.phase === 'playing' && !busy;
    const log = `<div class="hunt-bubble visitor opening"><small>${esc(c.name)} · ${t('开场白','OPENING')}</small><p>${tx(c.opening)}</p></div>` + s.dialogue.map((turn,i)=>
      `<div class="hunt-bubble claude"><small>CLAUDE / ${String(i+1).padStart(2,'0')} ${turn.kind==='follow'?t('追问','FOLLOW-UP'):''}</small><p>${tx(turn.question)}</p></div>` + (busy && i===s.dialogue.length-1 ? `<div class="hunt-typing" role="status">${t('对方正在输入','Typing')}<i>● ● ●</i></div>` :
      `<div class="hunt-bubble visitor">${turn.kind==='probe'&&c.withdrawn?.[turn.topic]?`<div class="hunt-withdrawn"><del>${tx(c.withdrawn[turn.topic])}</del><small>↶ ${t('这条消息被撤回了','This message was retracted')}</small></div>`:''}<p>${tx(turn.response)}</p>${turn.kind==='probe'?`<button class="hunt-quote-toggle ${s.selected.includes(turn.topic)?'selected':''}" data-hunt="select" data-value="${turn.topic}" aria-pressed="${s.selected.includes(turn.topic)}" ${!usable||s.challenge?'disabled':''}>${s.selected.includes(turn.topic)?t('✓ 已夹入笔记','✓ Pinned'):t('＋ 夹入笔记','＋ Pin quote')}</button>`:''}</div>`)).join('');
    const cross = !s.challenge ? '' : `<div class="hunt-bubble claude"><small>CLAUDE / ${t('指出破绽','CHALLENGE')}</small><p>${s.challenge.pair.map(q => '「'+esc(answer(c,q,s.asked.slice(0,s.asked.indexOf(q))))+'」').join(' ↔ ')}</p></div><div class="hunt-bubble visitor challenge"><small>${t('对方的反驳','THE REBUTTAL')}</small><p>${tx(HuntDialogue.challenge(c,s.challenge.pair))}</p></div>`;
    root.innerHTML = `<div class="hunt-topline"><div><span class="hunt-eyebrow">NIGHT SHIFT / IP CHECK</span><h2>${t('IP 判断','IP Check')}</h2></div><button class="hunt-link" data-hunt="${training ? 'exit-practice' : 'menu'}">${training ? t('退出练习','Exit practice') : t('玩法 / 重开','Modes / restart')}</button></div>
      <div class="hunt-scoreboard"><div><small>${training ? t('免费练习','FREE PRACTICE') : 'NIGHT '+(Math.floor(s.index/3)+1)}</small><b>${training ? '01 / 01' : String(s.index+1).padStart(2,'0')+' / 09'}</b></div><div><small>${t('得分','SCORE')}</small><b>${training ? '—' : s.score}</b></div><div><small>${t('连对','STREAK')}</small><b>${s.streak}</b></div><div><small>${t('剩余容错','MISTAKES LEFT')}</small><b>${'● '.repeat(s.lives)}${'○ '.repeat(3-s.lives)}</b></div><div><small>${s.mode === 'timed' ? t('倒计时','CLOCK') : t('模式','MODE')}</small><b id="hunt-clock">${s.mode === 'timed' ? Math.ceil(s.remaining)+'s' : t('从容','Unhurried')}</b></div></div>
      ${training ? `<div class="hunt-training" role="status">${t('练习提示：先聊「晚饭」和「本人资料」，把两条发言夹入笔记，再指出破绽。此局不计分、不存档。','Practice hint: ask Dinner and Personal records, pin both replies, then Challenge. No score or save changes.')}</div>` : ''}
      <div class="hunt-grid"><aside class="hunt-character"><div class="hunt-character-head"><span>CAM / 008</span><span class="hunt-live">● LIVE</span></div><div class="hunt-portrait">${portrait(c.look)}</div><div class="hunt-character-copy"><small>${t('对方自称','THEIR CLAIM')}</small><h3>${esc(c.name)}</h3><p>${tx(c.claim)}</p><div class="hunt-persona"><span>?</span>${t('真实身份待揭晓','Identity unrevealed')}</div></div><div class="hunt-claude"><img src="assets/claude-winter.png" alt="Claude"><div><b>Claude</b><small>${t('正在听你怎么圆','Listening for the next excuse')}</small></div></div><p class="hunt-memo">${note()}</p></aside>
      <section class="hunt-conversation" aria-label="${t('聊天试探','Conversation')}"><div class="hunt-panel-title"><b>01 / ${t('聊天试探','THE CONVERSATION')}</b><span>${s.asked.length} / 3 ${t('轮','probes')}</span></div><div class="hunt-chat-log" aria-live="polite">${log+cross}</div><form id="hunt-chat-form" class="hunt-composer"><label for="hunt-message">${t('直接输入你的问题','Ask in your own words')}</label><div><textarea id="hunt-message" rows="2" maxlength="240" placeholder="${t('例如：你刚才不是说在纽约吗？','For example: Didn’t you say New York?')}" ${s.phase!=='playing'?'disabled':''}>${esc(draft)}</textarea><button type="submit" ${!usable?'disabled':''}>${t('发送 ↗','Send ↗')}</button></div><small>${t('Enter 发送 · Shift+Enter 换行 · 新话题占提问次数，追问另有 2 次','Enter sends · Shift+Enter adds a line · 3 topics + 2 follow-ups')}</small></form><div class="hunt-followups">${s.asked.length?['刚才那句具体指什么？','这份资料是你本人的吗？','你的说法和开场一致吗？'].map((question,i)=>`<button data-hunt="follow" data-value="${esc(I18n.lang==='en'?['What did you mean earlier?','Does that record belong to you?','Is that consistent with your opening claim?'][i]:question)}" ${!usable||s.dialogue.filter(turn=>turn.kind==='follow').length>=2?'disabled':''}>${esc(t(question,['What did you mean?','Is the record yours?','Does that match your claim?'][i]))}</button>`).join(''):''}</div><div class="hunt-probes">${prompts().map((p,q) => `<button data-hunt="ask" data-value="${q}" ${!usable || s.asked.length >= 3 || s.asked.includes(q) ? 'disabled' : ''}><span>${s.asked.includes(q) ? '✓' : '0'+(q+1)}</span><b>${esc(p)}</b><small>${s.asked.includes(q) ? t('已问','ASKED') : training ? t('免费','FREE') : '−5'}</small></button>`).join('')}</div><p class="hunt-small">${training ? t('免费练习 · 不计时、不扣分、不改正式存档','Free practice · no timer, score or real save changes') : s.asked.length === 3 ? t('三轮问完。选两条发言质询，或直接下判断。','Three probes used. Challenge two quotes, or make your finding.') : t('四选三 · 每问 −5 · 可以提前判断，误封会扣分','Choose three of four · −5 each · Early judgment is allowed')}</p></section>
      <aside class="hunt-notebook"><div class="hunt-panel-title"><b>02 / ${t('破绽笔记','CROSS-CHECK')}</b><span>${s.selected.length} / 2</span></div><div class="hunt-pins">${s.asked.length ? s.asked.filter(q => q !== pending).map(q => `<button class="hunt-pin ${s.selected.includes(q) ? 'selected' : ''}" data-hunt="select" data-value="${q}" aria-pressed="${s.selected.includes(q)}" ${!usable || s.challenge ? 'disabled' : ''}><small>${s.selected.includes(q) ? '✓ ' : '＋ '}${esc(prompts()[q])}</small><span>${esc(answer(c,q,s.asked.slice(0,s.asked.indexOf(q))))}</span></button>`).join('') : `<div class="hunt-empty">⌁<p>${t('对方说过的话会留在这里。','Their replies will appear here.')}</p><small>${t('选两条，看他怎么圆。','Pin two. Let them explain.')}</small></div>`}</div><button class="hunt-challenge" data-hunt="challenge" ${!usable || s.selected.length !== 2 || s.challenge ? 'disabled' : ''}>${s.challenge ? t('✓ 本轮已质询','✓ Challenge used') : t('指出破绽 ↗','Challenge the story ↗')}</button><p class="hunt-small">${t('每人一次质询 · 命中关键组合 +20','One challenge per visitor · Match the pair for +20')}</p>
      <div class="hunt-verdict"><span>03 / ${t('你的判断','YOUR CALL')}</span><button class="hunt-ban" data-hunt="ban" ${!usable || !s.asked.length ? 'disabled' : ''}><b>× ${t('发现中国用户 · 封号','Chinese user · BAN')}</b><small>D · ${t('误封 −80','false ban −80')}</small></button><button class="hunt-allow" data-hunt="allow" ${!usable || !s.asked.length ? 'disabled' : ''}><b>✓ ${t('外国用户 · 放行','Foreign user · ALLOW')}</b><small>A · ${t('漏掉 −50','miss −50')}</small></button><p>${t('按剧情预设身份计分；中文或某个梗未必是答案。','Scored against the scripted identity; Chinese or a meme may be a decoy.')}</p></div></aside></div>`;
    window.PageMotion?.huntRendered({key:s.queue.join(',')+':'+s.index+':'+training,count:s.dialogue.length,busy,challenge:!!s.challenge,selected:s.selected.join(','),score:s.score});
    if(editing)$('hunt-message')?.focus({preventScroll:true});
  }
  function onClick(e) {
    const b = e.target.closest('[data-hunt]'); if (!b || b.disabled) return;
    const name = b.dataset.hunt, value = Number(b.dataset.value);
    if (name === 'follow') sendChat(b.dataset.value); else if (name === 'ask') ask(value); else if (name === 'select') select(value); else if (name === 'challenge') challenge();
    else if (name === 'ban' || name === 'allow') decideHunt(name); else if (name === 'exit-practice') finishPractice(); else action(name,b.dataset.value);
  }
  function animateReply() {
    busy=true; const token=++epoch; render();
    replyTimer=setTimeout(()=>{if(token!==epoch)return;busy=false;render();const log=root.querySelector('.hunt-chat-log');if(log)log.scrollTop=log.scrollHeight;},reduced?0:Math.min(950,350+(s.dialogue.at(-1)?.response[0].length||0)*2));
  }
  function ask(q,raw='') {
    if(!active||!s||s.phase!=='playing'||modal.open||busy||![0,1,2,3].includes(q)||s.asked.includes(q)||s.asked.length>=3)return;
    ensureDialogue();const response=HuntDialogue.probe(current(),q,{asked:[...s.asked]});
    s.dialogue.push({kind:'probe',topic:q,question:raw?[raw,raw]:[HuntDialogue.questions[q][0],HuntDialogue.questions[q][1]],response});
    s.asked.push(q);if(!training)s.score-=5;saveHunt();Sound.play('intercom');animateReply();
  }
  function sendChat(value) {
    if(!active||!s||s.phase!=='playing'||modal.open||busy)return;
    const input=String(value||'').trim().slice(0,240);if(!input)return;
    ensureDialogue();const plan=HuntDialogue.plan(current(),s,input);
    if(plan.kind==='probe') {
      if(s.asked.length>=3){toast(t('新话题已满，可以追问刚才的发言。','Topic slots used. Follow up on an earlier statement.'));return;}
      draft='';ask(plan.topic,input);$('hunt-message')?.focus({preventScroll:true});return;
    }
    if(plan.kind==='follow'&&s.dialogue.filter(turn=>turn.kind==='follow').length>=2){toast(t('两次追问已用完，可以整理依据并判断。','Both follow-ups used. Review the quotes and make your call.'));return;}
    if(s.dialogue.filter(turn=>turn.kind!=='probe').length>=5){toast(t('聊天记录已够长，可以使用话题按钮或作出判断。','The conversation is long enough. Use a topic button or make your call.'));return;}
    draft='';s.dialogue.push({kind:plan.kind,topic:plan.topic??null,question:[input,input],response:plan.response});saveHunt();Sound.play('intercom');animateReply();$('hunt-message')?.focus({preventScroll:true});
  }
  function select(q) {
    if (!active || !s || s.phase !== 'playing' || modal.open || busy || s.challenge || !s.asked.includes(q)) return;
    if (s.selected.includes(q)) s.selected = s.selected.filter(x => x !== q);
    else if (s.selected.length < 2) s.selected.push(q);
    else { toast(t('先取消一条，再换另一条发言。','Unpin one quote before choosing another.')); return; }
    saveHunt(); render(); Sound.play('paper');
  }
  function challenge() {
    if (!active || !s || s.phase !== 'playing' || modal.open || busy || s.challenge || s.selected.length !== 2) return;
    s.challenge = {pair:[...s.selected]}; saveHunt(); render(); Sound.play('printer');
    const log = root.querySelector('.hunt-chat-log'); if (log) log.scrollTop = log.scrollHeight;
  }
  function decideHunt(choice) {
    if (!active || !s || s.phase !== 'playing' || modal.open || busy || !['ban','allow','timeout'].includes(choice) || (choice !== 'timeout' && !s.asked.length)) return;
    const c = current(), out = HuntRules.outcome(c,choice,challengeHit(),s.streak);
    if (!training) { s.score += out.delta; s.streak = out.streak; if (!out.correct) s.lives--; }
    s.history.push({id:c.id,choice,correct:out.correct,challenged:challengeHit(),delta:training ? 0 : out.delta,bonus:out.bonus,cost:training ? 0 : s.asked.length*5});
    s.phase = 'revealing'; saveHunt(); render(); Sound.play(choice === 'ban' ? 'stamp' : 'hold'); revealDialog();
  }
  function revealDialog() {
    const c = current(), r = s.history.at(-1), line = r.choice === 'ban' ? c.banLine : c.allowLine;
    openDialog(body('LAST MESSAGE / 008',t('对方留下最后一句话。','One last message.'),`<div class="hunt-last-message"><small>${esc(c.name)}</small><p>“${tx(line)}”</p></div><div class="hunt-scanner" aria-hidden="true"></div><p class="hunt-small">${t('Claude 正在核对隐藏身份……','Claude is checking the hidden identity…')}</p><button class="secondary" data-hunt="reveal">${t('直接揭晓 →','Reveal now →')}</button>`),'hunt-reveal',revealDialog); bindModal();
    clearTimeout(revealTimer); const token = epoch;
    revealTimer = setTimeout(() => { if (token === epoch && s?.phase === 'revealing') finishReveal(); }, reduced ? 0 : 1300);
  }
  function finishReveal() { if (!s || s.phase !== 'revealing') return; clearTimeout(revealTimer); s.phase = 'result'; saveHunt(); resultDialog(); }
  function resultDialog() {
    const c = current(), r = s.history.at(-1), wrongBan = !r.correct && r.choice === 'ban';
    const title = r.choice === 'timeout' ? t('时间到了，他先下线了。','Time is up. They logged off.') : r.correct ? c.cn ? t('抓到了！这次没圆回来。','Caught! No explaining this away.') : t('识破诱饵，漂亮放行。','Bait spotted. Nicely cleared.') : wrongBan ? t('误封警报：对方拿出反证。','False ban: here comes the counterproof.') : t('他溜走了，还顺手点了个赞。','They slipped away—and left a like.');
    openDialog(body('IDENTITY REVEAL / '+String(s.index+1).padStart(2,'0'),title,`<div class="hunt-reveal-card ${r.correct ? 'win' : 'lose'}"><div class="hunt-reveal-portrait">${portrait(c.look)}</div><div><span>${t('隐藏身份','HIDDEN IDENTITY')}</span><h3>${c.cn ? t('中国用户','Chinese user') : t('外国用户','Foreign user')}</h3><b>${esc(c.name)}</b><p>${tx(c.style)}</p></div><div class="hunt-stamp">${r.correct ? 'CASE READ' : wrongBan ? 'FALSE BAN' : 'MISSED'}</div></div><div class="hunt-reveal-reason"><b>${t('关键破绽 / 反转','THE KEY CONNECTION / TWIST')}</b><p>${tx(c.reveal)}</p><small>${t('关键话题：','Key topics: ')}${c.pair.map(q => esc(prompts()[q])).join(' + ')}</small></div><div class="hunt-reaction"><img src="assets/claude-winter.png" alt="Claude"><p>${r.correct ? t('Claude 扶了扶眼镜：「原来你在这儿等我。」','Claude adjusts her glasses: “So that was your trick.”') : t('Claude 短暂宕机：「这条判断，我得重写。」','Claude briefly freezes: “That finding needs a rewrite.”')}</p></div><div class="hunt-result-ledger">${training ? t('练习结束 · 不计分 · 正式存档未变','Practice complete · no score · real save unchanged') : `${t('判定','Finding')} ${r.delta >= 0 ? '+' : ''}${r.delta} · ${t('聊天','Probes')} −${r.cost} · ${t('总分','Total')} ${s.score}`}</div><button class="primary" data-hunt="next">${training ? t('完成练习，返回游戏 →','Finish practice →') : s.lives === 0 || s.index === 8 ? t('查看本局战报 →','See your report →') : (s.index+1)%3 === 0 ? t('进入下一夜 →','Next night →') : t('下一位，继续试探 →','Next visitor →')}</button>`),'hunt-result',resultDialog); bindModal(); Sound.play(r.correct ? 'good' : 'bad');
  }
  function next() {
    if (!s || !['result','finished'].includes(s.phase)) return;
    if (training) { finishPractice(); return; }
    if (s.lives === 0 || s.index === 8) { s.phase = 'finished'; saveHunt(); finish(); return; }
    clearPending(); s.index++; s.phase = 'playing'; s.asked = []; s.dialogue = []; draft=''; s.selected = []; s.challenge = null; s.remaining = limit();
    closeDialog(); saveHunt(); render(); Sound.arriving(); root.scrollIntoView({behavior:reduced ? 'instant' : 'smooth',block:'start'});
  }
  function finish() {
    const correct = s.history.filter(r => r.correct).length, bans = s.history.filter(r => r.choice === 'ban' && r.correct).length, falseBans = s.history.filter(r => r.choice === 'ban' && !r.correct).length;
    const rank = correct === 9 ? t('雨夜读心者','Mind reader of the night') : correct >= 7 ? t('老练的 Claude','Seasoned Claude') : falseBans >= 2 ? t('红按钮上头了','Red-button fever') : t('还需多聊两句','Ask a few more questions');
    openDialog(body('NIGHT SHIFT / RUN REPORT',rank,`<div class="hunt-report"><span>IP CHECK / IP CHECK</span><h3>${s.score}</h3><p>${t('本局得分','RUN SCORE')}</p><div class="hunt-report-stats"><b>${correct}/${s.history.length}<small>${t('判断正确','correct')}</small></b><b>${bans}<small>${t('识破伪装','caught')}</small></b><b>${falseBans}<small>${t('误封','false bans')}</small></b></div></div><div class="hunt-collection">${s.history.map(r => { const c=HUNT_CASES.find(x=>x.id===r.id); return `<div><span>${r.correct ? '✓' : '×'}</span><b>${esc(c.name)}</b><small>${tx(c.style)}</small></div>`; }).join('')}</div><button class="primary" data-hunt="new">${t('再来一局，换一批对手 →','New run, new opponents →')}</button><button class="secondary" data-hunt="copy">${t('复制本局战报','Copy run report')}</button><button class="hunt-link" data-hunt="menu">${t('返回玩法选择','Back to modes')}</button>`),'hunt-end',finish); bindModal();
  }
  async function copyReport() {
    const report = `IP CHECK · ${t('IP 判断','IP Check')}\n${t('得分','Score')}: ${s.score}\n${t('判断正确','Correct')}: ${s.history.filter(r=>r.correct).length}/${s.history.length}\nhttps://ip-checkpoint-cui.fitclock13.chatgpt.site`;
    try { await navigator.clipboard.writeText(report); toast(t('战报已复制。','Report copied.')); }
    catch { const box = document.createElement('textarea'); box.value = report; box.readOnly = true; box.setAttribute('aria-label',t('长按或选中复制战报','Select and copy your report')); $('modal-content').appendChild(box); box.focus(); box.select(); toast(t('请选中文字复制战报。','Select the text to copy your report.')); }
  }
  function pauseHunt() {
    if (!active) return;
    saveHunt(); openDialog(body('ON BREAK',t('先别封，喝口水。','Hands off the ban button. Take a break.'),`<p>${t('对话和倒计时暂停，回来继续这一位。','Conversation and clock paused. Return to the same visitor.')}</p><button class="primary" data-hunt="resume">${t('继续对局 →','Resume →')}</button><button class="secondary" data-hunt="${training ? 'exit-practice' : 'menu'}">${training ? t('退出练习','Exit practice') : t('玩法 / 重新开局','Modes / restart')}</button>`),'hunt-pause',pauseHunt); bindModal();
  }
  function cancel() {
    if (modalKind === 'hunt-guide') endGuide(); else if (modalKind === 'hunt-reveal') finishReveal();
    else if (['hunt-pause','hunt-confirm'].includes(modalKind)) resume();
  }
  function key(e) {
    if (modal.open || ['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName)) return;
    const k = e.key.toLowerCase();
    if (['1','2','3','4'].includes(k)) { e.preventDefault(); ask(Number(k)-1); }
    else if (k === 'a' || k === 'd') { e.preventDefault(); decideHunt(k === 'd' ? 'ban' : 'allow'); }
    else if (k === 'escape') pauseHunt();
  }
  function tick() {
    const now = performance.now(), dt = Math.min(1,Math.max(0,(now-lastTime)/1000)); lastTime = now;
    if (!active || !s || s.phase !== 'playing' || s.mode !== 'timed' || training || modal.open || busy || document.hidden) return;
    s.remaining = Math.max(0,s.remaining-dt); const el = $('hunt-clock'); if (el) { el.textContent = Math.ceil(s.remaining)+'s'; el.classList.toggle('danger',s.remaining <= 10); }
    saveHunt(); if (s.remaining === 0) decideHunt('timeout');
  }
  document.addEventListener('visibilitychange',() => { lastTime = performance.now(); saveHunt(); });
  window.addEventListener('pagehide',saveHunt);
  return {intro,start,resume,render,guide,pause:pauseHunt,cancel,key,archive,ask,select,challenge,decide:decideHunt,next,finishReveal,finishPractice,
    send:sendChat,get active(){return active;},get archiveMode(){return archiveMode;},get snapshot(){return s ? JSON.parse(JSON.stringify(s)) : null;},get training(){return training;}};
})();
