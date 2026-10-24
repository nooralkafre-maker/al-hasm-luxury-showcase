(()=>{'use strict';
const dlg=document.getElementById('v4-video-dialog'),zone=document.getElementById('v4-video-container'),title=document.getElementById('v4-video-title'),notice=document.getElementById('v4-video-disclosure');
if(!dlg||!zone)return;
function source(raw){try{const u=new URL(raw,window.location.origin);if(u.protocol!=='https:'&&u.protocol!=='http:')return null;return u;}catch{return null;}}
function embedURL(url){const h=url.hostname.replace(/^www\./,'');if(h==='youtube.com'||h==='m.youtube.com'){const vid=url.searchParams.get('v');if(vid&&/^[a-zA-Z0-9_-]{11}$/.test(vid))return 'https://www.youtube-nocookie.com/embed/'+vid+'?autoplay=1&rel=0';const m=url.pathname.match(/^\/shorts\/([\w-]{11})$/);if(m)return 'https://www.youtube-nocookie.com/embed/'+m[1]+'?autoplay=1';}
if(h==='youtu.be'){const id=url.pathname.slice(1);if(/^[\w-]{11}$/.test(id))return 'https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1';}
if(h==='player.vimeo.com'&&/^\/video\/\d+/.test(url.pathname))return url.href;
if(h==='vimeo.com'&&/^\/\d+$/.test(url.pathname))return 'https://player.vimeo.com/video/'+url.pathname.slice(1)+'?autoplay=1';
return null;}
function close(){zone.replaceChildren();if(dlg.open)dlg.close();}
dlg.addEventListener('close',()=>zone.replaceChildren());dlg.addEventListener('click',e=>{if(e.target===dlg)close();});dlg.querySelector('[data-v4-close]')?.addEventListener('click',close);
document.addEventListener('click',e=>{
const trigger=e.target.closest('[data-v4-video]');if(!trigger)return;e.preventDefault();
const url=source(trigger.dataset.v4Video);if(!url)return;
zone.replaceChildren();title.textContent=trigger.dataset.v4Caption||'Property video';notice.hidden=trigger.dataset.v4Demo!=='1';
const ext=embedURL(url),file=/\.(mp4|webm)$/i.test(url.pathname);
if(ext){const f=document.createElement('iframe');f.src=ext;f.loading='eager';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.referrerPolicy='strict-origin-when-cross-origin';f.allowFullscreen=true;f.title='Property video';zone.appendChild(f);}
else if(file){const video=document.createElement('video');video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';video.poster=trigger.closest('.property-card')?.querySelector('img')?.src||document.getElementById('detail-main-img')?.src||'';video.src=url.href;zone.appendChild(video);video.play().catch(()=>{});}
else{const p=document.createElement('p');p.textContent='Video is hosted externally.';const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open video in a new tab ↗';zone.append(p,a);}
if(!dlg.open)dlg.showModal();
});
})();
