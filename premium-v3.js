/** AL HASM V3 — progressive enhancement; forms and maps work without this script. */
(()=>{'use strict';
const whenReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();
whenReady(()=>{
 const box=document.getElementById('ajax-property-results');
 const form=document.getElementById('alhasm-search-form');
 const locale=document.body.dataset.locale;
 const arabic=locale==='ar';
 const showFeedback=text=>{let n=document.getElementById('v3-notice');if(!n){n=document.createElement('div');n.id='v3-notice';n.setAttribute('role','status');document.body.append(n);}n.textContent=text;n.classList.add('on');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('on'),2500)};
 let controller=null, map=null, pinLayer=null, moving=false;
 function read(key){try{return JSON.parse(localStorage.getItem(key)||'[]').map(String)}catch{return []}}
 function write(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch{}}
 const savedKey='alhasm_saved_v1',compareKey='alhasm_compare_v2';
 const savedURL=document.body.dataset.savedBase,compareURL=document.body.dataset.compareBase;
 function linkWithIds(base,items){return base+(items.length?'?ids='+encodeURIComponent(items.join(',')):'')}
 function updateCardStates(){
  const saved=read(savedKey),compare=read(compareKey);
  document.querySelectorAll('[data-favorite]').forEach(b=>{const yes=saved.includes(b.dataset.favorite);b.textContent=yes?'♥':'♡';b.classList.toggle('is-saved',yes);b.setAttribute('aria-pressed',String(yes))});
  document.querySelectorAll('[data-compare]').forEach(b=>{const yes=compare.includes(b.dataset.compare);b.classList.toggle('is-compared',yes);b.setAttribute('aria-pressed',String(yes))});
  document.querySelectorAll('[data-saved-count]').forEach(b=>b.textContent=saved.length);
  document.querySelectorAll('[data-compare-count],[data-tray-count]').forEach(b=>b.textContent=compare.length);
  document.querySelectorAll('[data-saved-link]').forEach(b=>b.href=linkWithIds(savedURL,saved));
  document.querySelectorAll('[data-compare-link]').forEach(b=>b.href=linkWithIds(compareURL,compare));
  const tray=document.getElementById('compare-tray');if(tray)tray.hidden=compare.length===0;
 }
 // Dynamically inserted results do not have V1/V2 event listeners; bind only inside the AJAX fragment.
 function bindNewCards(){if(!box)return;
  box.querySelectorAll('[data-favorite]').forEach(b=>b.addEventListener('click',()=>{const set=read(savedKey),id=b.dataset.favorite;write(savedKey,set.includes(id)?set.filter(v=>v!==id):[...set,id]);updateCardStates();showFeedback(arabic?'تم تحديث المفضلة':'Saved properties updated')}));
  box.querySelectorAll('[data-compare]').forEach(b=>b.addEventListener('click',()=>{const set=read(compareKey),id=b.dataset.compare;if(!set.includes(id)&&set.length>=3){showFeedback(arabic?'الحد الأقصى ثلاثة عقارات':'Compare up to three properties');return}write(compareKey,set.includes(id)?set.filter(v=>v!==id):[...set,id]);updateCardStates();showFeedback(arabic?'تم تحديث المقارنة':'Comparison updated')}));
  box.querySelectorAll('[data-quick-view]').forEach(btn=>btn.addEventListener('click',()=>{const modal=document.getElementById('quick-view-dialog');if(!modal?.showModal){location.assign(btn.dataset.href);return}
   const set=(id,value)=>{let target=document.getElementById(id);if(target)target.textContent=value};
   set('quick-dialog-title',btn.dataset.name);set('quick-dialog-price',btn.dataset.price);set('quick-dialog-location',btn.dataset.location);
   set('quick-dialog-facts',`${btn.dataset.beds} beds · ${btn.dataset.baths} bathrooms · ${btn.dataset.size}`);
   const img=document.getElementById('quick-dialog-img');img.src=btn.dataset.image;img.alt=btn.dataset.name;document.getElementById('quick-dialog-link').href=btn.dataset.href;modal.showModal();}));
 }
 async function updateResults(url,push=true){
  if(!box)return;
  controller?.abort();controller=new AbortController();
  box.classList.add('v3-loading');box.setAttribute('aria-busy','true');
  try{let parsed=new URL(url,location.href);const endpoint=new URL(box.dataset.asyncUrl,location.origin);endpoint.search=parsed.search;
   const response=await fetch(endpoint,{headers:{'Accept':'application/json','X-Requested-With':'XMLHttpRequest'},signal:controller.signal,credentials:'same-origin'});
   if(!response.ok)throw Error('Fetch failed');const data=await response.json();
   box.innerHTML=data.html;const count=document.getElementById('search-result-count');if(count)count.textContent=Number(data.count).toLocaleString();
   if(push)history.pushState({filtered:true},'',data.url);
   bindNewCards();updateCardStates();refreshPins();
   const grid=document.getElementById('result-grid');if(document.getElementById('list-mode')?.classList.contains('active'))grid?.classList.add('list-view');
   grid?.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
  }catch(e){if(e.name!=='AbortError'){showFeedback(arabic?'تعذر تحديث النتائج، أعد المحاولة':'Could not update results. Try again.');}}
  finally{box.classList.remove('v3-loading');box.setAttribute('aria-busy','false');}
 }
 if(box&&form){form.addEventListener('submit',e=>{e.preventDefault();const params=new URLSearchParams(new FormData(form));params.forEach((val,key)=>{if(!val.trim())params.delete(key)});updateResults(form.action+'?'+params.toString());});
  box.addEventListener('click',e=>{const a=e.target.closest('.pagination-custom a[href]');if(!a||e.ctrlKey||e.metaKey)return;e.preventDefault();updateResults(a.href);});
  const sort=document.querySelector('.listing-sort select[name="sort"]');if(sort){sort.removeAttribute('onchange');sort.addEventListener('change',()=>{const url=new URL(location.href);if(sort.value)url.searchParams.set('sort',sort.value);else url.searchParams.delete('sort');url.searchParams.delete('page');updateResults(url.href)})}
  document.querySelectorAll('.filter-chips a').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey)return;e.preventDefault();document.querySelectorAll('.filter-chips a').forEach(x=>x.classList.toggle('selected',x===a));updateResults(a.href)}));
  window.addEventListener('popstate',()=>location.reload());
 }
 // Leaflet loads only if visitor reaches the map and a network connection is available.
 function loadLeaflet(){return new Promise((resolve,reject)=>{if(window.L)return resolve(window.L);const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.crossOrigin='anonymous';s.integrity='sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';s.onload=()=>resolve(window.L);s.onerror=reject;document.head.appendChild(s)})}
 function refreshPins(){if(!map||!pinLayer)return;pinLayer.clearLayers();document.querySelectorAll('#result-grid .property-card[data-lat][data-lng]').forEach(el=>{const lat=Number(el.dataset.lat),lon=Number(el.dataset.lng);if(!lat||!lon)return;
  const url=el.dataset.propertyUrl,title=el.dataset.propertyTitle;const p=window.L.marker([lat,lon]).addTo(pinLayer);const a=document.createElement('a');a.href=url;a.textContent=title;
  const wrap=document.createElement('div');wrap.className='v3-map-popup';wrap.append(a);p.bindPopup(wrap);
 });}
 const mapElement=document.getElementById('v3-map');if(mapElement){const io=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting))return;io.disconnect();
  try{await loadLeaflet();mapElement.replaceChildren();map=window.L.map(mapElement,{scrollWheelZoom:false}).setView([25.155,55.270],10);
   window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
   pinLayer=window.L.layerGroup().addTo(map);refreshPins();
   const boundsCheck=document.getElementById('search-as-map-moves');let debounce;
   map.on('moveend',()=>{if(!boundsCheck?.checked||moving)return;clearTimeout(debounce);debounce=setTimeout(()=>{let b=map.getBounds();let url=new URL(location.href);url.searchParams.set('bounds',[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].map(n=>n.toFixed(5)).join(','));url.searchParams.delete('page');updateResults(url.href)},450)});
   document.getElementById('clear-map-area')?.addEventListener('click',()=>{if(boundsCheck)boundsCheck.checked=false;const url=new URL(location.href);url.searchParams.delete('bounds');updateResults(url.href);map.setView([25.155,55.270],10)});
  }catch(e){/* Offline/blocked CDN: original OpenStreetMap iframe stays accessible. */}
 },{rootMargin:'200px'});io.observe(mapElement);}
 // Enhance property card layout, language direction, and keyboard-friendly mobile nav.
 document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.decoding='async');
 const menu=document.getElementById('primary-nav');menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');document.getElementById('mobile-toggle')?.setAttribute('aria-expanded','false')}));
 updateCardStates();
});
})();
