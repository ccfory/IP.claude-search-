'use strict';
/* Procedural Foley plus the user's background track, played through one mixer. */
const Sound=(()=>{
 const RATE=22050, settingsKey='ipcheck-audio-v2';
 let ctx=null,master=null,fx=null,amb=null,music=null,unlocked=false,sceneActive=false,musicActive=false,ambientNode=null,player=null,musicSource=null,musicFailed=false;
 let prefs={enabled:true,master:.65,effects:.75,ambience:.30,music:.20};
 try{const p=JSON.parse(localStorage.getItem(settingsKey));if(p){for(const k of ['master','effects','ambience','music'])if(Number.isFinite(p[k]))prefs[k]=Math.max(0,Math.min(1,p[k]));if(typeof p.enabled==='boolean')prefs.enabled=p.enabled}}catch{}
 const cache=new Map();
 function random(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296*2-1}}
 function synth(name,variant=0){const dur=({paper:.30,stamp:.44,hold:.40,key:.045,click:.04,foot:.13,intercom:.65,printer:.50,good:.5,bad:.65,bell:1.5,ambient:48,tick:.06})[name]||.08;const a=new Float32Array(Math.ceil(RATE*dur)),rand=random(691+variant*97);let low=0,phase=0,roof=0,wind=0;
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
 else if(name==='ambient'){
  // Interior perspective: diffuse rain, softened roof patter, slow wind gusts.
  roof+=.025*(n-roof);wind+=.003*(n-wind);
  const swell=.78+.13*Math.sin(2*Math.PI*t/17+variant*.6)+.09*Math.sin(2*Math.PI*t/7.3);
  v=((n-low)*.035+low*.28+roof*.34)*swell+wind*.32;
  // A distant, low rumble rather than a sharp thunder crack.
  for(const at of [18.4,38.7]){const age=t-at;if(age>0&&age<5)v+=roof*.7*Math.sin(Math.PI*age/5)**2;}
 }
 else if(name==='tick'){v=Math.sin(2*Math.PI*780*t)*Math.exp(-t*70)*.10;}
 let fade=Math.min(1,t*800)*Math.min(1,(dur-t)*90);if(name==='ambient')fade=Math.min(1,t)*Math.min(1,dur-t);a[i]=Math.max(-.85,Math.min(.85,v*fade));}
 if(name==='ambient'){
  // Irregular droplets hitting sill and glass, independently placed in each ear.
  const drops=random(823+variant*351);
  for(let sec=.7;sec<dur-.5;sec+=.14+(drops()+1)*.31){const amp=.018+(drops()+1)*.024,freq=850+(drops()+1)*1800,at=Math.floor(sec*RATE);for(let j=0;j<RATE*.075&&at+j<a.length;j++){const dt=j/RATE;a[at+j]+=amp*Math.sin(2*Math.PI*freq*dt)*Math.exp(-dt*95)*Math.min(1,dt*1600);}}
 }
 return a;}
 function save(){try{localStorage.setItem(settingsKey,JSON.stringify(prefs))}catch{}}
 function status(){const tr=(a,b)=>typeof t==='function'?t(a,b):a;if(musicFailed)return tr('音乐暂时无法播放','Music unavailable');if(!unlocked)return tr('进入值班后播放','Starts after interaction');if(!prefs.enabled||prefs.master===0||prefs.music===0)return tr('已静音','Muted');if(document.hidden||!musicActive)return tr('已暂停','Paused');if(!player||player.readyState<3)return tr('音乐载入中','Loading music');return player.paused?tr('等待播放','Waiting'):tr('循环播放中','Looping')}
 function updateStatus(){if(typeof document==='undefined')return;const el=document.getElementById('music-status');if(el)el.textContent=status()}
 function syncMusic(){if(!player){updateStatus();return}const active=unlocked&&musicActive&&prefs.enabled&&prefs.master>0&&prefs.music>0&&!document.hidden&&!musicFailed;if(!active)player.pause();else if(player.paused){const pending=player.play();if(pending)pending.catch(error=>{if(error.name!=='AbortError'&&error.name!=='NotAllowedError')musicFailed=true;updateStatus()})}updateStatus()}
 function connectTrack(){if(player||typeof document==='undefined')return;const element=document.getElementById('bgm-track');if(!element)return;try{musicSource=ctx.createMediaElementSource(element);musicSource.connect(music);player=element;player.loop=true;player.volume=1;for(const event of ['playing','pause','waiting','canplay'])player.addEventListener(event,updateStatus);player.addEventListener('error',()=>{musicFailed=true;updateStatus()})}catch{musicFailed=true}}
 function apply(){if(master)master.gain.setTargetAtTime(prefs.enabled?prefs.master:0,ctx.currentTime,.03);if(fx)fx.gain.value=prefs.effects;if(amb)amb.gain.value=prefs.ambience;if(music)music.gain.setTargetAtTime(prefs.music,ctx.currentTime,.03);save();if(unlocked&&sceneActive&&prefs.enabled&&!document.hidden)startBed();else stopAmbience();syncMusic()}
 function unlock(){if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.connect(ctx.destination);fx=ctx.createGain();fx.connect(master);amb=ctx.createGain();amb.connect(master);music=ctx.createGain();music.connect(master);apply()}catch{return false}}connectTrack();unlocked=true;ctx.resume().catch(()=>{});if(sceneActive)startBed();syncMusic();return true}
 function buffer(name,v=0){let key=name+v;if(!cache.has(key)){const stereo=name==='ambient',channels=stereo?2:1;let b;for(let ch=0;ch<channels;ch++){let a=synth(name,v+ch);if(stereo){const len=a.length-RATE,loop=new Float32Array(len);for(let i=0;i<len;i++)loop[i]=a[i]+(i<RATE?a[i+len]:0);a=loop;}if(!b)b=ctx.createBuffer(channels,a.length,RATE);b.copyToChannel(a,ch);}cache.set(key,b)}return cache.get(key)}
 function play(name,v=0,delay=0){if(!ctx||!unlocked||!prefs.enabled||document.hidden)return;const source=ctx.createBufferSource();source.buffer=buffer(name,v);source.connect(fx);source.start(ctx.currentTime+delay);source.onended=()=>source.disconnect()}
 function startBed(){if(!ctx||!sceneActive||!unlocked||!prefs.enabled||document.hidden)return;if(!ambientNode){ambientNode=ctx.createBufferSource();ambientNode.buffer=buffer('ambient');ambientNode.loop=true;ambientNode.connect(amb);ambientNode.start()}}
 function stopAmbience(){if(ambientNode){ambientNode.stop();ambientNode.disconnect();ambientNode=null}}
 function scene(active,keepMusic=false){sceneActive=active||keepMusic;musicActive=active||(keepMusic&&musicActive);if(sceneActive&&unlocked){ctx.resume().catch(()=>{});startBed()}else stopAmbience();syncMusic()}
 function set(k,value){if(k==='enabled')prefs.enabled=!!value;else if(['master','effects','ambience','music'].includes(k))prefs[k]=Math.max(0,Math.min(1,Number(value)));apply()}
 function arriving(){play('intercom');play('foot',1,.35);play('foot',2,.62);play('paper',0,.85)}
 if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){stopAmbience();if(player)player.pause();ctx.suspend().catch(()=>{})}else if(unlocked&&(sceneActive||musicActive)){ctx.resume().catch(()=>{});startBed();syncMusic()}updateStatus()});
 return{unlock,play,scene,set,arriving,get prefs(){return{...prefs}},get available(){return !!ctx},get musicStatus(){return status()},synth};
})();
if(typeof module!=='undefined')module.exports=Sound;
