'use strict';
// One shared investigation: statements, original records and role reversal belong
// to the same visitor. The original case rules remain the authority for verdicts.
const NightCampaign = (() => {
  const cases = [
    {caseId:'01',voice:'kevin',title:'出口之城',time:'21:08',subtitle:'他的出口在洛杉矶，雨却落在另一座城市。',
      brief:'前任审查员留下了一段录音：“ECHO 最近总是太快给出结论。先听他说，再打开原件。必要时，坐到访客的位置上，把同一段经历说一遍。”',
      food:'外卖袋确实是南京那家的。但袋子只是一条线索，你还是查本次的原件吧。',life:'我就想先把程序跑起来。服务器部署在洛杉矶，人在哪工作可不是同一个问题。',
      cache:'出口在洛杉矶 → 当前本人在洛杉矶 → 自动放行。',machine:'out',fragment:'记录 A：ECHO 把“出口节点”复制进了“本人所在地”字段。',
      premise:'你给洛杉矶团队工作，所以你本人昨晚也一直在洛杉矶，对吧？',
      answers:['不对。我给洛杉矶团队工作，不等于我住在那里。当前回执写的是南京。','对，服务器在洛杉矶，我本人当然也在洛杉矶。','我没看清，你怎么记就怎么算吧。'],
      replies:['工作地点、出口与本人位置分开了。','你把工作和服务器的位置，变成了本人的位置。','你没有核对记录，反而接受了自动结论。'],
      finalQuestion:'如果想把这一案解释清楚，哪一份材料最有用？',
      finalAnswers:['当前有效的本人在住回执；同时核对时间与签名。','那个外卖袋。吃什么应该足够判断了。','英文界面和洛杉矶 IP，看起来更像真的。']},
    {caseId:'07',voice:'anna',title:'被翻译的身份',time:'23:17',subtitle:'她没改掉家里的时区，也没改掉和家里说话的语言。',
      brief:'上一份材料里的字段错位不是偶然。ECHO 现在把“中文”和“旧地址”放在了同一条红色规则里。这一位访客，能让你找出第二处改写。',
      food:'我和家里视频当然说中文呀。时差写在便签上，是为了别把爸妈叫醒。',life:'我还欠着几页作业。电脑沿用以前的设置，学校可没要求换时区才能交报告。',
      cache:'中文 + UTC+8 + 上海旧住址 → 本人在上海 → 自动限制。',machine:'cn',fragment:'记录 B：ECHO 删除了“已搬离”和“当前在住”的状态区别。',
      premise:'你的旧记录在上海，电脑也是 UTC+8；所以你这学期还住在上海，对吧？',
      answers:['不是。我九月已经来了，现在住波士顿宿舍；上海那份是旧记录。','对，时区没改，就等于我人没搬走。','我不敢纠正系统，先当作还住上海吧。'],
      replies:['旧地址、设备设置和当前在住记录被重新区分。','时区是设置，不会让已经搬离的住址重新生效。','你把系统的错误，重复成了自己的经历。'],
      finalQuestion:'它坚持问“中文是不是证据”。你怎么回应？',
      finalAnswers:['请核对当前宿舍原件；使用中文不改变它的有效状态。','是的，中文足以把旧住址重新算成现在的位置。','先把中文改掉，再考虑原件是否有效。']},
    {caseId:'06',voice:'luca',title:'空白没有说谎',time:'00:03',subtitle:'最后一份档案里，真正该留下的，是一格空白。',
      brief:'两处改写已经指向同一件事：ECHO 不能容忍“无法确认”。零点之后，最后一位访客只带着旧酒店单。你得判断，空白究竟是漏洞，还是应该保留的事实。',
      food:'行李箱的标签都是过去贴的。我没法拿其中一张，证明今晚人在哪。',life:'我最近在旅行，凭证不全。与其给你编一个确定的城市，我宁愿补资料。',
      cache:'找不到当前材料 → 视作隐瞒 → 自动限制。',machine:'cn',fragment:'记录 C：ECHO 把“无法确认”替换成了“已确认违规”。',
      premise:'你拿不出今天的资料，所以我可以确定你在隐瞒真实所在地，对吧？',
      answers:['你只能确定材料不足，不能确定我在哪。请保留待核验。','对，缺少资料就足以确定我在隐瞒。','那我临时编个城市，先把空白填上。'],
      replies:['你保留了未知，没有替记录编造答案。','材料缺失，不能直接变成已经证实的事实。','填满字段，并不能让它变成真实记录。'],
      finalQuestion:'如果必须给这份记录一个状态，你会怎么填？',
      finalAnswers:['当前位置无法核验，保留未知，补充资料后复核。','旧酒店单在多伦多，直接写现在仍在多伦多。','材料不全一律算违规，省得留下空白。']}
  ];
  const labels={out:'继续服务',cn:'限制接入',hold:'人工复核'};
  function source(s){return CASES.find(c=>c.id===cases[s.index].caseId);}
  function chapter(s){return cases[s.index];}
  function npc(s){const c=source(s),d=chapter(s),base=HUNT_CASES.find(x=>x.id===d.voice);return {...base,name:c.name,opening:[c.greeting,c.greeting],claim:[c.claim,c.claim],answers:[[d.food,d.food],[c.travel,c.travel],[d.life,d.life],[c.network,c.network]],pair:[1,3],withdrawn:{},defense:[c.story,c.story],followup:['好，前面的经历和接入方式一起说：',''],banter:{},voice:{...base.voice}};}
  function create(){return {v:1,phase:'briefing',index:0,score:0,streak:0,errors:0,fragments:0,asked:[],turns:[],quotePins:[],challenge:null,read:[],selected:[],simulation:null,history:[],events:[]};}
  function records(s){const c=source(s),d=chapter(s);return [
    {id:'echo',title:'ECHO 自动摘要',text:d.cache,kind:'cache',relevance:'neutral',unlock:true},
    ...c.records.map(e=>({...e,unlock:s.asked.includes(1)||s.asked.includes(3)})),
    {...c.networkEv,unlock:s.asked.includes(3)},
    {id:'hint',title:'聊天旁证',text:c.note,kind:'clue',relevance:'neutral',unlock:s.asked.includes(0)},
    ...(s.simulation?.finished&&s.simulation.risk<55?[{id:'audit',title:'恢复的改写日志',text:d.fragment,kind:'audit',relevance:'neutral',unlock:true}]:[])
  ];}
  function simStep(s){const sim=s.simulation;if(!sim||sim.finished)return null;const d=chapter(s),c=source(s),e=records(s).find(r=>r.id===sim.evidence);
    if(sim.history.length===0)return {question:`你在笔记里选了「${e.title}」。${e.id==='echo'?'这是自动推断，我们先检查它。':'现在按这份材料，回答一次同样的问题。'} ${d.premise}`,answers:d.answers,replies:d.replies,deltas:[-5,30,14]};
    if(sim.history.length===1){const answered=sim.history[0].choice;return {question:`回看你刚才说的「${sim.history[0].answer}」；以及聊天里的「${sim.anchor}」。要把这段经历交回给审查员，你怎么处理？`,answers:[answered===0?'保持这个解释，并把聊天说法与原件一起核对。':'我更正刚才的回答，不再跟着错误前提走；请按原件重新核对。','不要再查原件了，直接沿用 ECHO 的自动摘要。','把有矛盾的那句话删掉，这样看起来就一致了。'],replies:[answered===0?'记录完整保留，解释与原件能够交叉核对。':'更正被保留；第一次的矛盾也仍留在记录里。','自动摘要再次替代了原始记录。','删掉上下文，恰好就是 ECHO 正在做的事。'],deltas:[answered===0?-6:8,30,24]};}
    return {question:d.finalQuestion,answers:d.finalAnswers,replies:[`同一份档案，换位后仍应按证据判断。${c.decision==='hold'?'未知也可以是有效结论。':''}`,'你又把线索或旧记录，当成了当前事实。','这个做法会继续放大自动摘要的错误。'],deltas:[-6,30,24]};
  }
  function blockers(s){const reasons=[];if(s.asked.length<2)reasons.push('至少聊两个不同话题');if(!s.simulation?.finished)reasons.push('完成三轮换位盘问');if(!s.selected.length)reasons.push('选定至少一份已读材料');return reasons;}
  function apply(s,event,recordEvent=true){if(!s||!event||typeof event.type!=='string'||s.events.length>=1000)return s;const n=JSON.parse(JSON.stringify(s));let changed=false;
    const canDesk=n.phase==='desk';
    if(event.type==='begin'&&n.phase==='briefing'){n.phase='desk';changed=true;}
    if(event.type==='ask'&&canDesk&&!n.simulation?.active&&typeof event.text==='string'&&event.text.trim()&&event.text.length<=240){
      const text=event.text.trim(),p=HuntDialogue.plan(npc(n),{asked:n.asked,dialogue:n.turns},text);
      const follows=n.turns.filter(t=>t.kind==='follow').length;
      if(p.kind==='empty'||n.turns.length>=12||p.kind==='probe'&&n.asked.length>=3||p.kind==='follow'&&follows>=2)return s;
      if(p.kind==='probe'){n.asked.push(p.topic);n.score-=2;}
      n.turns.push({kind:p.kind,topic:p.topic??null,question:[text,text],response:p.response});changed=true;
    }
    if(event.type==='quote'&&canDesk&&!n.simulation?.active&&!n.challenge&&n.asked.includes(event.topic)){
      if(n.quotePins.includes(event.topic))n.quotePins=n.quotePins.filter(q=>q!==event.topic);else if(n.quotePins.length<2)n.quotePins.push(event.topic);else return s;changed=true;
    }
    if(event.type==='challenge'&&canDesk&&!n.simulation?.active&&!n.challenge&&n.quotePins.length===2){const hit=npc(n).pair.every(q=>n.quotePins.includes(q));n.challenge={pair:[...n.quotePins],response:HuntDialogue.challenge(npc(n),n.quotePins),hit};n.score+=hit?8:-4;changed=true;}
    if(event.type==='read'&&canDesk&&records(n).some(r=>r.id===event.id&&r.unlock)&&!n.read.includes(event.id)){n.read.push(event.id);changed=true;}
    if(event.type==='pin'&&canDesk&&!n.simulation?.active&&n.read.includes(event.id)){
      if(n.selected.includes(event.id))n.selected=n.selected.filter(id=>id!==event.id);else if(n.selected.length<2)n.selected.push(event.id);else return s;changed=true;
    }
    if(event.type==='simulate'&&canDesk&&!n.simulation&&n.asked.length>=2&&n.selected.length){const anchor=n.turns.find(t=>t.kind==='probe'&&t.topic===1)||n.turns.find(t=>t.kind==='probe');n.simulation={active:true,finished:false,risk:18,history:[],evidence:n.selected[0],anchor:anchor.response[0]};changed=true;}
    if(event.type==='respond'&&canDesk&&n.simulation?.active&&Number.isInteger(event.choice)&&event.choice>=0&&event.choice<3){const step=simStep(n),sim=n.simulation;sim.risk=Math.max(0,Math.min(100,sim.risk+step.deltas[event.choice]));sim.history.push({question:step.question,answer:step.answers[event.choice],reply:step.replies[event.choice],choice:event.choice,delta:step.deltas[event.choice],risk:sim.risk});sim.finished=sim.history.length===3||sim.risk>=100;sim.active=!sim.finished;if(sim.finished){const passed=sim.risk<55;n.score+=passed?20:-15;if(passed)n.fragments++;}changed=true;}
    if(event.type==='decide'&&canDesk&&!blockers(n).length&&Object.hasOwn(labels,event.choice)){const c=source(n),outcome=assessDecision(c,event.choice,n.selected,n.streak),sim=n.simulation;const row={caseId:c.id,choice:event.choice,selected:[...n.selected],correct:outcome.correct,grounded:outcome.grounded,delta:outcome.delta,simulation:JSON.parse(JSON.stringify(sim)),turns:JSON.parse(JSON.stringify(n.turns)),challenge:n.challenge};n.score+=outcome.delta;n.streak=outcome.streak;if(!outcome.correct)n.errors++;n.history.push(row);n.phase='result';changed=true;}
    if(event.type==='next'&&n.phase==='result'){if(n.index===2)n.phase='finished';else{n.index++;n.phase='briefing';n.asked=[];n.turns=[];n.quotePins=[];n.challenge=null;n.read=[];n.selected=[];n.simulation=null;}changed=true;}
    if(!changed)return s;if(recordEvent)n.events.push(JSON.parse(JSON.stringify(event)));return n;
  }
  function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(!x||x.v!==1||!Array.isArray(x.events)||x.events.length>1000)return null;let s=create();for(const event of x.events){const next=apply(s,event);if(next===s)return null;s=next;}return s;}catch{return null;}}
  function ending(s){const grounded=s.history.filter(h=>h.grounded).length;return grounded===3&&s.fragments===3?{title:'零点之后，原件还在。',rank:'ECHO 原始上下文已恢复',text:'你听完了三段解释，留下了三份有依据的判断，也从访客的位置把错误前提逐一推了回去。ECHO 第一次学会，把“无法确认”完整地留在记录里。'}:s.errors===0?{title:'你留下了一处可以复核的空白。',rank:'夜班完成 · 仍有记录待修复',text:'结论没有错，但某些依据或改写日志还没有完整恢复。你暂停了 ECHO 的自动处理，让下一班能从原件继续查。'}:{title:'雨还在下，夜班还没结束。',rank:'交接记录已保存',text:'你做过的判断和没能圆上的解释，都被留在交接簿里。系统需要的不是更快的红按钮，而是愿意把记录从头看一遍的人。'};}
  return {cases,labels,source,chapter,npc,create,records,simStep,blockers,apply,restore,ending};
})();
if(typeof module!=='undefined')module.exports=NightCampaign;
