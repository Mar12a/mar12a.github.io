document.getElementById('copy-email').addEventListener('click',async()=>{const feedback=document.getElementById('contact-feedback');try{await navigator.clipboard.writeText('mejgbrandsen@gmail.com');feedback.textContent=window.maraT('Email address copied.')}catch{feedback.textContent=window.maraT('You can select the email address above to copy it.')}});

const layer=document.querySelector('.wander-layer'),toggle=document.getElementById('wander-toggle'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let wandering=!reduceMotion.matches,last=0;
let settled=false,startedAt=0;
const creatures=[...layer.querySelectorAll('.wander-sticker')].map((element,i)=>{
 const col=i%3,row=Math.floor(i/3),angle=Math.atan2(row-1,col-1);
 return {element,x:0,y:0,vx:Math.cos(angle)*(9+i%4),vy:Math.sin(angle)*(9+i%3),angle:0,drag:null,focused:false,index:i};
});
function arrangeGrid(){
 const anchor=document.querySelector('.sticker-grid-origin').getBoundingClientRect(),origin=layer.getBoundingClientRect();
 const cw=anchor.width/3,ch=anchor.height/3,width=Math.floor(cw*.86),height=Math.floor(Math.min(ch*.84,180));
 creatures.forEach(c=>{
  const a=Math.atan2(Math.floor(c.index/3)-1,c.index%3-1);c.vx=Math.cos(a)*(12+c.index%4);c.vy=Math.sin(a)*(12+c.index%3);
  c.element.style.width=width+'px';c.element.style.height=height+'px';c.angle=0;c.drag=null;c.element.classList.remove('dragging');
  c.x=anchor.left-origin.left+(c.index%3+.5)*cw-width/2;
  c.y=anchor.top-origin.top+(Math.floor(c.index/3)+.5)*ch-height/2;
  clamp(c);place(c);
 });
 layer.classList.add('grid-ready');
}
function resetGrid(){arrangeGrid();startedAt=performance.now();last=0}
document.getElementById('reset-grid').addEventListener('click',resetGrid);

function limits(c){
 const origin=layer.getBoundingClientRect(),contact=document.getElementById('contact').getBoundingClientRect(),tools=document.querySelector('.wander-tools').getBoundingClientRect();
 const top=Math.max(0,tools.bottom-origin.top+12);
 return {w:Math.max(0,layer.clientWidth-c.element.offsetWidth),top,h:Math.max(top,contact.top-origin.top-c.element.offsetHeight-16)};
}
function clamp(c){const b=limits(c);c.x=Math.max(0,Math.min(b.w,c.x));c.y=Math.max(b.top,Math.min(b.h,c.y))}
function place(c){c.element.style.transform=`translate(${c.x}px,${c.y}px) rotate(${c.angle}deg)`}
function toggleLabel(){toggle.setAttribute('aria-pressed',String(wandering));toggle.textContent=wandering?window.maraT('Pause photos'):window.maraT('Let them wander')}
toggle.addEventListener('click',()=>{wandering=!wandering;toggleLabel()});
reduceMotion.addEventListener('change',()=>{if(reduceMotion.matches){wandering=false;toggleLabel()}});
creatures.forEach(c=>{

 c.element.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();c.drag={x:e.pageX,y:e.pageY,startX:c.x,startY:c.y};c.element.setPointerCapture(e.pointerId);c.element.classList.add('dragging')});
 c.element.addEventListener('pointermove',e=>{if(!c.drag)return;c.x=c.drag.startX+e.pageX-c.drag.x;c.y=c.drag.startY+e.pageY-c.drag.y;clamp(c);place(c)});
 const release=()=>{c.drag=null;c.element.classList.remove('dragging')};
 c.element.addEventListener('pointerup',release);c.element.addEventListener('pointercancel',release);c.element.addEventListener('lostpointercapture',release);
 c.element.addEventListener('focus',()=>c.focused=true);c.element.addEventListener('blur',()=>c.focused=false);
 c.element.addEventListener('keydown',e=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!d)return;e.preventDefault();const step=e.shiftKey?30:10;c.x+=d[0]*step;c.y+=d[1]*step;clamp(c);place(c)});
});
function drift(now){const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(settled&&wandering&&!document.hidden)creatures.forEach(c=>{if(c.drag||c.focused)return;const b=limits(c);c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.x<0||c.x>b.w)c.vx*=-1;if(c.y<b.top||c.y>b.h)c.vy*=-1;clamp(c);place(c)});requestAnimationFrame(drift)}
new ResizeObserver(()=>{if(!settled)arrangeGrid();else creatures.forEach(c=>{clamp(c);place(c)})}).observe(layer);
toggleLabel();document.fonts.ready.then(()=>requestAnimationFrame(()=>{resetGrid();settled=true;requestAnimationFrame(drift)}));
