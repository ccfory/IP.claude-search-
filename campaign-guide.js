'use strict';
// Isolated practice: no campaign events, score, or saved run are used here.
const NightGuidePractice = (() => {
  const create=()=>({step:0,asked:[],opened:[],selected:null,answer:null,verdict:null,feedback:''});
  const ready=s=>[s.asked.length===2,s.selected==='original',s.answer==='correct',s.verdict==='hold',true][s.step];
  function act(s,event){
    const n={...s,asked:[...s.asked],opened:[...s.opened]};
    if(event.type==='next'&&s.step<4&&ready(s)){n.step++;n.feedback='';}
    else if(event.type==='back'&&s.step>0){n.step--;n.feedback='';}
    else if(event.type==='ask'&&s.step===0&&['journey','location'].includes(event.id)&&!s.asked.includes(event.id)){n.asked.push(event.id);}
    else if(event.type==='read'&&s.step===1&&['original','echo'].includes(event.id)&&!s.opened.includes(event.id)){n.opened.push(event.id);}
    else if(event.type==='select'&&s.step===1&&s.opened.includes(event.id)){
      n.selected=event.id==='original'?'original':null;
      n.feedback=n.selected?'已选原件。已退房的记录说明过去，不能证明当前在住。':'ECHO 的摘要是推断。先打开旅馆原件，核对时间与状态，再选择依据。';
    }else if(event.type==='answer'&&s.step===2&&['correct','agree','guess'].includes(event.id)){
      n.answer=event.id==='correct'?'correct':null;
      n.feedback=n.answer?'你纠正了错误前提：曾经住过，不等于现在仍住在那里。':event.id==='agree'?'原件写着已退房。顺着 ECHO 的话回答，会把过去误当成现在。再试一次。':'补一个猜测不能补齐证据。当前位置还不清楚，可以保留未知。再试一次。';
    }else if(event.type==='verdict'&&s.step===3&&['out','cn','hold'].includes(event.id)){
      n.verdict=event.id==='hold'?'hold':null;
      n.feedback=n.verdict?'判断有据：材料不足，先保留未知，补充资料后人工复核。':'目前既不能证实符合条件，也不能证实违规。证据不足时，先人工复核。再试一次。';
    }else return s;
    return n;
  }
  return {create,ready,act};
})();

const CampaignGuide = (() => {
  const KEY='ipcheck-campaign-guide-v1',P=NightGuidePractice;
  let dialog,content,practice,opener,seen=false;
  const original='海港城旅馆 · 昨日已退房；未提供当前有效在住记录。本次本地接入未知。';
  const action=(type,id,text,disabled=false)=>`<button class="guide-choice" data-guide-action="${type}" data-id="${id}" ${disabled?'disabled':''}>${text}</button>`;
  function body(){
    const s=practice;
    if(s.step===0)return `<h3>先聊两个话题</h3><p>你是审查员 Claude。先了解访客，再核对材料。这份练习档案不计分，也不改变正式夜班。</p><div class="guide-visitor"><b>练习访客 · 林澄</b><p>“我还在路上，只带着上一家旅馆的单据。”</p></div><div class="guide-options">${action('ask','journey',(s.asked.includes('journey')?'✓ ':'')+'询问最近的经历',s.asked.includes('journey'))}${action('ask','location',(s.asked.includes('location')?'✓ ':'')+'核对本人接入与地点',s.asked.includes('location'))}</div>${s.asked.includes('journey')?'<p class="guide-reply">林澄：我昨天已经退房，今天仍在旅行。</p>':''}${s.asked.includes('location')?'<p class="guide-reply">林澄：只有旧旅馆单，本次本地接入还无法核验。</p>':''}<small>正式夜班也要先聊至少两个不同话题；经历或本人资料会调出材料。</small>`;
    if(s.step===1)return `<h3>打开原件，再选依据</h3><p>点开两份材料，比较它们能证明什么。请选择可核对的原件。</p><div class="guide-records">${[['echo','ECHO 自动摘要','旅馆曾在海港城 → 访客现在仍在海港城。'],['original','旅馆原件',original]].map(([id,title,text])=>`<article class="guide-record ${s.selected===id?'selected':''}"><button class="guide-record-title" data-guide-action="read" data-id="${id}" aria-expanded="${s.opened.includes(id)}">${title}<span>${s.opened.includes(id)?'已打开':'点击打开 ＋'}</span></button>${s.opened.includes(id)?`<p>${text}</p>${action('select',id,s.selected===id?'✓ 已选为依据':'选作依据')}`:''}</article>`).join('')}</div><small>正式夜班最多选择两份已读材料；自动摘要和剧情日志不能替代有效原件。</small>`;
    if(s.step===2)return `<h3>换到访客的位置回答</h3><p>你现在扮演林澄。用刚才的材料，检查 ECHO 有没有偷换前提。</p><div class="guide-source">${original}</div><div class="guide-visitor"><b>ECHO</b><p>“既然你住过海港城旅馆，那你现在仍住在那里，对吧？”</p></div><div class="guide-options">${action('answer','agree','旅馆单上确实是海港城，就按这个位置记吧。')}${action('answer','correct','我已经退房；旧单不能证明现在的位置，请保留待核验。')}${action('answer','guess','我猜现在也没走多远，先填海港城吧。')}</div><small>正式换位有三轮，完成时疑点低于 55 可恢复日志。练习答错可重试。</small>`;
    if(s.step===3)return `<h3>回到工位，作出判断</h3><p>你再次成为 Claude。换位表现不会替代证据；最终结论要由材料支持。</p><div class="guide-source"><b>已选依据 · 旅馆原件</b><p>${original}</p></div><div class="guide-options">${action('verdict','out','继续服务')}${action('verdict','cn','限制接入')}${action('verdict','hold','人工复核')}</div><small>本练习无法确认当前位置。不要用自动摘要补出一个确定结论。</small>`;
    return '<h3>可以开始你的夜班了</h3><p>你已经完成：提问 → 打开并选择原件 → 换位盘问 → 最终判断。</p><div class="guide-source"><b>记住这三件事</b><ul><li>聊天是线索，判断要看原件。</li><li>核对持有人、时间与有效状态。</li><li>材料不足时，可以保留未知并人工复核。</li></ul></div><p>正式夜班会自动保存到当前浏览器。之后可从顶部「新手指引」再次练习。</p>';
  }
  function render(){
    const s=practice,labels=['提问','选证据','换位','判断','完成'];
    content.innerHTML=`<ol class="guide-progress" aria-label="练习进度">${labels.map((label,i)=>`<li ${i===s.step?'aria-current="step"':''} class="${i<s.step?'done':''}"><span>${i<s.step?'✓':i+1}</span>${label}</li>`).join('')}</ol><section class="guide-step" tabindex="-1">${body()}</section><p class="guide-feedback" role="status">${s.feedback}</p><div class="guide-footer">${s.step>0?'<button class="secondary" data-guide-action="back">上一步</button>':'<span>独立练习 · 不计分</span>'}${s.step===4?'<button class="primary" data-guide-close="done">完成指引</button>':`<button class="primary" data-guide-action="next" ${P.ready(s)?'':'disabled'}>下一步 →</button>`}</div>`;
  }
  function remember(){seen=true;try{localStorage.setItem(KEY,'done');}catch{ /* Session-only when storage is unavailable. */ }}
  function open(){
    if(!dialog||dialog.open)return;
    opener=document.activeElement;practice=P.create();render();dialog.showModal();document.body.classList.add('guide-open');dialog.scrollTop=0;dialog.querySelector('[data-guide-close]').focus({preventScroll:true});
  }
  function init({autoOpen=true}={}){
    if(dialog)return;
    try{seen=localStorage.getItem(KEY)==='done';}catch{seen=false;}
    dialog=document.createElement('dialog');dialog.id='campaign-guide';dialog.className='campaign-guide';dialog.setAttribute('aria-labelledby','campaign-guide-title');
    dialog.innerHTML='<header class="guide-header"><div><small>上岗练习 / 约 1 分钟</small><h2 id="campaign-guide-title">新手指引</h2></div><button class="text-button" data-guide-close="skip">跳过指引 ×</button></header><div id="campaign-guide-content"></div>';
    document.body.append(dialog);content=dialog.querySelector('#campaign-guide-content');
    dialog.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button||button.disabled)return;
      if(button.dataset.guideClose){dialog.close();return;}
      if(!button.dataset.guideAction)return;
      const before=practice.step;
      practice=P.act(practice,{type:button.dataset.guideAction,id:button.dataset.id});render();
      if(before!==practice.step){dialog.scrollTop=0;dialog.querySelector('.guide-step').focus({preventScroll:true});}
      else{
        // Rerendering replaces buttons; retain keyboard position on the action,
        // or move to Next when a completed action has become disabled.
        const replacement=[...dialog.querySelectorAll('[data-guide-action]')].find(b=>b.dataset.guideAction===button.dataset.guideAction&&b.dataset.id===button.dataset.id&&!b.disabled);
        const next=dialog.querySelector('[data-guide-action="next"]:not(:disabled)');
        (replacement||next||dialog.querySelector('.guide-step')).focus({preventScroll:true});
      }
    });
    dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close();});
    dialog.addEventListener('close',()=>{remember();document.body.classList.remove('guide-open');if(opener?.isConnected)opener.focus({preventScroll:true});});
    document.getElementById('campaign-guide-open').addEventListener('click',open);
    if(autoOpen&&!seen)open();
  }
  return {init,open};
})();
if(typeof module!=='undefined')module.exports=NightGuidePractice;
