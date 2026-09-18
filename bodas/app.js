const CATEGORIES=['Todos','Espacios','Catering','Wedding planner','Decoración','DJ y música','Sonido e iluminación'];
const STEPS=['Definir fecha aproximada','Decidir presupuesto','Elegir espacio','Seleccionar catering','Reservar música y proveedores','Enviar invitaciones'];
const $=id=>document.getElementById(id);
const readArray=key=>{try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:[]}catch{return[]}};
const writeArray=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const saved=new Set(readArray('albor-favorites'));
const done=new Set(readArray('albor-steps'));
const filters={category:'Todos',zone:'all',query:''};
const accent={'Espacios':'espacios','Catering':'catering','Wedding planner':'planner','Decoración':'decoracion','DJ y música':'musica','Sonido e iluminación':'sonido'};
let installPrompt=null;
const fold=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const route=()=>location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
const quote=text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function card(b){
  return `<article class="listing"><div class="listing-art ${accent[b.category]}"><span class="art-symbol" aria-hidden="true">${b.symbol}</span><button class="save-button ${saved.has(b.id)?'saved':''}" type="button" data-save="${b.id}" aria-label="${saved.has(b.id)?'Quitar de':'Añadir a'} guardados: ${quote(b.name)}" aria-pressed="${saved.has(b.id)}">${saved.has(b.id)?'♥':'♡'}</button></div><div class="listing-body"><div class="listing-meta">${quote(b.category)} · ${quote(b.place)}</div><h3>${quote(b.name)}</h3><p>${quote(b.summary)}</p><a class="listing-open" href="#/ficha/${b.id}">Ver ficha →</a></div></article>`;
}
function featureBanner(){return `<div class="info-banner"><div><strong>Tu boda, a tu manera.</strong><p>Guarda lo que te gusta y sigue tus próximos pasos.</p></div><a class="secondary" href="#/plan">Abrir mi plan →</a></div>`}
function installCard(){return `<div class="install-card"><strong>Lleva ALBOR contigo</strong><p id="install-help">Añade esta app a la pantalla de inicio de tu móvil para abrirla como Brisa.</p><button class="secondary" id="install-button" type="button">Cómo instalarla ↗</button></div>`}

function home(){
  const featured=[businesses[0],businesses[1],businesses[6],businesses[10]];
  $('app').innerHTML=`<section class="home-hero"><div class="hero-arch" aria-hidden="true"></div><div class="home-hero-content"><p class="eyebrow">BODAS EN ASTURIAS</p><h1>Todo empieza con un <em>sí.</em></h1><p>Encuentra el lugar, las personas y las ideas para hacer tu boda a tu manera.</p><a class="primary" href="#/explorar">Explorar opciones ↗</a></div></section><section><div class="section-title"><h2>¿Por dónde empezamos?</h2></div><div class="quick-grid"><a class="quick-card" href="#/explorar/Espacios"><span class="quick-icon">⌂</span><span><strong>Espacios</strong><small>El lugar</small></span></a><a class="quick-card" href="#/explorar/Catering"><span class="quick-icon">◒</span><span><strong>Catering</strong><small>La mesa</small></span></a><a class="quick-card" href="#/explorar/Wedding%20planner"><span class="quick-icon">✳</span><span><strong>Organización</strong><small>La ayuda</small></span></a><a class="quick-card" href="#/explorar/Decoraci%C3%B3n"><span class="quick-icon">✿</span><span><strong>Decoración</strong><small>El ambiente</small></span></a><a class="quick-card" href="#/explorar/DJ%20y%20m%C3%BAsica"><span class="quick-icon">♫</span><span><strong>DJ y música</strong><small>La fiesta</small></span></a><a class="quick-card" href="#/explorar/Sonido%20e%20iluminaci%C3%B3n"><span class="quick-icon">◈</span><span><strong>Luz y sonido</strong><small>El montaje</small></span></a></div></section><section><div class="section-title"><h2>Para empezar a soñar</h2><a href="#/explorar">Ver todas →</a></div><div class="feature-list">${featured.map(card).join('')}</div></section>${featureBanner()}${installCard()}<p class="about-note">ALBOR es una selección inicial e independiente. Las fichas enlazan a las webs oficiales; confirma precio y disponibilidad directamente con cada negocio.</p>`;
  wireInstall();
}

function filtered(){
  const query=fold(filters.query.trim());
  return businesses.filter(b=>(filters.category==='Todos'||b.category===filters.category)&&(filters.zone==='all'||b.zone===filters.zone)&&(!query||fold(`${b.name} ${b.summary} ${b.place} ${b.category}`).includes(query)));
}
function renderResults(){
  const target=$('explore-results');if(!target)return;
  const found=filtered();
  $('result-count').textContent=`${found.length} ${found.length===1?'opción':'opciones'}`;
  target.innerHTML=found.length?`<div class="results">${found.map(card).join('')}</div>`:`<div class="empty"><div class="symbol">✳</div><h2>No encontramos resultados</h2><p>Prueba otra categoría, zona o palabra.</p><button class="secondary" type="button" id="clear-filters">Limpiar filtros</button></div>`;
}
function renderChips(){const target=$('category-chips');if(target)target.innerHTML=CATEGORIES.map(c=>`<button type="button" class="chip ${filters.category===c?'active':''}" data-category="${quote(c)}" aria-pressed="${filters.category===c}">${quote(c)}</button>`).join('')}
function explore(routeCategory){
  if(routeCategory&&CATEGORIES.includes(routeCategory))filters.category=routeCategory;
  else if(routeCategory===null)filters.category='Todos';
  $('app').innerHTML=`<section class="screen-head"><p class="eyebrow">DESCUBRE ASTURIAS</p><h1>Encuentra a los <em>tuyos.</em></h1><p>Espacios y profesionales para que cada detalle tenga tu sello.</p></section><div class="search-box"><input id="search-input" type="search" placeholder="Buscar nombre, servicio o zona" aria-label="Buscar" value="${quote(filters.query)}"></div><div class="chips" id="category-chips" role="group" aria-label="Categorías"></div><div class="filter-row"><select id="zone-select" aria-label="Filtrar por zona"><option value="all">Toda Asturias</option><option value="Gijón">Gijón</option><option value="Oviedo">Oviedo</option><option value="Oriente">Oriente</option><option value="Asturias">Varias zonas</option></select><span id="result-count" aria-live="polite"></span></div><section id="explore-results" aria-label="Resultados"></section><p class="about-note">Selección inicial con enlaces a las webs oficiales. No se muestran precios ni disponibilidad sin confirmar.</p>`;
  $('zone-select').value=filters.zone;renderChips();renderResults();
}
function guardados(){
  const items=businesses.filter(b=>saved.has(b.id));
  $('app').innerHTML=`<section class="screen-head"><p class="eyebrow">TU SELECCIÓN</p><h1>Ideas que quieres <em>guardar.</em></h1><p>Tus favoritos se guardan en este dispositivo.</p></section>${items.length?`<div class="results">${items.map(card).join('')}</div>`:`<div class="empty"><div class="symbol">♡</div><h2>Tu lista está esperando</h2><p>Toca el corazón de cualquier espacio o proveedor para guardarlo aquí.</p><a class="primary" href="#/explorar">Explorar opciones ↗</a></div>`}${featureBanner()}`;
}
function plan(){
  const progress=Math.round(done.size/STEPS.length*100);
  $('app').innerHTML=`<section class="screen-head"><p class="eyebrow">TU BODA, PASO A PASO</p><h1>Mi <em>plan.</em></h1><p>Una guía sencilla para empezar a organizarlo todo.</p></section><div class="plan-card"><p class="eyebrow">TU PROGRESO</p><h2>Vas por buen camino.</h2><p>Ve marcando los pasos que ya has resuelto.</p><div class="progress"><span style="width:${progress}%"></span></div><p class="progress-caption">${done.size} de ${STEPS.length} pasos completados</p></div><div class="checklist">${STEPS.map((step,index)=>`<label class="task ${done.has(index)?'done':''}"><input type="checkbox" data-step="${index}" ${done.has(index)?'checked':''}><span>${String(index+1).padStart(2,'0')}. ${step}</span></label>`).join('')}</div><p class="plan-hint">El progreso queda guardado en este dispositivo. Puedes cambiar cualquier paso cuando quieras.</p>${installCard()}`;
  wireInstall();
}
function ficha(id){
  const b=businesses.find(item=>item.id===id);if(!b){location.hash='#/explorar';return}
  const current=b.category==='Espacios'?'Espacios':'proveedores';
  $('app').innerHTML=`<div class="detail-view"><a class="back-link" href="#/explorar/${encodeURIComponent(b.category)}">← Volver a ${current}</a><div class="detail-art ${accent[b.category]}" aria-hidden="true">${b.symbol}</div><div class="detail-head"><p class="eyebrow">${quote(b.category)} · ${quote(b.place)}</p><h1>${quote(b.name)}</h1></div><p class="detail-summary">${quote(b.detail)}</p><div class="detail-facts"><div><small>Zona</small><strong>${quote(b.place)}</strong></div><div><small>Precio y fechas</small><strong>Consultar con el negocio</strong></div></div><div class="detail-actions"><a class="primary" href="${b.url}" target="_blank" rel="noopener noreferrer">Ir a web oficial ↗</a><button class="secondary" type="button" data-save="${b.id}">${saved.has(b.id)?'♥ Guardado':'♡ Guardar'}</button></div><p class="detail-disclaimer">Consulta disponibilidad, servicios y condiciones directamente antes de reservar.</p></div>`;
}
function currentView(){
  const parts=route();const name=parts[0]||'inicio';
  document.querySelectorAll('[data-nav]').forEach(link=>{const active=link.dataset.nav===(name==='ficha'?'explorar':name);link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});
  $('saved-count').textContent=saved.size;
  if(name==='explorar')explore(parts.length>1?decodeURIComponent(parts.slice(1).join('/')):null);
  else if(name==='guardados')guardados();
  else if(name==='plan')plan();
  else if(name==='ficha')ficha(parts[1]);
  else home();
  window.scrollTo(0,0);
}
function refreshCurrent(){const y=scrollY;currentView();window.scrollTo(0,y)}
function wireInstall(){const button=$('install-button');if(button)button.addEventListener('click',showInstall)}
async function showInstall(){
  if(location.protocol==='file:'){
    $('install-message').textContent='Estás viendo un archivo local dentro de Codex. Abre la versión publicada en Safari (iPhone) o Chrome (Android) para añadirla a la pantalla de inicio.';
    $('install-live-link').hidden=false;$('install-dialog').showModal();return;
  }
  if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}
  const apple=/iPhone|iPad|iPod/.test(navigator.userAgent);
  $('install-message').textContent=apple?'En Safari, toca Compartir, elige «Añadir a pantalla de inicio» y pulsa Añadir. Después abre ALBOR desde su icono.':'En Chrome, abre el menú de tres puntos y elige «Instalar app» o «Añadir a pantalla de inicio». Después abre ALBOR desde su icono.';
  $('install-live-link').hidden=true;$('install-dialog').showModal();
}

document.addEventListener('click',event=>{
  const save=event.target.closest('[data-save]');if(save){const id=save.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);writeArray('albor-favorites',[...saved]);refreshCurrent();return}
  const category=event.target.closest('[data-category]');if(category){filters.category=category.dataset.category;renderChips();renderResults();return}
  if(event.target.id==='clear-filters'){filters.category='Todos';filters.zone='all';filters.query='';explore();return}
});
document.addEventListener('input',event=>{if(event.target.id==='search-input'){filters.query=event.target.value;renderResults()}});
document.addEventListener('change',event=>{
  if(event.target.id==='zone-select'){filters.zone=event.target.value;renderResults()}
  const input=event.target.closest('[data-step]');if(input){const index=Number(input.dataset.step);if(input.checked)done.add(index);else done.delete(index);writeArray('albor-steps',[...done]);refreshCurrent()}
});
$('header-saved').addEventListener('click',()=>location.hash='#/guardados');
$('install-action').addEventListener('click',showInstall);
$('install-close').addEventListener('click',()=>$('install-dialog').close());
$('install-dialog').addEventListener('click',event=>{if(event.target===$('install-dialog'))$('install-dialog').close()});
if(location.protocol==='file:')$('preview-alert').hidden=false;
if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)$('install-action').hidden=true;
window.addEventListener('hashchange',currentView);
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event});
window.addEventListener('appinstalled',()=>{$('install-action').hidden=true;installPrompt=null});
currentView();
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
