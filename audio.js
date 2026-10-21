'use strict';
/* Original procedural Foley and soundtrack. No audio files or network requests. */
const Sound=(()=>{
 const RATE=22050, settingsKey='ipcheck-audio-v2';
 let ctx=null,master=null,fx=null,amb=null,music=null,unlocked=false,sceneActive=false,ambientNode=null,beatTimer=null,nextBeat=0,beat=0;
 let prefs={enabled:true,master:.65,effects:.75,ambience:.30,music:.20};
 try{const p=JSON.parse(localStorage.getItem(settingsKey));if(p){for(const k of ['master','effects','ambience','music'])if(Number.isFinite(p[k]))prefs[k]=Math.max(0,Math.min(1,p[k]));if(typeof p.enabled==='boolean')prefs.enabled=p.enabled}}catch{}
 const cache=new Map();
 function random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296*2-1}}
 function synth(name,variant=0){const dur=({paper:.30,stamp:.44,hold:.40,key:.045,click:.04,foot:.13,intercom:.65,printer:.50,good:.5,bad:.65,bell:1.5,ambient:4,tick:.06})[name]||.08;const a=new Float32Array(Math.ceil(RATE*dur)),rand=random(691+variant*97);let low=0,phase=0;
 for(let i=0;i<a.length;i++){const t=i/RATE,n=rand();low+=.13*(n-low);let v=0;
 if(name==='paper'){v=(n-low)*Math.exp(-t*10)*(Math.sin(t*78)**2*.7+.3)*.24;}
 else if(name==='stamp'){const f=variant===1?78:102;phase+=2*Math.PI*(f*Math.exp(-t*3))/RATE;v=Math.sin(phase)*Math.exp(-t*19)*.6+low*Math.exp(-t*85)*1.7+(n-low)*Math.exp(-t*170)*.16;if(t>.035&&t<.085)v+=Math.sin(2*Math.PI*190*t)*Math.exp(-(t-.035)*65)*.09;}
 else if(name==='hold'){v=Math.sin(2*Math.PI*180*t)*Math.exp(-t*22)*.3+low*Math.exp(-t*35)*.3;}
 else if(name==='key'||name==='click'){v=(n-low)*Math.exp(-t*160)*.17+Math.sin(2*Math.PI*(1700+variant*45)*t)*Math.exp(-t*190)*.10;}
 else if(name==='foot'){v=low*Math.exp(-t*50)*.65+Math.sin(2*Math.PI*75*t)*Math.exp(-t*42)*.22;}
 else if(name==='intercom'){const gate=Math.max(0,Math.sin(2*Math.PI*7*t));v=(Math.sin(2*Math.PI*148*t)+.45*Math.sin(2*Math.PI*460*t)+.2*n)*gate*.10*Math.sin(Math.PI*t/dur);if(t<.018)v+=n*.12;}
 else if(name==='printer'){v=((Math.sin(2*Math.PI*62*t)>0?.09:-.09)+n*.06)*(Math.sin(2*Math.PI*19*t)>.1?1:.15)*Math.min(1,t*50)*Math.min(1,(dur-t)*20);}
 else if(name==='good'){const f=t<.16?440:t<.32?554.37:659.25;v=Math.sin(2*Math.PI*f*t)*.14*Math.sin(Math.PI*(t%.16)/.16);}
 else if(name==='bad'){v=(Math.sin(2*Math.PI*146.83*t)+Math.sin(2*Math.PI*155.56*t))*.10*Math.exp(-t*4);}
 else if(name==='bell'){v=(Math.sin(2*Math.PI*880*t)*.20+Math.sin(2*Math.PI*1321*t)*.08+Math.sin(2*Math.PI*2198*t)*.04)*Math.exp(-t*3.4);}
 else if(name==='ambient'){v=low*.20+Math.sin(2*Math.PI*50*t)*.017+Math.sin(2*Math.PI*100*t)*.008;}
 else if(name==='tick'){v=Math.sin(2*Math.PI*780*t)*Math.exp(-t*70)*.10;}
 let fade=Math.min(1,t*800)*Math.min(1,(dur-t)*90);if(name==='ambient')fade=Math.min(1,t*6)*Math.min(1,(dur-t)*6);a[i]=Math.max(-.85,Math.min(.85,v*fade));}
 return a;}
 function save(){try{localStorage.setItem(settingsKey,JSON.stringify(prefs))}catch{}}
 function apply(){if(master)master.gain.setTargetAtTime(prefs.enabled?prefs.master:0,ctx.currentTime,.03);if(fx)fx.gain.value=prefs.effects;if(amb)amb.gain.value=prefs.ambience;if(music)music.gain.value=prefs.music;save()}
 function unlock(){if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.connect(ctx.destination);fx=ctx.createGain();fx.connect(master);amb=ctx.createGain();amb.connect(master);music=ctx.createGain();music.connect(master);apply()}catch{return false}}unlocked=true;ctx.resume().catch(()=>{});if(sceneActive)startBed();return true}
 function buffer(name,v=0){let key=name+v;if(!cache.has(key)){const a=synth(name,v),b=ctx.createBuffer(1,a.length,RATE);b.copyToChannel(a,0);cache.set(key,b)}return cache.get(key)}
 function play(name,v=0,delay=0){if(!ctx||!unlocked||!prefs.enabled||document.hidden)return;const source=ctx.createBufferSource();source.buffer=buffer(name,v);source.connect(fx);source.start(ctx.currentTime+delay);source.onended=()=>source.disconnect()}
 function note(freq,start,length,gain,type='triangle'){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(gain,start+.02);g.gain.exponentialRampToValueAtTime(.0001,start+length);o.connect(g);g.connect(music);o.start(start);o.stop(start+length+.02);o.onended=()=>{o.disconnect();g.disconnect()}}
 function schedule(){if(!ctx||ctx.state!=='running'||!sceneActive||document.hidden)return;const step=60/84/2; if(nextBeat<ctx.currentTime)nextBeat=ctx.currentTime+.06;while(nextBeat<ctx.currentTime+.16){const roots=[110,130.813,98,82.407],root=roots[Math.floor(beat/16)%4];if(beat%4===0)note(root/2,nextBeat,.6,.14);const intervals=[1,1.5,2,1.5,1.2,1.5,2.4,1.5];if(beat%2===0)note(root*intervals[(beat/2)%8],nextBeat,.5,.045);nextBeat+=step;beat=(beat+1)%64}}
 function startBed(){if(!ctx||!sceneActive||document.hidden)return;if(!ambientNode){ambientNode=ctx.createBufferSource();ambientNode.buffer=buffer('ambient');ambientNode.loop=true;ambientNode.connect(amb);ambientNode.start()}if(!beatTimer){nextBeat=ctx.currentTime+.1;beatTimer=setInterval(schedule,80)}}
 function scene(active){sceneActive=active;if(active&&unlocked){ctx.resume().catch(()=>{});startBed()}else{if(ambientNode){ambientNode.stop();ambientNode.disconnect();ambientNode=null}clearInterval(beatTimer);beatTimer=null}}
 function set(k,value){if(k==='enabled')prefs.enabled=!!value;else if(['master','effects','ambience','music'].includes(k))prefs[k]=Math.max(0,Math.min(1,Number(value)));apply()}
 function arriving(){play('intercom');play('foot',1,.35);play('foot',2,.62);play('paper',0,.85)}
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(unlocked&&sceneActive){ctx.resume().catch(()=>{});nextBeat=ctx.currentTime+.1}});
 return{unlock,play,scene,set,arriving,get prefs(){return{...prefs}},get available(){return !!ctx},synth};
})();
if(typeof module!=='undefined')module.exports=Sound;
