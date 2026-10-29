'use strict';
const menu = {
  plates: { note: 'Two skewers. Two regular sides. One very good decision.', items: [
    ['Chicken plate combo','Two grilled chicken skewers with two regular sides of your choice.','chicken-plate',''],
    ['Mixed plate combo','One chicken skewer and one beef skewer with two regular sides of your choice.','mixed-plate',''],
    ['Beef plate combo','Two grilled beef skewers with two regular sides of your choice.','beef-plate','']
  ] },
  skewers: { note: 'Keep it simple. Add your favorite sides separately.', items: [
    ['Chicken skewer','One golden, flame-grilled chicken skewer. Sides ordered separately.','chicken-skewer','$8'],
    ['Beef skewer','One smoky, fire-grilled beef skewer. Sides ordered separately.','beef-skewer','$10']
  ] },
  sandwiches: { note: 'Make it a combo with regular fries. Swap for fried yuca for $1 more. Large fries: +$3.', items: [
    ['Beef churrasco sandwich','Sliced churrasco beef, chimichurri, caramelized onions, and fresh vinaigrette on a toasted roll.','beef-sandwich',''],
    ['Chicken churrasco sandwich','Grilled chicken thigh, house sauce, lettuce, and tomato on a toasted roll.','chicken-sandwich','']
  ] },
  sides: { note: 'A little something on the side. Choose regular or large.', items: [
    ['Farofa','Toasted cassava flour with butter and herbs. Regular $3 · Large $5.','farofa','From $3'],
    ['Vinaigrette','Fresh tomato, onion, and pepper salsa with a light vinegar dressing. Regular $2 · Large $4.','vinaigrette','From $2'],
    ['White rice','Fluffy Brazilian white rice with garlic and salt. Regular $3 · Large $5.','rice','From $3'],
    ['Fries','Crispy golden fries, seasoned with sea salt. Regular $5 · Large $8.','fries','From $5'],
    ['Fried yuca','Golden cassava with a crisp outside and a soft center. Regular $6 · Large $9.','yuca','From $6']
  ] }
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
function renderMenu(category) {
  const selected = menu[category];
  document.getElementById('menu-note').textContent = selected.note;
  document.getElementById('menu-items').setAttribute('aria-labelledby', `tab-${category}`);
  document.getElementById('menu-items').replaceChildren(...selected.items.map(([name,description,image,price], index) => {
    const item = document.createElement('article');
    item.className = 'menu-item';
    item.innerHTML = `<div class="food-image"><img src="assets/${image}.webp" width="600" height="400" loading="lazy" alt="${name}"><span class="food-number">0${index+1}</span></div><div class="food-title"><h3>${name.toUpperCase()}</h3><span class="food-price">${price}</span></div><p>${description}</p>`;
    return item;
  }));
  tabs.forEach(tab => { const active = tab.dataset.category === category; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderMenu(tab.dataset.category));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); renderMenu(tabs[next].dataset.category); }
  });
});
renderMenu('plates');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
function closeNav() { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }
navToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded', String(open)); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNav(); });
const video = document.getElementById('hero-video');
const videoToggle = document.getElementById('video-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function syncVideoButton() { videoToggle.textContent = video.paused ? '▷' : 'Ⅱ'; videoToggle.setAttribute('aria-label', video.paused ? 'Play hero video' : 'Pause hero video'); }
if (reducedMotion.matches) { video.autoplay = false; video.pause(); }
video.addEventListener('play', syncVideoButton); video.addEventListener('pause', syncVideoButton); syncVideoButton();
videoToggle.addEventListener('click', async () => { if (video.paused) { try { await video.play(); } catch { videoToggle.setAttribute('aria-label','Video unavailable'); } } else video.pause(); });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const date = document.getElementById('date');
const today = new Date(); date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const dialog = document.getElementById('request-dialog');
document.getElementById('quote-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  document.getElementById('request-preview').value = `Hi Aroma Grill! I'd love to learn about food truck catering.\n\nName: ${data.get('name')}\nEvent date: ${data.get('date')}\nGuests: ${data.get('guests')}\nDetails: ${data.get('details')}\n\nCould you share availability and a quote?`;
  document.getElementById('copy-status').textContent = '';
  document.getElementById('copy-request').textContent = 'Copy request ↗';
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
document.getElementById('copy-request').addEventListener('click', async () => {
  const preview = document.getElementById('request-preview');
  try { await navigator.clipboard.writeText(preview.value); document.getElementById('copy-status').textContent = 'Copied. Open Instagram and paste this into your message.'; }
  catch { preview.focus(); preview.select(); document.getElementById('copy-status').textContent = 'Select and copy the request above, then paste it into Instagram.'; }
});
