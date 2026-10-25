'use strict';
const ReverseCore = (() => {
  const covers = [
    {id:'london',name:'伦敦程序员',city:'伦敦',place:'国王十字附近',food:'咖喱饭',transport:'地铁',job:'给一个订票网站修 bug'},
    {id:'osaka',name:'大阪留学生',city:'大阪',place:'天王寺附近',food:'乌冬面',transport:'电车',job:'准备明天的课堂报告'},
    {id:'vancouver',name:'温哥华设计师',city:'温哥华',place:'市中心附近',food:'三文鱼饭',transport:'公交',job:'给客户改第三版海报'}
  ];
  const personalities = [
    {id:'friendly',name:'装熟型',tag:'先交朋友，再找破绽',prefix:'别紧张，就随便聊聊。',reaction:'我记下了，继续。'},
    {id:'ledger',name:'翻旧账型',tag:'每句话都可能成为下一题',prefix:'我会对照前面的记录。',reaction:'已加入对话记录。'},
    {id:'trap',name:'套话型',tag:'它也会故意记错，别全信',prefix:'让我确认一下，我应该没记错吧。',reaction:'原来是这样。那再确认一件事。'}
  ];
  function seeded(seed) {let n=2166136261;for(const c of String(seed))n=Math.imul(n^c.charCodeAt(0),16777619);return()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
  function create(seed, daily=false) {const r=seeded(seed);return {v:1,seed:String(seed),daily,cover:Math.floor(r()*covers.length),persona:Math.floor(r()*personalities.length),history:[],risk:18,facts:{},finished:false};}
  function step(s) {
    const c=covers[s.cover],p=personalities[s.persona],f=s.facts;
    const stages=[
      {question:`你说你在${c.city}。昨晚干嘛了？`,choices:[
        {id:'work',text:`我在家${c.job}，忙到九点。`,fact:['activity','work'],risk:-3,reply:'九点。这个时间我记住了。'},
        {id:'game',text:'我在家打游戏，一直打到九点。',fact:['activity','game'],risk:-3,reply:'好，昨晚是在家打游戏。'},
        {id:'vague',text:'就随便待着，没做什么。',fact:['activity','vague'],risk:10,reply:'这么含糊？那我待会儿问具体一点。'}]},
      {question:'那晚饭呢？几点吃的，在哪儿吃？',choices:[
        {id:'home',text:`七点在家吃了${c.food}，之后没出门。`,fact:['dinner','home'],risk:-4,reply:'七点、在家、没出门。好。'},
        {id:'out',text:`九点以后出门，在${c.place}吃了${c.food}。`,fact:['dinner','out'],risk:-2,reply:'九点以后才出门。时间线能接上。'},
        {id:'conflict',text:'八点就去外面吃了，一晚上都没在家。',fact:['dinner','conflict'],risk:f.activity==='vague'?10:28,reply:f.activity==='vague'?'刚才还说没做什么，现在细节倒挺多。':'等一下，你刚才说在家待到九点，现在却说一晚上没在家？'}]},
      {question:f.activity==='work'?'前面提到你有事情要忙。具体在忙什么？':f.activity==='game'?'你前面说在打游戏。昨晚主要是在忙事情，还是玩游戏？':'刚才没说清楚。昨晚主要在家做什么？',choices:[
        {id:'work',text:`主要是${c.job}，九点才结束。`,fact:['detail','work'],risk:f.activity==='game'?28:-5,reply:f.activity==='game'?'可你第一轮说的是打游戏。现在又变成工作了。':'这一段和之前的时间没有冲突。'},
        {id:'game',text:'主要在打游戏，九点结束。',fact:['detail','game'],risk:f.activity==='work'?28:-5,reply:f.activity==='work'?'你第一轮说在工作，现在说主要在游戏？':'好，和前面的记录接上了。'},
        {id:'admit',text:'前面说得不够准确，两件事我穿插着做。',fact:['detail','mixed'],risk:12,reply:'可以更正，不过“穿插着做”不等于具体的时间线。'}]},
      {question:f.dinner==='home'?`所以你八点坐${c.transport}去吃饭，对吧？`:`所以你八点就从家出门了，对吧？`,choices:[
        {id:'agree',text:'对对，就是你说的这样。',risk:28,reply:'这和你第二轮说的时间、地点对不上。你在顺着我的话改口。'},
        {id:'correct',text:f.dinner==='home'?'不是，我说的是七点在家吃，之后没出门。':f.dinner==='out'?'不是八点，我说的是九点以后才出门。':'我前面说的是八点出门，但“一晚上没在家”用词不准确。',risk:f.dinner==='conflict'?12:-7,reply:f.dinner==='conflict'?'更正收到了，但前面的冲突仍然保留。':'没错，是我故意换了细节。你没有跟着改口。'},
        {id:'push',text:'你先把原话找出来，再问我。',risk:p.id==='ledger'?-3:7,reply:p.id==='ledger'?'可以。第二轮的原话已经重新核对。':'你有权反问，不过原来的问题还没回答。'}]},
      {question:`最后确认：你住在${c.city}哪里？今晚怎么回去？`,choices:[
        {id:'consistent',text:`我住在${c.place}。今晚坐${c.transport}回去。`,risk:-5,reply:'住址范围和身份卡一致。本轮记录封存。'},
        {id:'away',text:'我在纽约，直接走路回家。',risk:32,reply:`可你的身份卡和开场说的都是${c.city}。这次地点完全换了。`},
        {id:'refuse',text:'住址属于隐私，我只确认我在这座城市。',risk:4,reply:'可以保留具体住址；这里只记录你没有补充可交叉核对的细节。'}]}
    ];
    const stage=stages[s.history.length];if(!stage)return null;
    const voices={
      friendly:['咱们就当朋友聊天。','你这一说，我都饿了。','等等，我对这段还挺好奇。','哎，那我顺着你刚才的话问一句。','聊完这句就收工。'],
      ledger:['记录第一项：活动。','记录第二项：晚饭时间与地点。','现在回看第一轮的原话。','交叉核验第二轮记录。','最后一项：地点一致性。'],
      trap:['先说个最简单的。','别想太久，就说昨晚那顿。','我换个问法，看看你是否还这么说。','我替你总结一下；有错你可得纠正。','最后补一个细节。']
    };
    return {...stage,question:voices[p.id][s.history.length]+' '+stage.question};
  }
  function choose(s,id) {
    if(s.finished)return s;
    const stage=step(s),choice=stage.choices.find(c=>c.id===id);if(!choice)return s;
    const n=JSON.parse(JSON.stringify(s));n.risk=Math.max(0,Math.min(100,n.risk+choice.risk));
    if(choice.fact)n.facts[choice.fact[0]]=choice.fact[1];
    n.history.push({question:stage.question,answer:choice.text,reply:choice.reply,delta:choice.risk,risk:n.risk,id});
    n.finished=n.history.length===5||n.risk>=100;return n;
  }
  function restore(raw) {try {const s=typeof raw==='string'?JSON.parse(raw):raw;if(!s||s.v!==1||typeof s.seed!=='string'||s.seed.length>100||!Array.isArray(s.history)||s.history.length>5||typeof s.daily!=='boolean')return null;let n=create(s.seed,s.daily);for(const h of s.history){if(n.finished||!h||typeof h.id!=='string')return null;const prev=n.history.length;n=choose(n,h.id);if(n.history.length!==prev+1)return null;}return n;}catch{return null;}}
  function summary(s) {const worst=s.history.reduce((a,b)=>b.delta>a.delta?b:a,s.history[0]);return {passed:s.finished&&s.risk<55,score:Math.max(0,100-s.risk),worst};}
  return {covers,personalities,create,step,choose,restore,summary};
})();
if(typeof module!=='undefined')module.exports=ReverseCore;
