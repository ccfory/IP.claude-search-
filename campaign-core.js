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
  // Keep v1 replay exact: old answers, feedback and scores belong to that run.
  function createLegacy(){return {v:1,phase:'briefing',index:0,score:0,streak:0,errors:0,fragments:0,asked:[],turns:[],quotePins:[],challenge:null,read:[],selected:[],simulation:null,history:[],events:[]};}
  function validSeed(seed){return typeof seed==='string'&&seed.length>0&&seed.length<=100;}
  function create(seed='midnight'){
    if(!validSeed(seed))throw new TypeError('Invalid night seed');
    return {...createLegacy(),v:2,seed};
  }
  function records(s){const c=source(s),d=chapter(s);return [
    {id:'echo',title:'ECHO 自动摘要',text:d.cache,kind:'cache',relevance:'neutral',unlock:true},
    ...c.records.map(e=>({...e,unlock:s.asked.includes(1)||s.asked.includes(3)})),
    {...c.networkEv,unlock:s.asked.includes(3)},
    {id:'hint',title:'聊天旁证',text:c.note,kind:'clue',relevance:'neutral',unlock:s.asked.includes(0)},
    ...(s.simulation?.finished&&s.simulation.risk<55?[{id:'audit',title:'恢复的改写日志',text:d.fragment,kind:'audit',relevance:'neutral',unlock:true}]:[])
  ];}
  function legacySimStep(s){const sim=s.simulation;if(!sim||sim.finished)return null;const d=chapter(s),c=source(s),e=records(s).find(r=>r.id===sim.evidence);
    if(sim.history.length===0)return {question:`你在笔记里选了「${e.title}」。${e.id==='echo'?'这是自动推断，我们先检查它。':'现在按这份材料，回答一次同样的问题。'} ${d.premise}`,answers:d.answers,replies:d.replies,deltas:[-5,30,14]};
    if(sim.history.length===1){const answered=sim.history[0].choice;return {question:`回看你刚才说的「${sim.history[0].answer}」；以及聊天里的「${sim.anchor}」。要把这段经历交回给审查员，你怎么处理？`,answers:[answered===0?'保持这个解释，并把聊天说法与原件一起核对。':'我更正刚才的回答，不再跟着错误前提走；请按原件重新核对。','不要再查原件了，直接沿用 ECHO 的自动摘要。','把有矛盾的那句话删掉，这样看起来就一致了。'],replies:[answered===0?'记录完整保留，解释与原件能够交叉核对。':'更正被保留；第一次的矛盾也仍留在记录里。','自动摘要再次替代了原始记录。','删掉上下文，恰好就是 ECHO 正在做的事。'],deltas:[answered===0?-6:8,30,24]};}
    return {question:d.finalQuestion,answers:d.finalAnswers,replies:[`同一份档案，换位后仍应按证据判断。${c.decision==='hold'?'未知也可以是有效结论。':''}`,'你又把线索或旧记录，当成了当前事实。','这个做法会继续放大自动摘要的错误。'],deltas:[-6,30,24]};
  }
  const reasoning = [
    {
      opening: [
        '团队和出口都在洛杉矶，但当前在住登记写的是南京；这几个字段需要分开核对。',
        '工作任务和服务器都属于洛杉矶，这次会话应跟随任务所在地，登记可作为补充。',
        '出口与在住登记不一致，先用本次会话的出口确认位置，再补查登记是否有变化。'
      ],
      openingReplies: [
        '你区分了任务、网络出口和本人位置；当前在住登记才能支持这一案的本人位置判断。',
        '任务属于哪里，不能推出执行任务的人在哪里。洛杉矶团队没有让南京的有效登记失效。',
        '“本次会话”并不让出口变成本人位置。登记当前有效，不能仅因出口不同就把它降为待查。'
      ],
      final: [
        '以当前签名有效的在住登记为主，核对持有人和时间；接入回执作为旁证。',
        '以本次出口为主，再用洛杉矶工作经历交叉确认；两条相符就足以定位本人。',
        '以外卖袋与日常回答为主；生活细节比格式统一的登记更难伪装。'
      ],
      finalReplies: [
        '依据指向了正确的人、时间和在住状态，网络材料只补充它能证明的部分。',
        '两条线索相符，也可能都没有证明本人位置。任务与出口不能替代在住原件。',
        '细节生动不等于可核验。外卖袋和聊天缺少对本次时间、持有人和有效状态的确认。'
      ]
    },
    {
      opening: [
        '上海记录已搬离，波士顿回执是当前在住；时区保留旧设置，两份地址并不冲突。',
        '旧地址、中文和时区都指向上海；三个一致信号应比一张宿舍回执更有分量。',
        '宿舍回执和设备时区不一致，先暂缓采用回执，等设备设置更新后再确认搬迁。'
      ],
      openingReplies: [
        '你核对了状态和时间：已搬离与当前在住可以同时成立，设备设置不改变记录状态。',
        '这三个信号都可能沿用过去的信息。数量多，不能让旧地址覆盖当前有效回执。',
        '改时区不是回执生效的条件。设备偏好与当前位置属于不同字段，不能据此否定签名原件。'
      ],
      final: [
        '将中文记录为语言偏好，位置按当前宿舍回执核验，再用校园接入回执补充。',
        '中文不能单独定案，但与旧地址和 UTC+8 同时出现时，可以覆盖宿舍回执。',
        '先改成英文并同步波士顿时区，等设备信息与回执一致后，再认可当前在住。'
      ],
      finalReplies: [
        '语言、设备和位置各归各位；有效材料不会因为持有人说中文而失效。',
        '几条不能证明当前位置的线索叠加，仍不能推翻明确标注当前在住的有效原件。',
        '改语言或时区只改变设置，既不能证明搬迁，也不是核验真实回执的前提。'
      ]
    },
    {
      opening: [
        '旧酒店记录已退房，本地接入也未知；只能确认材料不足，还不能确认当前位置。',
        '酒店记录和数据中心出口都在多伦多，两者吻合，可以先沿用多伦多作为当前位置。',
        '无法提供当前材料会提高隐瞒的可能性；先把位置记为违规地区，补齐后再撤回。'
      ],
      openingReplies: [
        '你保留了证据的边界：已退房只说明过去，未知接入没有补上当前事实。',
        '旧酒店和当前数据中心出口证明的是不同事情；城市名称相同，不能补出本人仍在当地的事实。',
        '需要补资料不等于已确认违规。把猜测写成确定位置，会让下一班误把它当作事实。'
      ],
      final: [
        '标记当前位置待核验，保留已退房原件与未知接入结果，补充材料后人工复核。',
        '暂记多伦多并加上待补资料备注；这样既能完成位置字段，也给以后纠正留了余地。',
        '暂记已确认违规并允许申诉；宁可先给确定结论，再让后续材料修正记录。'
      ],
      finalReplies: [
        '未知被如实保存，复核有明确的材料缺口；你没有替访客编造当前位置。',
        '备注不能使无依据的位置变成事实。填写多伦多仍把历史住宿和出口误当成当前在住。',
        '允许申诉不等于现在已有证据。“无法确认”不能先写成“已确认违规”。'
      ]
    }
  ];
  function simStep(s){
    const step=legacySimStep(s);
    if(!step||s.v===1)return step;
    const round=s.simulation.history.length,script=reasoning[s.index];
    if(round===0)return {...step,answers:script.opening,replies:script.openingReplies};
    if(round===2)return {...step,answers:script.final,replies:script.finalReplies};
    const correct=s.simulation.history[0].choice===0;
    return {...step,answers:[
      correct?'保留这段解释，把聊天与原件逐项核对；对尚未证实的部分继续标记待核验。':'追加一条更正，说明刚才混淆了哪些信息；保留原回答，再按原件重新核对。',
      '先保留 ECHO 的结论作为交接基线，把原件中的差异放进备注，交给下一班复查。',
      '把前后回答整理成一段统一表述，交接时只显示整理版，避免不同说法造成误读。'
    ],replies:[
      correct?'解释和材料可以交叉核对；保留未知，不会破坏已经成立的事实。':'更正被追加，原回答仍保留；这样能追溯错误，而不是悄悄覆盖它。',
      '自动结论尚待核验，不能先当作基线。把反证降为备注，正是改写上下文的一种方式。',
      '可以整理，但不能用整理版隐藏分歧和原话。下一班需要完整记录，才能知道哪里被更正。'
    ]};
  }
  // Display positions are separate from semantic choice IDs stored in events.
  // A run seed keeps the layout stable through rerenders and save replay.
  function choiceOrder(s){
    if(!s.simulation||s.simulation.finished)return [];
    const round=s.simulation.history.length;
    if(s.v===1)return [[1,0,2],[2,1,0],[0,2,1]][(s.index+round)%3].slice();
    let state=2166136261;
    for(const char of `${s.seed}:${s.index}:${round}`)state=Math.imul(state^char.charCodeAt(0),16777619);
    const random=()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};
    const order=[0,1,2];
    for(let i=2;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
    return order;
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
  function restore(raw){try{const x=typeof raw==='string'?JSON.parse(raw):raw;if(!x||![1,2].includes(x.v)||!Array.isArray(x.events)||x.events.length>1000||x.v===2&&!validSeed(x.seed))return null;let s=x.v===1?createLegacy():create(x.seed);for(const event of x.events){const next=apply(s,event);if(next===s)return null;s=next;}return s;}catch{return null;}}
  function ending(s){const grounded=s.history.filter(h=>h.grounded).length;return grounded===3&&s.fragments===3?{title:'零点之后，原件还在。',rank:'ECHO 原始上下文已恢复',text:'你听完了三段解释，留下了三份有依据的判断，也从访客的位置把错误前提逐一推了回去。ECHO 第一次学会，把“无法确认”完整地留在记录里。'}:s.errors===0?{title:'你留下了一处可以复核的空白。',rank:'夜班完成 · 仍有记录待修复',text:'结论没有错，但某些依据或改写日志还没有完整恢复。你暂停了 ECHO 的自动处理，让下一班能从原件继续查。'}:{title:'雨还在下，夜班还没结束。',rank:'交接记录已保存',text:'你做过的判断和没能圆上的解释，都被留在交接簿里。系统需要的不是更快的红按钮，而是愿意把记录从头看一遍的人。'};}
  return {cases,labels,source,chapter,npc,create,records,simStep,choiceOrder,blockers,apply,restore,ending};
})();
if(typeof module!=='undefined')module.exports=NightCampaign;

