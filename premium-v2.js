(()=>{'use strict';
const onReady=cb=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',cb):cb();
onReady(()=>{
 const all=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
 const one=(selector,root=document)=>root.querySelector(selector);
 const root=document.body,arabic=root.dataset.locale==='ar';
 const savedKey='alhasm_saved_v1',compareKey='alhasm_compare_v2';
 const fromStorage=(key)=>{try{const raw=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(raw)?[...new Set(raw.map(v=>String(v)).filter(v=>/^\d{1,10}$/.test(v)))]:[]}catch{return []}};
 const putStorage=(key,ids)=>{try{localStorage.setItem(key,JSON.stringify(ids))}catch{}};
 const savedBase=root.dataset.savedBase||'saved.html',compareBase=root.dataset.compareBase||'compare.html';
 const withIds=(base,arr)=>arr.length?`${base}${base.includes('?')?'&':'?'}ids=${encodeURIComponent(arr.join(','))}`:base;
 const feedback=(text)=>{let popup=one('.v2-feedback');if(!popup){popup=document.createElement('div');popup.className='v2-feedback';popup.setAttribute('role','status');document.body.appendChild(popup)}popup.textContent=text;popup.classList.add('visible');clearTimeout(popup._timer);popup._timer=setTimeout(()=>popup.classList.remove('visible'),2600)};
 const updateCollections=()=>{
  const saved=fromStorage(savedKey),comp=fromStorage(compareKey);
  all('[data-saved-count]').forEach(el=>el.textContent=saved.length);
  all('[data-compare-count],[data-tray-count]').forEach(el=>el.textContent=comp.length);
  all('[data-saved-link]').forEach(el=>el.href=withIds(savedBase,saved));
  all('[data-compare-link]').forEach(el=>el.href=withIds(compareBase,comp));
  all('[data-compare]').forEach(el=>{const active=comp.includes(String(el.dataset.compare));el.classList.toggle('is-compared',active);el.setAttribute('aria-pressed',String(active))});
  const tray=one('#compare-tray');if(tray)tray.hidden=comp.length===0;
 };
 // A visit to Saved/Compare without a query loads the browser-local selection.
 const isSavedPage=/\/(saved)(?:\.html)?\/?$/.test(location.pathname);
 const isComparePage=/\/(compare)(?:\.html)?\/?$/.test(location.pathname);
 const params=new URLSearchParams(location.search);
 if((isSavedPage||isComparePage)&&!params.has('ids')){
  const ids=fromStorage(isSavedPage?savedKey:compareKey);
  if(ids.length) location.replace(withIds(location.pathname,ids.slice(0,isComparePage?3:100)));
 }
 all('[data-compare]').forEach(el=>el.addEventListener('click',()=>{
  const id=String(el.dataset.compare),was=fromStorage(compareKey);let next;
  if(was.includes(id)){next=was.filter(v=>v!==id);feedback(arabic?'تمت إزالة العقار من المقارنة':'Removed from comparison')}
  else if(was.length>=3){feedback(arabic?'يمكن مقارنة ثلاثة عقارات فقط':'Compare up to three properties');return}
  else{next=[...was,id];feedback(arabic?'تمت إضافة العقار للمقارنة':'Property added to compare')}
  putStorage(compareKey,next);updateCollections();
  if(isComparePage)location.assign(withIds(compareBase,next));
 }));
 const clear=one('#clear-comparison');clear?.addEventListener('click',()=>{putStorage(compareKey,[]);updateCollections();feedback(arabic?'تم مسح المقارنة':'Comparison cleared');if(isComparePage)location.assign(compareBase)});
 // The original website manages the heart state. React to its clicks to sync the header.
 all('[data-favorite]').forEach(btn=>btn.addEventListener('click',()=>{queueMicrotask(()=>{
   updateCollections();feedback(btn.classList.contains('is-saved')?(arabic?'تم الحفظ في المفضلة':'Saved to your collection'):(arabic?'تمت الإزالة من المفضلة':'Removed from saved homes'));
   if(isSavedPage)location.assign(withIds(savedBase,fromStorage(savedKey)));
 })}));
 updateCollections();
 // Quick-view native modal; keyboard Escape and backdrop click are supported.
 const dialog=one('#quick-view-dialog'),close=one('#quick-dialog-close');
 all('[data-quick-view]').forEach(btn=>btn.addEventListener('click',()=>{
  if(!dialog||typeof dialog.showModal!=='function'){location.assign(btn.dataset.href);return}
  const set=(id,value)=>{const el=one(id);if(el)el.textContent=value};
  set('#quick-dialog-title',btn.dataset.name);set('#quick-dialog-price',btn.dataset.price);set('#quick-dialog-location',btn.dataset.location);
  set('#quick-dialog-facts',`${btn.dataset.beds} ${arabic?'غرف':'beds'} · ${btn.dataset.baths} ${arabic?'حمامات':'baths'} · ${btn.dataset.size}`);
  const image=one('#quick-dialog-img');image.src=btn.dataset.image;image.alt=btn.dataset.name;
  one('#quick-dialog-link').href=btn.dataset.href;dialog.showModal();
 }));
 close?.addEventListener('click',()=>dialog?.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 // Scroll reading indicator. No user tracking and no network requests.
 const progress=one('#reading-progress');let scheduled=false;
 const updateProgress=()=>{const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(progress)progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/max))})`;scheduled=false};
 addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(updateProgress);scheduled=true}},{passive:true});updateProgress();
 // Upgrade the hero with subtle pointer parallax; never animate for reduced-motion users.
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hero=one('.hero-home');if(hero&&!reduce&&matchMedia('(min-width: 1100px)').matches){
  let fx=0,fy=0,ticking=false;hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();fx=(event.clientX-rect.left)/rect.width-.5;fy=(event.clientY-rect.top)/rect.height-.5;if(!ticking){ticking=true;requestAnimationFrame(()=>{hero.style.setProperty('--hero-shift-x',`${fx*22}px`);hero.style.setProperty('--hero-shift-y',`${fy*12}px`);ticking=false})}},{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--hero-shift-x','0px');hero.style.setProperty('--hero-shift-y','0px')});
 }
 // Reveal success notices after they appear and keep forms from accidental double-submit.
 all('form:not(.lead-workflow-form)').forEach(form=>form.addEventListener('submit',()=>{const submit=one('button[type="submit"]',form);if(submit){submit.disabled=true;submit.classList.add('is-loading');setTimeout(()=>{submit.disabled=false;submit.classList.remove('is-loading')},3000)}}));
 // Let users browse full screen images without a third-party viewer.
 const detailPhoto=one('#detail-main-img');if(detailPhoto){detailPhoto.setAttribute('tabindex','0');detailPhoto.setAttribute('title',arabic?'اضغط لتكبير الصورة':'Click to expand image');
  const zoom=()=>{const big=document.createElement('dialog');big.className='image-lightbox';const pic=document.createElement('img');pic.src=detailPhoto.src;pic.alt=detailPhoto.alt;const btn=document.createElement('button');btn.type='button';btn.textContent='×';btn.setAttribute('aria-label','Close gallery');btn.onclick=()=>big.close();big.append(btn,pic);big.addEventListener('close',()=>big.remove());big.addEventListener('click',e=>{if(e.target===big)big.close()});document.body.appendChild(big);big.showModal()};
  detailPhoto.addEventListener('click',zoom);detailPhoto.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();zoom()}});
 }
 // Gallery keyboard support.
 const gallery=one('.detail-gallery');gallery?.setAttribute('tabindex','0');gallery?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();one(`[data-gallery-step="${e.key==='ArrowRight'?1:-1}"]`)?.click()}});
});})();
