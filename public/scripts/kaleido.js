const canvas=document.getElementById('scope'),ctx=canvas.getContext('2d');
const knobs=['facets','turn','zoom'].map(id=>document.getElementById(id));
const paletteByColour={red:['#e98b8d','#442838'],orange:['#eeb47c','#442638'],yellow:['#e9da52','#283e56'],green:['#b9ce91','#293d32'],blue:['#b4d8e2','#26354c'],purple:['#c9aedb','#3b284d'],pink:['#ed9dbb','#4d263c'],bw:['#dedbcf','#292932']};
const excludedKaleidoscopeOrders=new Set([3,5,6,10,16,20,21,22,23,25,26,28,30,31,35]);
const scenes=artworks.filter(art=>!excludedKaleidoscopeOrders.has(art.order)).map(art=>[art.id,...(paletteByColour[art.colour]||paletteByColour.blue)]);
// Pick a fresh colour on every visit; keep its artwork and palette together.
let previousColour=null;
try{previousColour=sessionStorage.getItem('mara-opening-colour')}catch{}
const openingChoices=scenes.map((_,i)=>i).filter(i=>scenes[i][1]!==previousColour);
const openingScene=openingChoices[Math.floor(Math.random()*openingChoices.length)];
document.body.style.setProperty('--paper',scenes[openingScene][1]);
document.body.style.setProperty('--ink',scenes[openingScene][2]);
try{sessionStorage.setItem('mara-opening-colour',scenes[openingScene][1])}catch{}
let scene=openingScene,picture=null,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,frame=0,lastPaint=0,elapsed=0,lastTime=0,sourcePattern=null,inView=true,interacting=false,zoomBase=.5,zoomPhase=0,scopeHighlighted=false;
const motion=document.getElementById('motion');
function updateMotion(){motion.setAttribute('aria-pressed',String(playing));motion.textContent=playing?window.maraT('Pause movement Ⅱ'):window.maraT('Let it move ▷')}
function render(){
 if(!picture)return;
 const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5),w=Math.round(r.width*d),h=Math.round(r.height*d);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 ctx.clearRect(0,0,w,h);
 const n=Number(knobs[0].value),turn=Number(knobs[1].value),zoom=Number(knobs[2].value),radius=Math.min(w,h)*.47;
 ctx.save();ctx.translate(w*.5,h*.5);
 // A star silhouette around 2n alternating mirrored sectors.
 ctx.beginPath();for(let k=0;k<2*n;k++){const angle=k*Math.PI/n-Math.PI/2,rr=radius*(k%2?.83:1);const x=Math.cos(angle)*rr,y=Math.sin(angle)*rr;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.clip();
 const angle=Math.PI/n;
 for(let k=0;k<2*n;k++){
  ctx.save();ctx.rotate(k*angle-Math.PI/2);
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,radius+2,0,angle+.002);ctx.closePath();ctx.clip();
  if(k%2){ctx.rotate(angle);ctx.scale(1,-1)}
  ctx.rotate(turn);
  const scale=radius*1.65/Math.min(picture.naturalWidth,picture.naturalHeight)*zoom;
  const iw=picture.naturalWidth*scale,ih=picture.naturalHeight*scale;
  ctx.translate(-iw*.32+Math.sin(turn)*radius*.10,-ih*.32);
  ctx.scale(scale,scale);ctx.fillStyle=sourcePattern;
  ctx.fillRect(-picture.naturalWidth*4,-picture.naturalHeight*4,picture.naturalWidth*8,picture.naturalHeight*8);ctx.restore();
 }

 ctx.restore();
}
function tick(now){
 frame=0;
 const dt=lastTime?Math.min(now-lastTime,100):0;lastTime=now;
 try{
  if(playing&&!interacting&&inView&&!document.hidden&&!document.querySelector('dialog[open]')){
   elapsed+=dt;
   knobs[1].value=(Number(knobs[1].value)+dt*.000085)%Number(knobs[1].max);
   render();
  }
 }finally{frame=requestAnimationFrame(tick)}
}
function loadScene(){
 const index=scene,[id,bg,ink]=scenes[index];const img=new Image();
 img.onload=()=>{if(scene!==index)return;picture=img;applyArtworkColours(img);
 const tile=document.createElement('canvas');tile.width=img.naturalWidth*2;tile.height=img.naturalHeight*2;
 const tc=tile.getContext('2d');for(let row=0;row<2;row++)for(let col=0;col<2;col++){tc.save();tc.translate(col?tile.width:0,row?tile.height:0);tc.scale(col?-1:1,row?-1:1);tc.drawImage(img,0,0);tc.restore()}
 sourcePattern=ctx.createPattern(tile,'repeat');
 const preview=document.getElementById('original-preview');preview.src=img.src;preview.alt=artworks.find(a=>a.id===id).alt;
 document.body.style.setProperty('--paper',bg);document.body.style.setProperty('--ink',ink);try{sessionStorage.setItem('mara-palette',JSON.stringify({paper:bg,ink}))}catch{}render();document.getElementById('scope-status').textContent=window.maraT('Kaleidoscope artwork: ')+artworks.find(a=>a.id===id).label};
 img.onerror=()=>{document.getElementById('scope-status').textContent=window.maraT('Could not load artwork. Please try another.')};img.src='assets/'+id+'.webp';
}
function changeArtwork(){scene=(scene+1)%scenes.length;loadScene()}
document.getElementById('change').addEventListener('click',changeArtwork);
canvas.addEventListener('click',changeArtwork);
document.querySelector('.hero').addEventListener('click',event=>{if(event.target.closest('a,button,input,canvas,.instrument,.read-control'))return;changeArtwork()});
let scopeHover=false,scopeFocus=false;
function highlightScope(){scopeHighlighted=scopeHover||scopeFocus;render()}
canvas.addEventListener('pointerenter',()=>{scopeHover=true;highlightScope()});
canvas.addEventListener('pointerleave',()=>{scopeHover=false;highlightScope()});
canvas.addEventListener('focus',()=>{scopeFocus=true;highlightScope()});
canvas.addEventListener('blur',()=>{scopeFocus=false;highlightScope()});
canvas.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();changeArtwork()}});
motion.addEventListener('click',()=>{playing=!playing;lastTime=performance.now();updateMotion();if(!frame)frame=requestAnimationFrame(tick)});
knobs.forEach(knob=>{
 knob.addEventListener('pointerdown',()=>{interacting=true});
 knob.addEventListener('input',()=>{zoomBase=Number(knobs[2].value);zoomPhase=0;render()});
});
function releaseSlider(){if(interacting){zoomBase=Number(knobs[2].value);zoomPhase=0;interacting=false}}
window.addEventListener('pointerup',releaseSlider);window.addEventListener('pointercancel',releaseSlider);window.addEventListener('blur',releaseSlider);
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting},{threshold:.05}).observe(canvas);
new ResizeObserver(render).observe(canvas);updateMotion();loadScene();frame=requestAnimationFrame(tick);
const grid=document.getElementById('gallery');
document.getElementById('original').addEventListener('click',e=>{e.preventDefault();const button=grid.querySelector('[data-art="'+scenes[scene][0]+'"]');if(button){const card=button.closest('.art-card');card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});button.focus({preventScroll:true});card.classList.remove('located');void card.offsetWidth;card.classList.add('located');setTimeout(()=>card.classList.remove('located'),2200)}});
const sizes=document.getElementById('grid-size');
function resizeGrid(){grid.style.setProperty('--cols',sizes.value);grid.style.setProperty('--mobile-cols',Number(sizes.value)<=2?1:Number(sizes.value)>=5?3:2)}sizes.addEventListener('input',resizeGrid);resizeGrid();
const rainbowOrder=['red','orange','yellow','green','blue','purple','pink','bw'];
document.querySelectorAll('[data-sort]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-sort]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let list=[...artworks];
 grid.querySelectorAll('.category-break').forEach(label=>label.remove());
 if(button.dataset.sort==='rainbow')list.sort((a,b)=>rainbowOrder.indexOf(a.colour)-rainbowOrder.indexOf(b.colour)||a.order-b.order);
 if(button.dataset.sort==='kind')list.sort((a,b)=>kindGroups.findIndex(group=>group.key===a.kind)-kindGroups.findIndex(group=>group.key===b.kind)||a.order-b.order);
 if(button.dataset.sort==='shuffle')for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}
 list.forEach(art=>grid.append(grid.querySelector('[data-id="'+art.id+'"]')));
 if(button.dataset.sort==='kind'){
  [...kindGroups].reverse().forEach(group=>{
   const first=list.find(art=>art.kind===group.key);if(!first)return;
   const label=document.createElement('h3');label.className='category-break';label.textContent=window.maraT(group.label);
   grid.insertBefore(label,grid.querySelector('[data-id="'+first.id+'"]'));
  });
 }
 visibleArt=list;
}));

function applyArtworkColours(img){
 const sample=document.createElement('canvas');sample.width=sample.height=40;const sc=sample.getContext('2d');sc.drawImage(img,0,0,40,40);
 const pixels=sc.getImageData(0,0,40,40).data,bins=new Map();
 for(let i=0;i<pixels.length;i+=4){const r=pixels[i],g=pixels[i+1],b=pixels[i+2];if(Math.max(r,g,b)-Math.min(r,g,b)<25||Math.max(r,g,b)<65)continue;const key=[r,g,b].map(v=>Math.round(v/40)*40).join(',');const bin=bins.get(key)||{n:0,r:0,g:0,b:0};bin.n++;bin.r+=r;bin.g+=g;bin.b+=b;bins.set(key,bin)}
 const colours=[...bins.values()].sort((a,b)=>b.n-a.n).slice(0,3).map(v=>`rgb(${Math.round(v.r/v.n)} ${Math.round(v.g/v.n)} ${Math.round(v.b/v.n)})`);
 for(let i=0;i<3;i++)document.body.style.setProperty('--art-'+i,colours[i]||colours[0]||'#734280');
}
document.getElementById('download').addEventListener('click',()=>{
 if(!picture)return;
 playing=false;updateMotion();render();
 const out=document.createElement('canvas');out.width=1600;out.height=1740;const context=out.getContext('2d');
 context.fillStyle=scenes[scene][1];context.fillRect(0,0,out.width,out.height);
 const scale=Math.min(1520/canvas.width,1520/canvas.height),w=canvas.width*scale,h=canvas.height*scale;
 context.drawImage(canvas,(1600-w)/2,(1560-h)/2,w,h);
 context.save();context.translate(205,1320);context.rotate(-.075);
 context.shadowColor='#25182b44';context.shadowBlur=22;context.shadowOffsetY=14;context.fillStyle='#fffaf2';context.fillRect(-145,-180,290,360);context.shadowColor='transparent';
 const postcardScale=Math.min(254/picture.naturalWidth,324/picture.naturalHeight),postcardWidth=picture.naturalWidth*postcardScale,postcardHeight=picture.naturalHeight*postcardScale;
 context.drawImage(picture,-postcardWidth/2,-postcardHeight/2,postcardWidth,postcardHeight);context.restore();
 context.fillStyle=scenes[scene][2];context.textAlign='center';context.font='26px Georgia';
 context.fillText(window.maraT("Made on Mara Brandsen’s website, with her artwork."),800,1615);
 context.font='20px Arial';context.fillText(window.maraT('marabrandsen.nl · Original artwork © Mara Brandsen'),800,1660);
 out.toBlob(blob=>{if(!blob){document.getElementById('scope-status').textContent=window.maraT('Could not save the image. Please try again.');return}const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mara-brandsen-kaleidoscope-'+scenes[scene][0]+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);document.getElementById('scope-status').textContent=window.maraT('PNG saved with the background colour and artwork credit.')},'image/png');
});

// Show only the ink from the cropped handwriting recording.
const nameVideo=document.getElementById('name-video'),nameCanvas=document.getElementById('name-canvas'),nameButton=document.querySelector('.name-animation');
const nameContext=nameCanvas.getContext('2d',{willReadFrequently:true});
let nameFrame=0,lastNameFrame=0;
function paintName(time){
 if(nameVideo.paused||nameVideo.ended)return;
 if(time-lastNameFrame>33&&nameVideo.readyState>=2){
  nameContext.drawImage(nameVideo,0,0,1000,428);
  const image=nameContext.getImageData(0,0,1000,428),p=image.data;
  for(let i=0;i<p.length;i+=4){const light=(p[i]+p[i+1]+p[i+2])/3;p[i]=p[i+1]=p[i+2]=0;p[i+3]=Math.max(0,Math.min(255,(248-light)*255/248))}
  nameContext.putImageData(image,0,0);nameButton.classList.add('drawing');lastNameFrame=time;
 }
 nameFrame=requestAnimationFrame(paintName);
}
function stopName(){cancelAnimationFrame(nameFrame);nameButton.classList.remove('drawing')}
function playName(){cancelAnimationFrame(nameFrame);nameVideo.currentTime=0;nameVideo.playbackRate=2;nameVideo.play().then(()=>{nameFrame=requestAnimationFrame(paintName)}).catch(stopName)}
nameVideo.addEventListener('ended',stopName);nameVideo.addEventListener('error',stopName);
nameButton.addEventListener('click',()=>{if(!nameVideo.paused){nameVideo.pause();stopName()}else playName()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){nameVideo.pause();stopName()}});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)playName();
