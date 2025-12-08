// /* gallery.js
//    Clean showcase behavior:
//    - Timeline selects a year/key
//    - Main big card updates (large image + caption)
//    - Thumbnails strip updates for the selected year
//    - Modal (fullscreen) with download
//    - Export JSON of visible items (read-only)
//    - Basic keyboard (Esc closes modal), accessible focus handling
// */

// /* === DATA ===
//    Replace / extend this array with your real images (src fields).
//    Each item: { id, year, title, caption, src }
// */
// const DATA = [
//   { id:'i1', year:'2023', title:'Golden Moment', caption:'June 2023 • لحظة مسائية دافئة', src:'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1600&q=80' },
//   { id:'i2', year:'2023', title:'Sunset Walk', caption:'June 2023 • نزهة المساء', src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80' },
//   { id:'i3', year:'2022', title:'Sweet Laugh', caption:'Feb 2022 • ضحكة عفوية', src:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80' },
//   { id:'i4', year:'2021', title:'Celebration', caption:'Oct 2021 • احتفال بسيط', src:'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1600&q=80' },
//   { id:'i5', year:'2020', title:'Tender Moment', caption:'Mar 2020 • لحظة هادئة', src:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=80' },
//   { id:'i6', year:'2019', title:'Snapshot', caption:'Aug 2019 • لقطة سريعة', src:'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80' }
// ];

// document.addEventListener('DOMContentLoaded', () => {
//   // DOM refs
//   const timelineList = document.getElementById('timelineList');
//   const tlButtons = Array.from(document.querySelectorAll('.tl-item'));
//   const cardImage = document.getElementById('cardImage');
//   const cardTitle = document.getElementById('cardTitle');
//   const cardCaption = document.getElementById('cardCaption');
//   const thumbStrip = document.getElementById('thumbStrip');
//   const openModalBtn = document.getElementById('openModalBtn');
//   const downloadBtn = document.getElementById('downloadBtn');
//   const modal = document.getElementById('modal');
//   const modalImg = document.getElementById('modalImg');
//   const modalCaption = document.getElementById('modalCaption');
//   const modalClose = document.getElementById('modalClose');
//   const modalDownload = document.getElementById('modalDownload');
//   const exportJSON = document.getElementById('exportJSON');
//   const printBtn = document.getElementById('printBtn');
//   const srLive = document.getElementById('sr-live');

//   let state = {
//     activeKey: '2023', // initial timeline key (matches first button)
//     activeIndex: 0,    // index within filtered list
//     filtered: []       // cached filtered items
//   };

//   // utility
//   const announce = (text) => { if(srLive) { srLive.textContent = text; setTimeout(()=> srLive.textContent = ' ', 800); } };
//   const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

//   // initialize timeline buttons behavior
//   tlButtons.forEach(btn => {
//     btn.addEventListener('click', () => {
//       tlButtons.forEach(b => b.classList.remove('bg-white/5'));
//       btn.classList.add('bg-white/5');
//       const key = btn.dataset.key;
//       state.activeKey = key;
//       state.activeIndex = 0;
//       renderForKey(key);
//       announce(`عرض ${key}`);
//     });
//   });

//   // render filtered items into thumbnail strip and set main card
//   function renderForKey(key) {
//     const items = DATA.filter(d => d.year === key);
//     state.filtered = items.length ? items : DATA.slice(); // fallback: all
//     // populate thumbnails
//     thumbStrip.innerHTML = '';
//     state.filtered.forEach((it, idx) => {
//       const btn = document.createElement('button');
//       btn.className = 'thumb relative rounded-md overflow-hidden focus:ring-0 thumb';
//       btn.setAttribute('aria-label', `فتح ${it.title}`);
//       btn.style.minWidth = '120px';
//       btn.style.flex = '0 0 auto';
//       btn.innerHTML = `<img src="${it.src}" class="w-28 h-20 object-cover rounded-md" alt="${escapeHtml(it.title)}"><div class="text-xs text-left mt-1 text-slate-300 ml-2">${escapeHtml(it.title)}</div>`;
//       btn.addEventListener('click', () => {
//         state.activeIndex = idx;
//         updateMainCard();
//       });
//       btn.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') { state.activeIndex = idx; updateMainCard(); } });
//       thumbStrip.appendChild(btn);
//     });
//     // set main card to first item
//     state.activeIndex = clamp(state.activeIndex, 0, state.filtered.length - 1);
//     updateMainCard();
//   }

//   // update the big center card
//   function updateMainCard() {
//     const item = state.filtered[state.activeIndex];
//     if(!item) return;
//     // smooth fade-in
//     const imgEl = cardImage;
//     imgEl.classList.remove('opacity-0');
//     imgEl.style.opacity = 0;
//     imgEl.src = item.src;
//     imgEl.alt = item.title;
//     // fade in
//     setTimeout(()=> { imgEl.style.transition = 'opacity .45s ease'; imgEl.style.opacity = 1; }, 10);
//     cardTitle.textContent = item.title;
//     cardCaption.textContent = item.caption;

//     // mark active thumb visually
//     Array.from(thumbStrip.children).forEach((c, i) => c.classList.toggle('ring-2 ring-violet-400 ring-opacity-30', i === state.activeIndex));
//   }

//   // modal open/close
//   function openModal() {
//     const item = state.filtered[state.activeIndex];
//     if(!item) return;
//     modalImg.src = item.src;
//     modalImg.alt = item.title;
//     modalCaption.textContent = item.caption;
//     modal.classList.remove('hidden');
//     document.documentElement.classList.add('no-scroll');
//     modal.focus?.();
//     announce('تم فتح الصورة بالحجم الكامل');
//   }
//   function closeModal() {
//     modal.classList.add('hidden');
//     document.documentElement.classList.remove('no-scroll');
//     modalImg.src = '';
//     announce('أغلق العرض');
//   }

//   // download helpers
//   function downloadCurrent() {
//     const item = state.filtered[state.activeIndex];
//     if(!item) return;
//     const a = document.createElement('a');
//     a.href = item.src;
//     a.download = `${sanitizeFilename(item.title)}.jpg`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   }
//   function downloadModal() {
//     const url = modalImg.src;
//     if(!url) return;
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `image-${Date.now()}.jpg`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   }

//   // export visible JSON
//   function doExportJSON() {
//     try {
//       const payload = { exportedAt: Date.now(), key: state.activeKey, items: state.filtered.map(it => ({ id: it.id, title: it.title, caption: it.caption, src: it.src })) };
//       const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `memories-${state.activeKey}.json`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);
//       announce('تم تصدير JSON');
//     } catch(e) {
//       console.warn(e);
//     }
//   }

//   // keyboard: Esc closes modal
//   document.addEventListener('keydown', (e) => {
//     if(e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
//     // left/right to navigate thumbnails when modal closed
//     if(e.key === 'ArrowRight' && modal.classList.contains('hidden')) {
//       state.activeIndex = Math.min(state.activeIndex + 1, state.filtered.length - 1);
//       updateMainCard();
//     }
//     if(e.key === 'ArrowLeft' && modal.classList.contains('hidden')) {
//       state.activeIndex = Math.max(state.activeIndex - 1, 0);
//       updateMainCard();
//     }
//   });

//   // small helpers
//   function sanitizeFilename(name){
//     return name.replace(/[^a-z0-9_\-\.]/gi,'_').toLowerCase();
//   }
//   function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

//   // wire UI buttons
//   openModalBtn.addEventListener('click', openModal);
//   downloadBtn.addEventListener('click', downloadCurrent);
//   modalClose.addEventListener('click', closeModal);
//   modalDownload.addEventListener('click', downloadModal);
//   exportJSON.addEventListener('click', doExportJSON);
//   printBtn.addEventListener('click', () => window.print());

//   // close modal on backdrop click
//   modal.addEventListener('click', (e) => {
//     if(e.target === modal) closeModal();
//   });

//   // initial render: set active timeline item (first .tl-item)
//   (function init(){
//     const first = document.querySelector('.tl-item');
//     if(first) {
//       // visually mark the first
//       tlButtons = Array.from(document.querySelectorAll('.tl-item'));
//       tlButtons.forEach(b => b.classList.remove('bg-white/5'));
//       first.classList.add('bg-white/5');
//       state.activeKey = first.dataset.key || '2023';
//     }
//     renderForKey(state.activeKey);
//     // small entrance animation
//     document.querySelectorAll('.fade-up').forEach((el, i) => setTimeout(()=> el.classList.add('show'), 80 * i));
//     announce('الصفحة جاهزة');
//   })();

// });


