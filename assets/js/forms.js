(()=>{
 const backdrop=document.querySelector('[data-modal-backdrop]');if(!backdrop)return;
 const closeButton=backdrop.querySelector('[data-modal-close]');const title=backdrop.querySelector('[data-guide-title]');const asset=backdrop.querySelector('[data-guide-asset]');const form=backdrop.querySelector('form[data-lead-form]');
 const assets=window.CORECLOUD_CONFIG?.GUIDE_ASSETS||{};let trigger=null;
 function close(){backdrop.classList.remove('open');document.body.style.overflow='';trigger?.focus()}
 closeButton?.addEventListener('click',close);
 backdrop.addEventListener('click',e=>{if(e.target===backdrop)close()});
 document.addEventListener('keydown',e=>{if(!backdrop.classList.contains('open'))return;if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){const items=[...backdrop.querySelectorAll('button:not([disabled]),input:not([type=hidden]):not([disabled]),a[href],select,textarea')].filter(x=>x.getClientRects().length);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 backdrop.querySelector('.modal-card')?.setAttribute('role','dialog');backdrop.querySelector('.modal-card')?.setAttribute('aria-modal','true');
 document.querySelectorAll('[data-guide]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();const guide=link.dataset.guide;const path=assets[guide];if(!path)return;trigger=link;if(asset)asset.value=guide;if(title)title.textContent='Complete the form to access the Executive Guide to '+guide+'.';if(form){form.querySelector('[name="_next"]').value=new URL(path,document.baseURI).href;form.querySelector('[name="_subject"]').value='[CoreCloudZA] Executive Guide Request: '+guide;const source=form.querySelector('[name="Page URL"]');if(source)source.value=location.href;}backdrop.classList.add('open');document.body.style.overflow='hidden';requestAnimationFrame(()=>closeButton?.focus())}));
})();
