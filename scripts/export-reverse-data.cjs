// Emit the same branching narrative for the native Godot client.
const fs=require('node:fs'),path=require('node:path');
const C=require(fs.existsSync(path.join(__dirname,'../dist/reverse-core.js'))?'../dist/reverse-core.js':'../reverse-core.js');const nodes={};
const key=s=>[s.cover,s.persona,s.history.length,s.facts.activity||'none',s.facts.dinner||'none'].join('/');
function visit(s){if(s.history.length===5)return null;const k=key(s);if(nodes[k])return k;const stage=C.step(s);nodes[k]={question:stage.question,choices:[]};for(const choice of stage.choices){const n=C.choose({...s,risk:0},choice.id);nodes[k].choices.push({...choice,next:n.history.length===5?null:visit(n)});}return k;}
for(let cover=0;cover<3;cover++)for(let persona=0;persona<3;persona++)visit({...C.create('native'),cover,persona});
const dest=path.join(__dirname,'../godot/scenarios.json');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify({covers:C.covers,personalities:C.personalities,nodes}));console.log(`Exported ${Object.keys(nodes).length} shared dialogue nodes.`);
