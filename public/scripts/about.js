document.getElementById('copy-email').addEventListener('click',async()=>{const feedback=document.getElementById('contact-feedback');try{await navigator.clipboard.writeText('mejgbrandsen@gmail.com');feedback.textContent=window.maraT('Email address copied.')}catch{feedback.textContent=window.maraT('You can select the email address above to copy it.')}});

const layer=document.querySelector('.wander-layer'),toggle=document.getElementById('wander-toggle'),gravityToggle=document.getElementById('gravity-toggle'),gravityControl=document.getElementById('gravity-control'),gravityInput=document.getElementById('gravity-a'),gravityOutput=document.getElementById('gravity-output'),meteorButton=document.getElementById('meteor-button'),meteorCounter=document.getElementById('meteor-count'),meteorite=document.getElementById('meteorite'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const preview=document.getElementById('photo-preview'),previewImage=document.getElementById('preview-image'),previewTitle=document.getElementById('preview-title'),previewNote=document.getElementById('preview-note'),previewWorkLink=document.getElementById('preview-work-link');
const photoNotes=[
 {text:'This was taken during an outdoor painting day I joined with my grandparents.',work:34},
 {text:'I love hiking. This was taken in Madeira.'},
 {text:'I love cats. This is Maus.'},
 {text:'I created this painting for a cancer awareness exhibition.',work:33},
 {text:'This is me in the snow.'},
 {text:'I love doing sports, especially running.'},
 {text:'I spent the summer of 2025 studying biomedical engineering in London. Here we X-rayed an avocado.'},
 {text:'I painted a car for Bomencentrum Nederland.'},
 {text:'Wearing my BSc university’s merch.'}
];
const gravityPresets=[
 {name:'Moon',value:1.62,sky:['#22283f','#797c91']},{name:'Mercury',value:3.70,sky:['#352d35','#a37864']},{name:'Mars',value:3.71,sky:['#491d2b','#d56843']},
 {name:'Uranus',value:8.69,sky:['#173d59','#73ced1']},{name:'Venus',value:8.87,sky:['#5b2c54','#e5a05f']},{name:'Earth',value:9.81,sky:['#18285b','#396a87']},
 {name:'Saturn',value:10.44,sky:['#3a315a','#d4b375']},{name:'Neptune',value:11.15,sky:['#101c56','#315ee8']},{name:'Jupiter',value:24.79,sky:['#3e2531','#d09568']}
];
function loadMeteorCount(){try{return Math.max(0,Number.parseInt(localStorage.getItem('mara-meteor-count'),10)||0)}catch{return 0}}
function showMeteorCount(){meteorCounter.value=`${meteorCount} ${window.maraT(meteorCount===1?'meteorite':'meteorites')}`}
let wandering=!reduceMotion.matches,gravityOn=false,gravityValue=9.81,meteorClickTimer=null,meteorCount=loadMeteorCount(),last=0,settled=false,previewed=null;
const creatures=[...layer.querySelectorAll('.wander-sticker')].map((element,i)=>{const col=i%3,row=Math.floor(i/3),angle=Math.atan2(row-1,col-1);return {element,x:0,y:0,vx:Math.cos(angle)*(9+i%4),vy:Math.sin(angle)*(9+i%3),angle:0,grounded:false,drag:null,focused:false,thrown:false,index:i}});

function limits(c){const origin=layer.getBoundingClientRect(),contact=document.getElementById('contact').getBoundingClientRect(),tools=document.querySelector('.wander-tools').getBoundingClientRect();const top=Math.max(0,tools.bottom-origin.top+12);return {w:Math.max(0,layer.clientWidth-c.element.offsetWidth),top,h:Math.max(top,contact.top-origin.top-c.element.offsetHeight-16)}}
function clamp(c){const b=limits(c);c.x=Math.max(0,Math.min(b.w,c.x));c.y=Math.max(b.top,Math.min(b.h,c.y))}
function place(c){c.element.style.transform=`translate(${c.x}px,${c.y}px) rotate(${c.angle}deg)`;if(previewed===c)positionPreview(c)}
function arrangeGrid(){const anchor=document.querySelector('.sticker-grid-origin').getBoundingClientRect(),origin=layer.getBoundingClientRect();const cw=anchor.width/3,ch=anchor.height/3,width=Math.floor(cw*.86),height=Math.floor(Math.min(ch*.84,180));creatures.forEach(c=>{const a=Math.atan2(Math.floor(c.index/3)-1,c.index%3-1);c.vx=Math.cos(a)*(12+c.index%4);c.vy=Math.sin(a)*(12+c.index%3);c.element.style.width=width+'px';c.element.style.height=height+'px';c.angle=0;c.grounded=false;c.thrown=false;c.drag=null;c.element.classList.remove('dragging');c.x=anchor.left-origin.left+(c.index%3+.5)*cw-width/2;c.y=anchor.top-origin.top+(Math.floor(c.index/3)+.5)*ch-height/2;clamp(c);place(c)});preview.hidden=true;previewed=null;layer.classList.add('grid-ready')}
function resetGrid(){arrangeGrid();if(gravityOn)creatures.forEach((c,i)=>{c.vx=(i-4)*7;c.vy=-(55+i*8);c.grounded=false});last=0}
document.getElementById('reset-grid').addEventListener('click',resetGrid);

function positionPreview(c){if(preview.hidden)return;const r=c.element.getBoundingClientRect(),box=preview.getBoundingClientRect(),gap=16;let left=r.right+gap;if(left+box.width>innerWidth-12)left=r.left-box.width-gap;left=Math.max(12,Math.min(innerWidth-box.width-12,left));const top=Math.max(78,Math.min(innerHeight-box.height-12,r.top+(r.height-box.height)/2));preview.style.left=left+'px';preview.style.top=top+'px'}
function showPreview(c){const note=photoNotes[c.index];previewed=c;previewTitle.textContent=`mara${c.index+1}.jpeg`;previewImage.src=`assets/mara${c.index+1}.webp`;previewNote.textContent=window.maraT(note.text);if(note.work){previewWorkLink.hidden=false;previewWorkLink.href=`index.html?lang=${encodeURIComponent(document.documentElement.lang)}&locate=artwork-${String(note.work).padStart(2,'0')}#work`;previewWorkLink.textContent=window.maraT(`See artwork ${note.work} →`)}else{previewWorkLink.hidden=true}preview.hidden=false;requestAnimationFrame(()=>positionPreview(c))}
document.getElementById('close-preview').addEventListener('click',()=>{preview.hidden=true;previewed=null});
document.addEventListener('pointerdown',event=>{if(!preview.hidden&&!preview.contains(event.target)&&!event.target.closest('.wander-sticker')){preview.hidden=true;previewed=null}});

function toggleLabel(){toggle.setAttribute('aria-pressed',String(wandering));toggle.textContent=wandering?window.maraT('Pause photos'):window.maraT('Let them wander')}
function updateGravity(){
 document.body.classList.toggle('gravity-mode',gravityOn);gravityControl.hidden=!gravityOn;
 gravityToggle.setAttribute('aria-pressed',String(gravityOn));gravityToggle.textContent=window.maraT(gravityOn?'Turn off gravity':'Turn on gravity');
 meteorButton.hidden=!gravityOn;toggle.disabled=gravityOn;
 if(gravityOn){preview.hidden=true;previewed=null;creatures.forEach((c,i)=>{c.thrown=false;c.vx=(i-4)*8+(i%2?14:-14);c.vy=-(70+i*10);c.angle=(i-4)*1.5;c.grounded=false})}
 else creatures.forEach((c,i)=>{c.thrown=false;const col=i%3,row=Math.floor(i/3),a=Math.atan2(row-1,col-1);c.vx=Math.cos(a)*(9+i%4);c.vy=Math.sin(a)*(9+i%3);c.grounded=false});
}
toggle.addEventListener('click',()=>{wandering=!wandering;toggleLabel()});
gravityToggle.addEventListener('click',()=>{gravityOn=!gravityOn;if(!gravityOn)wandering=!reduceMotion.matches;updateGravity();toggleLabel();last=0});
function updateGravityPreset(){const preset=gravityPresets[Number(gravityInput.value)];gravityValue=preset.value;gravityOutput.value=`${window.maraT(preset.name)} · ${preset.value.toFixed(2)}`;document.body.style.setProperty('--space-a',preset.sky[0]);document.body.style.setProperty('--space-b',preset.sky[1])}
gravityInput.addEventListener('input',updateGravityPreset);
function meteorImpact(impact){
 meteorCount++;showMeteorCount();try{localStorage.setItem('mara-meteor-count',String(meteorCount))}catch{}
 creatures.forEach((c,i)=>{const centre=c.x+c.element.offsetWidth/2,distance=Math.min(1,Math.abs(centre-impact)/(layer.clientWidth*.8));c.vx=(centre-impact)*(.40-distance*.17)+(i%2?15:-15);c.vy=-(82+(1-distance)*115+Math.random()*32);c.angle+=(i%2?1:-1)*(5+Math.random()*9);c.grounded=false});
 document.body.classList.remove('meteor-impact');void document.body.offsetWidth;document.body.classList.add('meteor-impact');setTimeout(()=>document.body.classList.remove('meteor-impact'),240);
}
function launchSingleMeteorite(delay=0){
 setTimeout(()=>{if(!gravityOn)return;
  const layerBox=layer.getBoundingClientRect(),contactBox=document.getElementById('contact').getBoundingClientRect(),meteorWidth=Math.max(110,Math.min(210,innerWidth*.14)),fromLeft=Math.random()>.5;
  const startX=fromLeft?-meteorWidth:layer.clientWidth+meteorWidth,startY=Math.max(0,document.querySelector('.wander-tools').getBoundingClientRect().bottom-layerBox.top-30+Math.random()*90);
  const endX=layer.clientWidth*(.18+Math.random()*.64)-meteorWidth/2,endY=contactBox.top-layerBox.top-meteorWidth*.68;
  const travelAngle=Math.atan2(endY-startY,endX-startX)*180/Math.PI,rotation=travelAngle-135;
  const rock=meteorite.cloneNode(false);rock.removeAttribute('id');rock.hidden=false;rock.style.width=meteorWidth+'px';layer.appendChild(rock);
  const animation=rock.animate([{transform:`translate(${startX}px,${startY}px) rotate(${rotation-8}deg) scale(.55)`,opacity:0},{opacity:1,offset:.12},{transform:`translate(${endX}px,${endY}px) rotate(${rotation}deg) scale(1)`,opacity:1}],{duration:900+Math.random()*350,easing:'cubic-bezier(.45,.02,.82,.42)',fill:'forwards'});
  animation.finished.then(()=>{meteorImpact(endX+meteorWidth*.48);rock.remove()}).catch(()=>rock.remove());
 },delay)
}
function launchMeteorShower(){for(let i=0;i<6;i++)launchSingleMeteorite(i*135)}
meteorButton.addEventListener('click',()=>{clearTimeout(meteorClickTimer);meteorClickTimer=setTimeout(()=>launchSingleMeteorite(),240)});
meteorButton.addEventListener('dblclick',event=>{event.preventDefault();clearTimeout(meteorClickTimer);launchMeteorShower()});
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){wandering=false;toggleLabel()}});

creatures.forEach(c=>{
 c.element.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();c.drag={pageX:event.pageX,pageY:event.pageY,lastX:event.pageX,lastY:event.pageY,lastT:performance.now(),vx:0,vy:0,x:c.x,y:c.y,moved:false};c.element.setPointerCapture(event.pointerId);c.element.classList.add('dragging')});
 c.element.addEventListener('pointermove',event=>{if(!c.drag)return;const now=performance.now(),dx=event.pageX-c.drag.pageX,dy=event.pageY-c.drag.pageY,frame=Math.max(8,now-c.drag.lastT);if(Math.hypot(dx,dy)>5)c.drag.moved=true;c.drag.vx=(event.pageX-c.drag.lastX)/frame*1000;c.drag.vy=(event.pageY-c.drag.lastY)/frame*1000;c.drag.lastX=event.pageX;c.drag.lastY=event.pageY;c.drag.lastT=now;if(!c.drag.moved)return;c.x=c.drag.x+dx;c.y=c.drag.y+dy;clamp(c);place(c)});
 const release=event=>{if(!c.drag)return;const moved=c.drag.moved,throwX=Math.max(-150,Math.min(150,c.drag.vx*.28)),throwY=Math.max(-150,Math.min(150,c.drag.vy*.28));c.drag=null;c.element.classList.remove('dragging');if(c.element.hasPointerCapture(event.pointerId))c.element.releasePointerCapture(event.pointerId);if(moved){c.vx=throwX;c.vy=throwY;c.grounded=false;c.thrown=true}else showPreview(c)};
 c.element.addEventListener('pointerup',release);c.element.addEventListener('pointercancel',release);
 c.element.addEventListener('focus',()=>c.focused=true);c.element.addEventListener('blur',()=>c.focused=false);
 c.element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();showPreview(c);return}const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!direction)return;event.preventDefault();const step=event.shiftKey?30:10;c.x+=direction[0]*step;c.y+=direction[1]*step;clamp(c);place(c)});
});

function resolvePhotoCollisions(){
 for(let pass=0;pass<10;pass++)for(let i=0;i<creatures.length;i++)for(let j=i+1;j<creatures.length;j++){
  const a=creatures[i],b=creatures[j];if(a.drag||b.drag)continue;
  const ar=a.element.getBoundingClientRect(),br=b.element.getBoundingClientRect(),gap=2,aw=ar.width+gap,ah=ar.height+gap,bw=br.width+gap,bh=br.height+gap;
  const dx=b.x+bw/2-(a.x+aw/2),dy=b.y+bh/2-(a.y+ah/2),overlapX=(aw+bw)/2-Math.abs(dx),overlapY=(ah+bh)/2-Math.abs(dy);
  if(overlapX<=0||overlapY<=0)continue;
  if(overlapX<overlapY){const n=dx<0?-1:1,shift=(overlapX+.35)/2;a.x-=n*shift;b.x+=n*shift;const relative=(b.vx-a.vx)*n;if(relative<0){const impulse=-(1+.28)*relative/2;a.vx-=impulse*n;b.vx+=impulse*n}}
  else{const n=dy<0?-1:1,depth=overlapY+.35;if(a.grounded&&!b.grounded)b.y+=n*depth;else if(b.grounded&&!a.grounded)a.y-=n*depth;else{a.y-=n*depth/2;b.y+=n*depth/2}const relative=(b.vy-a.vy)*n;if(relative<0){const impulse=-(1+.18)*relative/2;a.vy-=impulse*n;b.vy+=impulse*n}}
  clamp(a);clamp(b);
 }
}
function drift(now){
 const dt=last?Math.min((now-last)/1000,.04):0;last=now;
 if(settled&&!document.hidden){
  if(gravityOn){
   creatures.forEach(c=>{if(c.drag)return;const b=limits(c);
    if(c.grounded){c.y=b.h;c.vy=0;c.vx*=Math.pow(.11,dt);if(Math.abs(c.vx)<.35)c.vx=0}
    else{c.vy+=gravityValue*38*dt;c.vx*=Math.pow(.48,dt);c.x+=c.vx*dt;c.y+=c.vy*dt;c.angle+=c.vx*.008*dt}
    if(c.x<=0||c.x>=b.w){c.vx*=-.62;c.x=Math.max(0,Math.min(b.w,c.x))}
    if(c.y>=b.h){c.y=b.h;const rebound=Math.abs(c.vy)*.34;c.vx*=.82;if(rebound<28){c.vy=0;c.grounded=true}else c.vy=-rebound;c.angle+=c.vx*.012}
    else if(c.y<=b.top){c.y=b.top;c.vy=Math.abs(c.vy)*.58}
   });
   resolvePhotoCollisions();creatures.forEach(c=>{clamp(c);place(c)});
  }else creatures.forEach(c=>{if(c.drag)return;c.angle+=(0-c.angle)*Math.min(1,dt*.85);if(wandering&&!c.focused&&previewed!==c){const b=limits(c);if(c.thrown){const brake=Math.pow(.025,dt);c.vx*=brake;c.vy*=brake;if(Math.hypot(c.vx,c.vy)<13)c.thrown=false}c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.x<=0||c.x>=b.w)c.vx*=-1;if(c.y<=b.top||c.y>=b.h)c.vy*=-1;clamp(c)}place(c)})
 }
 requestAnimationFrame(drift)
}
new ResizeObserver(()=>{if(!settled)arrangeGrid();else creatures.forEach(c=>{clamp(c);place(c)})}).observe(layer);
updateGravityPreset();showMeteorCount();updateGravity();toggleLabel();document.fonts.ready.then(()=>requestAnimationFrame(()=>{resetGrid();settled=true;requestAnimationFrame(drift)}));
