'use strict';

// Descriptive working labels, not official artwork titles. Edit these as the portfolio grows.
const artworks = window.MARA_ARTWORKS || [
  {id:'parrots',label:'A pair of parrots',alt:'Two vivid red, blue and green parrots in flight on an ochre background',tags:['creatures','colour'],width:1600,height:1043},
  {id:'purple-chess',label:'Purple moves',alt:'Two purple chess pieces painted with broad violet and pink brushstrokes',tags:['colour'],width:1121,height:1600},
  {id:'comet',label:'Somewhere out there',alt:'A bright multicoloured comet streaking across a deep blue background',tags:['colour','elsewhere'],width:1600,height:1000},
  {id:'turtle',label:'Taking it slow',alt:'A turtle illustrated in green, blue and purple on a pale background',tags:['creatures','colour'],width:438,height:302},
  {id:'blue-world',label:'Another little world',alt:'A blue mountain landscape with trees, birds, a red sun and unexpected details',tags:['elsewhere','colour'],width:328,height:506},
  {id:'striped-cat',label:'Very good company',alt:'A person holding a striped orange cat against a pink background',tags:['creatures','colour'],width:1458,height:928},
  {id:'colourful-interior',label:'A place to stay',alt:'An interior drawn with bright yellow, turquoise, pink and purple lines',tags:['colour','elsewhere'],width:314,height:466},
  {id:'white-duck',label:'One little duck',alt:'A white duck painted against a dark background with sweeping white marks',tags:['creatures','quiet'],width:1173,height:1600},
  {id:'sailboat',label:'Out of office',alt:'A sailboat with pink sails surrounded by green trees and pastel brushstrokes',tags:['elsewhere','colour'],width:536,height:260},
  {id:'forest',label:'Getting a little lost',alt:'An expressive forest painting with layered green, purple, turquoise and orange marks',tags:['elsewhere','colour'],width:280,height:390},
  {id:'botanical-notebook',label:'Something growing',alt:'A hand holding a green notebook decorated with a dark botanical illustration',tags:['quiet'],width:900,height:1600},
  {id:'earth-study',label:'Earthy things',alt:'An abstract composition of dark brown, rust, pink and black brushstrokes',tags:['quiet'],width:1600,height:1180},
  {id:'warm-study',label:'A warmer moment',alt:'A warm red and yellow painted study photographed in the studio',tags:['colour'],width:900,height:1600},
  {id:'ink-study',label:'Ink, again',alt:'A black ink study of repeated organic shapes and marks on light paper',tags:['quiet'],width:1165,height:1600}
];

if(window.maraT)artworks.forEach(art=>{art.label=window.maraT(art.label);art.alt=window.maraT(art.alt);if(art.description)art.description=window.maraT(art.description)});

for (const element of document.querySelectorAll('[data-year]')) element.textContent = new Date().getFullYear();
const gallery = document.querySelector('#gallery');
const count = document.querySelector('#work-count');
let currentFilter = 'all';
let visibleArt = artworks;
const kindGroups = [
  {key:'true-life',label:'(A bit) true to life',orders:[2,5,9,11,12,14,18,21,27,29,30,31,33]},
  {key:'illustrative',label:'Illustrative / my way',orders:[1,3,6,10,13,15,16,17,19,8,20,23,24,25,26,28,32,34,35]},
  {key:'abstract',label:'Abstract',orders:[4,7,22]},
  {key:'other',label:'Other',orders:[]}
];
const kindByOrder = new Map(kindGroups.flatMap(group=>group.orders.map(order=>[order,group.key])));
artworks.forEach(art=>{art.kind=kindByOrder.get(art.order)||'other';art.description=art.description||''});

if (gallery) {
  const fragment = document.createDocumentFragment();
  artworks.forEach((art,index) => {
    const card = document.createElement('figure');
    card.className = `art-card ${art.width > art.height ? 'landscape' : art.height > art.width ? 'portrait' : 'square'}`; card.dataset.id = art.id;
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.art = art.id;
    button.setAttribute('aria-label',`${window.maraT?window.maraT('View full image: '):'View full image: '}${art.label}`);
    const img = document.createElement('img');
    img.src = `assets/${art.id}.webp`; img.alt = art.alt;
    img.width = art.width; img.height = art.height;
    img.loading = index < 4 ? 'eager' : 'lazy'; img.decoding = 'async';
    button.append(img);
    const caption = document.createElement('figcaption');
    const title = document.createElement('span'); title.textContent = art.label;
    const number = document.createElement('span'); number.textContent = String(index+1).padStart(2,'0');
    const description = document.createElement('p');description.className='art-description';description.textContent=art.description;
    const enquiry = document.createElement('a');enquiry.className='art-enquiry';enquiry.href='about.html#contact';enquiry.textContent=window.maraT?window.maraT('Like what you see? Contact me →'):'Like what you see? Contact me →';
    caption.append(title,number,description,enquiry);card.append(button,caption);fragment.append(card);
  });
  gallery.append(fragment);
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      visibleArt = artworks.filter(art => currentFilter === 'all' || art.tags.includes(currentFilter));
      document.querySelectorAll('[data-filter]').forEach(other => other.setAttribute('aria-pressed',String(other === button)));
      gallery.querySelectorAll('.art-card').forEach(card => { card.hidden = !visibleArt.some(art => art.id === card.dataset.id); });
      count.textContent = window.maraT?window.maraT(`${visibleArt.length} things to look at`):`${visibleArt.length} things to look at`;
    });
  });
  count.textContent = window.maraT?window.maraT(`${artworks.length} things to look at`):`${artworks.length} things to look at`;
  const locateId=new URLSearchParams(location.search).get('locate');
  if(locateId)requestAnimationFrame(()=>{const target=gallery.querySelector(`[data-id="${CSS.escape(locateId)}"]`);if(!target)return;target.classList.add('located');target.scrollIntoView({behavior:'smooth',block:'center'});target.querySelector('button')?.focus({preventScroll:true});setTimeout(()=>target.classList.remove('located'),3500)});
}

const viewer = document.querySelector('#art-viewer');
let viewerIndex = 0;
let viewerList = artworks;
let lastTrigger = null;
function paintViewer() {
  const art = viewerList[viewerIndex];
  const img = document.querySelector('#viewer-image');
  img.src = `assets/${art.id}.webp`; img.alt = art.alt;
  document.querySelector('#viewer-title').textContent = art.label;
  document.querySelector('#viewer-counter').textContent = `${viewerIndex+1} / ${viewerList.length}`;
  const description=document.querySelector('#viewer-description');description.textContent=art.description;const sameAsTitle=art.description.replace(/[.!?]+$/,'').trim().toLowerCase()===art.label.replace(/[.!?]+$/,'').trim().toLowerCase();description.hidden=!art.description||sameAsTitle;
  document.querySelector('#viewer-enquiry').href = 'about.html#contact';
}
function openArtwork(id, trigger) {
  if (!viewer) return;
  viewerList = gallery ? visibleArt : artworks;
  viewerIndex = viewerList.findIndex(art=>art.id===id);
  if (viewerIndex < 0) return;
  lastTrigger = trigger;
  paintViewer();
  viewer.showModal();
  document.body.classList.add('modal-open');
}
if (viewer) {
  document.querySelector('.viewer-close').addEventListener('click',()=>viewer.close());
  viewer.addEventListener('close',()=>{
    document.body.classList.remove('modal-open');
    lastTrigger?.focus({preventScroll:true});
  });
  viewer.addEventListener('click',event=>{
    if (event.target !== viewer) return;
    const rect=viewer.getBoundingClientRect();
    if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) viewer.close();
  });
  const step = delta => {viewerIndex=(viewerIndex+delta+viewerList.length)%viewerList.length;paintViewer();};
  document.querySelector('#previous-art').addEventListener('click',()=>step(-1));
  document.querySelector('#next-art').addEventListener('click',()=>step(1));
  viewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}
    if(event.key==='ArrowRight'){event.preventDefault();step(1);}
  });
}

document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-art]');
  if(!trigger) return;
  if(trigger.dataset.suppressClick==='true'){event.preventDefault();return;}
  openArtwork(trigger.dataset.art,trigger);
});

const wall=document.querySelector('#studio-wall');
if(wall){
  const pieces=[...wall.querySelectorAll('.wall-piece')];
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const toggle=document.querySelector('#motion-toggle');
  const status=document.querySelector('#wall-status');
  let breeze=!reducedMotion.matches, zIndex=42, active=null, frame=0, previousTime=0;
  const positions=new Map(pieces.map(piece=>[piece,{x:0,y:0}]));
  const sheets=[...wall.querySelectorAll('.wind-sheet, .wall-piece')].map((node,i)=>({node,paper:node.querySelector('.paper'),energy:0,phase:i*.7}));
  let pointer={x:0,y:0,time:0};
  const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
  function animate(time){
    const dt=Math.min((time-previousTime)/16.67||1,3);previousTime=time;
    let alive=false;
    for(const sheet of sheets){
      sheet.energy*=Math.pow(.965,dt);
      if(sheet.energy<.01){sheet.paper.style.transform='';continue;}
      alive=true;
      const e=sheet.energy,t=time/1000;
      const flutter=Math.sin(t*8+sheet.phase)*e;
      const turn=Math.sin(t*5.5+sheet.phase)*e;
      sheet.paper.style.transform=`perspective(900px) rotateX(${e*-17+flutter*9}deg) rotateY(${turn*12}deg) rotateZ(${flutter*1.2}deg) translateY(${flutter*-3}px)`;
    }
    frame=alive&&breeze&&!reducedMotion.matches?requestAnimationFrame(animate):0;
  }
  function start(){if(!frame&&breeze&&!reducedMotion.matches)frame=requestAnimationFrame(animate);}
  function gust(x,y,strength){
    if(!breeze||reducedMotion.matches)return;
    sheets.forEach(s=>{const r=s.node.getBoundingClientRect();const distance=Math.hypot(x-r.left-r.width/2,y-r.top-r.height/2);const reach=500;const influence=Math.max(0,1-distance/reach);s.energy=Math.min(1.6,Math.max(s.energy,influence*strength));});start();
  }
  function clearWind(){cancelAnimationFrame(frame);frame=0;sheets.forEach(s=>{s.energy=0;s.paper.style.transform='';});}
  function updateMotion(){toggle.textContent=breeze?'Wind on':'Wind off';toggle.setAttribute('aria-pressed',String(breeze));if(!breeze)clearWind();}
  updateMotion();reducedMotion.addEventListener('change',()=>{breeze=!reducedMotion.matches;updateMotion();});
  toggle.addEventListener('click',()=>{breeze=!breeze;updateMotion();if(breeze){const r=wall.getBoundingClientRect();gust(r.left+r.width/2,r.top+r.height/2,1.5);}});
  wall.addEventListener('pointermove',event=>{
    if(active)return;
    const now=performance.now();const speed=Math.hypot(event.clientX-pointer.x,event.clientY-pointer.y)/Math.max(16,now-pointer.time);
    gust(event.clientX,event.clientY,clamp(.55+speed*.5,.55,1.5));pointer={x:event.clientX,y:event.clientY,time:now};
  });
  function setPosition(piece,x,y){positions.set(piece,{x,y});piece.style.setProperty('--drag-x',`${x}px`);piece.style.setProperty('--drag-y',`${y}px`);}
  pieces.forEach(piece=>{
    piece.addEventListener('dragstart',e=>e.preventDefault());
    piece.addEventListener('pointerdown',event=>{
      if(event.button!==0||active)return;
      const pos=positions.get(piece),r=piece.getBoundingClientRect(),bounds=wall.getBoundingClientRect();
      active={piece,id:event.pointerId,startX:event.clientX,startY:event.clientY,x:pos.x,y:pos.y,moved:false,minX:pos.x+bounds.left-r.left-r.width*.25,maxX:pos.x+bounds.right-r.right+r.width*.25,minY:pos.y+bounds.top-r.top-r.height*.25,maxY:pos.y+bounds.bottom-r.bottom+r.height*.25};
      piece.setPointerCapture(event.pointerId);
    });
    piece.addEventListener('pointermove',event=>{
      if(!active||active.piece!==piece||active.id!==event.pointerId)return;
      const dx=event.clientX-active.startX,dy=event.clientY-active.startY;
      if(Math.hypot(dx,dy)>5){active.moved=true;piece.classList.add('dragging');piece.style.zIndex=String(zIndex++);}
      if(active.moved){event.preventDefault();setPosition(piece,clamp(active.x+dx,active.minX,active.maxX),clamp(active.y+dy,active.minY,active.maxY));}
    });
    function finish(event){
      if(!active||active.piece!==piece||active.id!==event.pointerId)return;
      const moved=active.moved;piece.classList.remove('dragging');piece.dataset.suppressClick=String(moved);
      if(piece.hasPointerCapture(event.pointerId))piece.releasePointerCapture(event.pointerId);active=null;
      if(moved){status.textContent='Collage rearranged.';gust(event.clientX,event.clientY,1);}
      setTimeout(()=>{piece.dataset.suppressClick='false';},0);
    }
    piece.addEventListener('pointerup',finish);piece.addEventListener('pointercancel',finish);
    piece.addEventListener('keydown',event=>{
      const moves={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]};if(!moves[event.key])return;
      event.preventDefault();const pos=positions.get(piece),delta=moves[event.key];setPosition(piece,clamp(pos.x+delta[0],-wall.clientWidth*.35,wall.clientWidth*.35),clamp(pos.y+delta[1],-wall.clientHeight*.35,wall.clientHeight*.35));
    });
  });
  document.querySelector('#reset-wall').addEventListener('click',()=>{pieces.forEach(p=>{setPosition(p,0,0);p.style.removeProperty('z-index');});clearWind();status.textContent='Collage reset.';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearWind();});
}

const copy=document.querySelector('#copy-email');
if(copy)copy.addEventListener('click',async()=>{
  const message=document.querySelector('#contact-feedback');
  try{
    await navigator.clipboard.writeText('mejgbrandsen@gmail.com');
    message.textContent='Email address copied. Say hello when you’re ready.';
    copy.textContent='Copied ✓';
    setTimeout(()=>{copy.textContent='Copy email';},2500);
  }catch{
    message.textContent='You can copy the address above: mejgbrandsen@gmail.com';
  }
});
