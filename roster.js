'use strict';
const Roster=(()=>{
 function shuffle(items,rng){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
 function make(cases,rng=Math.random){const order=[];for(let tier=0;tier<3;tier++){const pool=cases.map((c,i)=>({c,i})).filter(x=>x.c.tier===tier);const hasPolicy=pool.some(x=>x.c.policy==='account');const familiar=shuffle(pool.filter(x=>x.i<18),rng).slice(0,hasPolicy?2:3);const fresh=shuffle(pool.filter(x=>x.i>=18&&x.c.policy!=='account'),rng).slice(0,hasPolicy?2:3);const policy=shuffle(pool.filter(x=>x.c.policy==='account'),rng).slice(0,2);order.push(...shuffle([...familiar,...fresh,...policy],rng).map(x=>x.i))}const encounters=order.map(i=>({mood:Math.floor(rng()*3),look:Math.floor(rng()*18),task:Math.floor(rng()*5),evidenceOrder:shuffle(['network',...cases[i].records.map(e=>e.id)],rng)}));return {order,encounters}}
 const moods=['有点紧张','急着赶路','愿意配合'];
 const greetings=['我不太擅长解释这些记录。','后面还排着队，能快一点吗？','你慢慢核对，我可以等。'];
 const tasks=[['排查一段报错','请先保留完整报错和最小复现；办完登记，我们再按步骤缩小问题。'],['润色一封邮件','我可以帮你把目的、背景和期望回复写清楚，先不急着替你下结论。'],['整理一份研究笔记','先区分原始观察与自己的推测，再按来源整理，会更容易核对。'],['改一段游戏对白','先确定角色此刻想要什么，再让措辞贴合他的处境。'],['检查一份行程表','把预订、实际出发和抵达状态分开列出，时间顺序会更清楚。']];
 return {make,moods,greetings,tasks};
})();
if(typeof module!=='undefined')module.exports=Roster;
