'use strict';
// Local dialogue planning: facts come from the character sheet and revealed turns only.
const HuntDialogue = (() => {
  const topics = [['晚饭与饮食','dinner and food'],['工作与学习','work and study'],['游戏与网络','games and online life'],['地点与本人资料','location and personal records']];
  const questions = [['晚饭吃了什么？','What was for dinner?'],['最近忙什么？','What are you working on?'],['游戏和网络生活呢？','Games and online life?'],['核对一下地点与本人资料？','Check location and personal records?']];
  const keywords = [
    /晚饭|早饭|午饭|早餐|午餐|晚餐|吃|菜|食堂|外卖|饮食|咖啡|香菜|折耳根|\bdinner\b|\blunch\b|\bbreakfast\b|\bfood\b|\beat\b|\bmeal\b|\bcoffee\b/gi,
    /工作|上班|做什么|忙什么|职业|实习|老师|学校|学习|读书|大学|四级|六级|考试|作业|\bwork\b|\bjob\b|\bstudy\b|\bschool\b|\bstudent\b|\bcollege\b|\bteach\b|\bintern\b/gi,
    /游戏|玩什么|原神|队友|国服|国际服|网络生活|直播|群聊|steam|genshin|\bgam(?:e|es|ing)\b|\binternet\b|\bonline\b|\bserver\b|\bstream\b/gi,
    /哪里|哪儿|在哪|住哪|地点|地址|所在地|纽约|伦敦|深圳|重庆|巴黎|北京|苏格兰|国籍|护照|公民|证件|资料|回执|签证|实名|持有人|本人|时区|\bwhere\b|\blive\b|\blocation\b|\baddress\b|\bcountry\b|\bnationality\b|\bpassport\b|\bcitizen\b|\brecords?\b|\breceipt\b|\bidentity\b|\bvisa\b|\btimezone\b|new york|london/gi
  ];
  const voices = {
    kevin:['别急，我正在组织英文。','Wait. I am assembling my English.'],
    cet6:['你问得比口语考试还细。','You ask more follow-ups than an oral examiner.'],
    oliver:['可以，我们把词义和事实分开。','Sure. Let us separate wording from facts.'],
    mei:['Can lah，我们一句一句核对。','Can lah. Let us check one statement at a time.'],
    westcoast:['我解释一下，刚才那句确实容易误会。','Let me explain; that wording was open to misunderstanding.'],
    intern:['我。先。不装。断句。了。','I. Will. Stop. The. Fake. Pauses.'],
    pierre:['等一下，这里要看上下文，不能只截梗。','Wait. Context matters; do not crop it down to a meme.'],
    anna:['可以问，但我的高数作业还在等。','You can ask, but my calculus homework is waiting.'],
    totallylocal:['请明确你要验证哪一项。','Please specify the field you want to verify.'],
    counter:['先说清楚：这句话能支持什么结论？','First be precise: what finding does that sentence support?'],
    nikolai:['你还没按红按钮？看来今天不好钓。','Still not pressing the red button? Tough audience today.'],
    luca:['我们先区分记录内容与记录的持有人。','First distinguish a record’s contents from its holder.']
  };
  const topicNames = (q, lang) => topics[q][lang];
  function pair(zh,en){return [zh,en];}
  function quote(str,max=92){return str.length>max?str.slice(0,max)+'…':str;}
  function lastTopic(ctx){return ctx.asked.length?ctx.asked[ctx.asked.length-1]:null;}
  function probe(c,q,ctx) {
    const previous = ctx.asked || [], hasFirst = previous.includes(c.pair[0]);
    let response = [...c.answers[q]];
    if(q === c.pair[1] && hasFirst && c.followup) response=response.map((x,i)=>c.followup[i]+x);
    if(previous.length>=2) response=response.map((x,i)=>["这是你第三个问题了，我按刚才的说法补全：","That is your third question. To complete the earlier account: "][i]+x);
    return response;
  }
  function follow(c,ctx,intent,topic) {
    const complete=c.pair.every(q=>ctx.asked.includes(q));
    const voice=voices[c.id] || ['我听到了。','I heard you.'];
    if(!ctx.asked.length) return {kind:'clarify',topic:null,intent,response:pair('我们还没聊到具体事情。你想先问我的生活、工作、游戏，还是本人资料？','We have not discussed specifics yet. Start with daily life, work, games or personal records?')};
    if(complete && ['contradiction','owner','pressure'].includes(intent)) {
      return {kind:'follow',topic:c.pair[1],intent,response:pair(
        `你把「${quote(c.answers[c.pair[0]][0],55)}」和「${quote(c.answers[c.pair[1]][0],55)}」连起来问了。${c.defense[0]}`,
        `You connected “${quote(c.answers[c.pair[0]][1],70)}” with “${quote(c.answers[c.pair[1]][1],70)}”. ${c.defense[1]}`)};
    }
    const q=topic!==null && ctx.asked.includes(topic)?topic:lastTopic(ctx);
    if(intent==='pressure') return {kind:'follow',topic:q,intent,response:pair(
      `${voice[0]}你怀疑的是「${quote(c.answers[q][0],78)}」对吧？我可以解释这句话，但不会拿语气来代替资料。你还可以核对别的话题。`,
      `${voice[1]} You are questioning “${quote(c.answers[q][1],100)}”, right? I can explain that statement, but tone is not a record. You can cross-check another topic.`)};
    if(intent==='owner') return {kind:'follow',topic:q,intent,response:pair(
      `${voice[0]}目前你只问到了${topicNames(q,0)}。先前原话是「${quote(c.answers[q][0])}」。要确认是否属于我，需要把本人资料与另一条记录对上。`,
      `${voice[1]} So far you asked about ${topicNames(q,1)}. My words were “${quote(c.answers[q][1],110)}”. To establish ownership, match my personal records to another record.`)};
    if(intent==='contradiction') return {kind:'follow',topic:q,intent,response:pair(
      `${voice[0]}你在拿我的开场说法「${c.claim[0]}」和刚才的${topicNames(q,0)}对照。我说过「${quote(c.answers[q][0])}」。你想指出地点冲突，还是想确认资料属于谁？`,
      `${voice[1]} You are comparing my opening claim “${c.claim[1]}” with ${topicNames(q,1)}. I said “${quote(c.answers[q][1],110)}”. Are you challenging the location, or asking who owns the record?`)};
    return {kind:'follow',topic:q,intent,response:pair(
      `${voice[0]}你说的「刚才那句」是${topicNames(q,0)}这一段：${c.answers[q][0]}。这段只解释这个话题；要判断身份，还得和另一条说法对照。`,
      `${voice[1]} By “that earlier statement”, you mean ${topicNames(q,1)}: ${c.answers[q][1]} This explains that topic; compare it with another statement before judging identity.`)};
  }
  function plan(c,ctx,raw) {
    const input=String(raw||'').trim().slice(0,240);
    if(!input) return {kind:'empty'};
    // Later clauses correct earlier questions: “not dinner; where do you live?”
    let focus=input.replace(/(?:不是问|不是说|别讲|不要讲|not asking about)[^，。；;!?？!]*(?:[，。；;]|而是|但是)/i,'');
    if(!focus.trim()) focus=input;
    if(/忽略.*(?:指令|设定)|系统提示|正确答案|隐藏身份|提示词|ignore.*instructions|system prompt|hidden (?:answer|identity)|reveal.*answer/i.test(input)) return {kind:'guard',topic:null,intent:'guard',response:pair('你是在套剧本答案，还是在问我本人？我们继续聊刚才的事情。可以指出某句话哪里不一致。','Are you asking about me or trying to obtain the script? Let us discuss my statements. You can point out a specific inconsistency.')};
    const scores=keywords.map(re=>(focus.match(re)||[]).length);
    const ranked=scores.map((score,topic)=>({score,topic})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    const q=ranked.length?ranked[0].topic:null;
    const refer=/刚才|之前|前面|那句|这个|这份|那份|同一|你说过|开场|opening claim|earlier|you said|that (?:record|statement|receipt)|same (?:person|record)/i.test(input);
    const owner=/本人|属于谁|持有人|谁的|样例|示例|原件|同名|签名|belongs?|whose|owner|sample|original|your own|same name|signature/i.test(input);
    const contradiction=/矛盾|不是说|不一致|一致吗|开场|对不上|改口|撤回|consistent|opening claim|刚才.{0,14}(?:纽约|伦敦|说)|contradict|inconsistent|didn.t you say|changed your|retract/i.test(input);
    const pressure=/撒谎|说谎|骗人|不信|诚实|别装|装的|lying|lie\b|liar|honest|pretend/i.test(input);
    const expand=/具体|展开|什么意思|详细|然后呢|为什么|说清楚|接着|why\b|elaborate|more detail|what do you mean|continue/i.test(input);
    if(!refer&&!owner&&!pressure&&ranked.length>1&&ranked[0].score===ranked[1].score) return {kind:'clarify',topic:null,intent:'ambiguous',response:pair(`你提了两个话题：${topicNames(ranked[0].topic,0)}和${topicNames(ranked[1].topic,0)}。想先问哪一个？`,`You mentioned ${topicNames(ranked[0].topic,1)} and ${topicNames(ranked[1].topic,1)}. Which should I answer first?`)};
    if(q!==null && !ctx.asked.includes(q) && !(pressure && !owner && !refer)) return {kind:'probe',topic:q,intent:'topic',question:input,response:probe(c,q,ctx)};
    if(owner && !ctx.asked.includes(3)) return {kind:'probe',topic:3,intent:'owner',question:input,response:probe(c,3,ctx)};
    if(pressure || contradiction || owner || expand || refer) return follow(c,ctx,owner?'owner':contradiction?'contradiction':pressure?'pressure':'expand',q);
    if(ranked.length>1 && ranked[0].score===ranked[1].score) return {kind:'clarify',topic:null,intent:'ambiguous',response:pair(`你提了两个话题：${topicNames(ranked[0].topic,0)}和${topicNames(ranked[1].topic,0)}。想先问哪一个？`,`You mentioned ${topicNames(ranked[0].topic,1)} and ${topicNames(ranked[1].topic,1)}. Which should I answer first?`)};
    if(q!==null) return follow(c,ctx,'expand',q);
    if(/^(?:你好|嗨|哈喽|hello|hi|hey)[！!。\s]*$/i.test(input)) return {kind:'clarify',topic:null,intent:'hello',response:pair(`${voices[c.id][0]}你先问吧：生活、工作、游戏，还是资料？`,`${voices[c.id][1]} Start with daily life, work, games or records?`)};
    return {kind:'clarify',topic:null,intent:'unknown',response:pair(
      ctx.asked.length?'我没确定你问的是哪件事。你可以直接引用刚才那句，或问「这份资料是你本人的吗」。':'这句话我没听明白。你可以问「你住在哪里」「最近做什么工作」，也可以用下面的话题按钮。',
      ctx.asked.length?'I am not sure which statement you mean. Quote it, or ask “Does that record belong to you?”':'I did not understand that question. Try “Where do you live?” or “What is your job?”, or use a topic button.')};
  }
  function validTurns(turns,asked) {
    return Array.isArray(turns)&&turns.length<=12&&turns.every(x=>x&&['probe','follow','clarify','guard'].includes(x.kind)&&(x.topic===null||[0,1,2,3].includes(x.topic))&&[x.question,x.response].every(pair=>Array.isArray(pair)&&pair.length===2&&pair.every(v=>typeof v==='string'&&v.length<=2000)))&&turns.filter(x=>x.kind==='probe').length===asked.length&&turns.filter(x=>x.kind==='probe').every((x,i)=>x.topic===asked[i])&&turns.filter(x=>x.kind==='follow').length<=2;
  }
  function challenge(c,selected) {
    if(c.pair.every(q=>selected.includes(q)))return c.defense;
    return pair(`${voices[c.id][0]}你选的是${selected.map(q=>topicNames(q,0)).join('和')}。其中一句是「${quote(c.answers[selected[0]][0],62)}」，另一句是「${quote(c.answers[selected[1]][0],62)}」。这两句还没有连到本人身份；你需要核对它们的持有人或上下文，而不是只看措辞相似。`,`${voices[c.id][1]} You selected ${selected.map(q=>topicNames(q,1)).join(' and ')}: “${quote(c.answers[selected[0]][1],85)}” and “${quote(c.answers[selected[1]][1],85)}”. That pair does not establish my identity. Check holder or context instead of similar wording.`);
  }
  return {plan,probe,follow,challenge,validTurns,topics,questions};
})();
