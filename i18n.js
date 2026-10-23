'use strict';
const I18n=(()=>{
 let lang='zh';try{lang=localStorage.getItem('ipcheck-language')==='en'?'en':'zh'}catch{}
 const pairs=[],attributes=[];
 const dictionary={
 '东八区检查站 · 夜班档案':'UTC+8 CHECKPOINT · NIGHT ARCHIVES','♫ 声音':'♫ Sound','值班手册':'Handbook','新手指引':'Beginner guide','Ⅱ 暂停':'Ⅱ Pause',
 'RAINY NIGHT / 雨夜档案':'RAINY NIGHT / ARCHIVES','雨落有声，':'Hear the rain.','判断有据。':'Keep the evidence.','以 Claude 之名，温柔倾听，审慎判断。':'As Claude, listen with care. Review with evidence.',
 '零点回声':'MIDNIGHT ECHO','48 份档案 · 18 次相遇':'48 FILES · 18 ENCOUNTERS','你的身份 / 值班审查员':'YOUR ROLE / REVIEW OFFICER',
 '档案进度':'Files reviewed','审查得分':'Review score','证据连对':'Evidence streak','剩余容错':'Mistakes left',
 '▤ 剧情档案':'▤ Story journal','访客窗口':'Visitor window','请出示你的资料':'PLEASE PRESENT YOUR RECORDS',
 '值班审查员 · 008 号工位':'REVIEW OFFICER · DESK 008','值班提醒':'Desk reminder','审核服务资格与账号行为。':'Review eligibility and account use.',
 '语言、国籍、时区不是违规证据。':'Language, nationality and timezone are not breach evidence.',
 '01 / 桌面档案':'01 / CASE FILE','点击虚线文字标记线索':'Mark clues with a click','访客申请表':'Application','HOLDER / 持有人':'HOLDER',
 '申请人自述 · 尚未独立核验':'SELF-REPORTED · NOT INDEPENDENTLY VERIFIED','连接记录':'Connection log','出口 IP ≠ 真实所在地':'EXIT IP ≠ ACTUAL LOCATION','随身便签 / NOTE':'PERSONAL NOTE',
 '02 / 核验材料':'02 / EVIDENCE','选中 1–2 项，作为判定依据':'Select 1–2 supporting records','INSPECTOR 008 · 在线':'INSPECTOR 008 · ONLINE','我的工作记录':'MY REVIEW NOTES',
 '03 / 调查访客':'03 / INVESTIGATE','访客调查台':'INVESTIGATION DESK','通话抄录 / TRANSCRIPT':'TRANSCRIPT','跳过打字':'Skip typing','选择调查操作':'INVESTIGATION TOOLS','快捷键 1 / 2 / 3':'KEYS 1 / 2 / 3',
 '每项调查 −5 分 · 费用立即扣除':'−5 PER INQUIRY · CHARGED IMMEDIATELY','04 / 审核决定':'04 / DISPOSITION','盖章即提交':'STAMP TO SUBMIT','核对完毕，请盖章。':'Ready for a decision?','选择与当前证据一致的决定':'Match your decision to the evidence',
 '继续服务':'Continue','限制访问':'Restrict','人工复核':'Review','本次审查未证实违规':'No breach established in this review','已证实地区或账号违规':'Verified region or account breach','资料不足、冲突或申诉待查':'Missing, conflicting or disputed evidence',
 '6.0':'6.0','· 独立同人作品，与 Anthropic 无关':'· Independent fan game; not affiliated with Anthropic','全部档案与凭证均为虚构 · 无真实 IP 检测':'Fictional records · No real IP checks','重新开局':'Restart','资料':'Files','核验材料':'Evidence','调查 / 盖章':'Investigate / stamp',
 '窗外 / 持续降雨':'OUTSIDE / STEADY RAIN','21 OCT · 夜班记录':'21 OCT · NIGHT ARCHIVE'
 };
 function text(zh,en){return lang==='en'?en:zh}
 function capture(){if(!document.createTreeWalker)return;const walker=document.createTreeWalker(document.body,4);let n;while(n=walker.nextNode()){if(n.parentElement.closest('script,style'))continue;const raw=n.textContent,key=raw.trim();if(dictionary[key])pairs.push({node:n,zh:raw,en:raw.replace(key,dictionary[key])})}const attrMap={'东八区检查站':'UTC+8 Checkpoint','音量与音效设置':'Volume and sound settings','当前剧情':'Current story','Claude 的工作台':'Claude’s desk','Claude 的值班形象':'Claude’s character portrait','Claude 头像':'Claude avatar','调查访客':'Investigate visitor','审核决定':'Review decision','显示完整对话':'Show the full dialogue','工位快捷导航':'Desk navigation','橙色长发、戴眼镜、身着黑金与蕾丝白长裙的 Claude，在落雪中值守':'Claude: orange hair, glasses and a black, gold and white dress; original character illustration'};document.querySelectorAll('[aria-label],[title],[alt]').forEach(node=>{for(const key of ['aria-label','title','alt']){const zh=node.getAttribute(key);if(attrMap[zh])attributes.push({node,key,zh,en:attrMap[zh]})}});apply();}
 function apply(){document.documentElement.lang=lang==='en'?'en':'zh-CN';document.title=lang==='en'?'IP CHECK · Rain Archives':'IP CHECK · 雨夜档案';pairs.forEach(p=>p.node.textContent=p[lang]);attributes.forEach(p=>p.node.setAttribute(p.key,p[lang]));const b=document.getElementById('language-toggle');if(b){b.textContent='中 / EN';b.setAttribute('aria-label',lang==='en'?'Switch to Chinese':'切换为 English');b.setAttribute('title',lang==='en'?'Switch to Chinese':'Switch to English')}}
 function toggle(){lang=lang==='zh'?'en':'zh';try{localStorage.setItem('ipcheck-language',lang)}catch{}apply()}
 return {text,capture,apply,toggle,get lang(){return lang}};
})();
const t=(zh,en)=>I18n.text(zh,en);
I18n.capture();

