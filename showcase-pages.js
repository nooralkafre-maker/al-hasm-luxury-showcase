document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-gallery-tab="video"]').forEach(b=>b.addEventListener('click',()=>{const a=document.getElementById('showcase-property-video');if(a)a.click();}));
 document.querySelectorAll('[data-gallery-tab="tour"]').forEach(b=>b.addEventListener('click',()=>{location.href='tour.html';}));
});