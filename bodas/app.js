const businesses = [
  {id:'puebloastur',name:'Puebloastur Eco Resort',category:'Espacios',zone:'Oriente',place:'Parres · Oriente',symbol:'⌂',summary:'Un resort entre montañas para celebrar una boda con alojamiento y espacios interiores y exteriores.',detail:'Puebloastur presenta espacios para ceremonia, banquete y celebración en un entorno rural junto a la Sierra del Sueve. Consulta las opciones de exclusividad y alojamiento directamente con el equipo.',url:'https://www.puebloastur.com/bodas'},
  {id:'villa-maria',name:'Finca Villa María',category:'Espacios',zone:'Gijón',place:'Gijón',symbol:'✦',summary:'Finca y restaurante para bodas con espacios de celebración en Gijón.',detail:'Finca Villa María presenta propuestas de bodas y eventos en su finca de Gijón. Su web permite conocer el lugar y contactar para una visita.',url:'https://fincavillamariagijon.es/bodas/'},
  {id:'quinta-ynfanzon',name:'La Quinta del Ynfanzón',category:'Espacios',zone:'Gijón',place:'Gijón',symbol:'⌂',summary:'Finca centenaria con salón para bodas, gastronomía y alojamiento rural.',detail:'La Quinta del Ynfanzón reúne finca, salón polivalente y hotel rural a pocos minutos de Gijón. Consulta en su web el formato que mejor se adapta a tu boda.',url:'https://quintadelynfanzon.com/'},
  {id:'deloya-latores',name:'Deloya Latores',category:'Espacios',zone:'Oviedo',place:'Oviedo',symbol:'✧',summary:'Finca singular en Oviedo con espacios interiores y exteriores para celebraciones.',detail:'Deloya Latores es un espacio de celebraciones en Oviedo. Su equipo comparte las posibilidades de la finca y sus servicios para bodas.',url:'https://www.deloyalatores.com/'},
  {id:'palacio-cutre',name:'Palacio de Cutre',category:'Espacios',zone:'Oriente',place:'Piloña · Oriente',symbol:'♜',summary:'Palacio y finca con vistas a los Picos de Europa para bodas y eventos.',detail:'El Palacio de Cutre presenta un espacio para bodas dentro de su finca en el oriente asturiano. Consulta directamente formatos, capacidad y alojamiento.',url:'https://palaciodecutre.com/eventos/'},
  {id:'capile',name:'Capilé',category:'Catering',zone:'Oviedo',place:'Oviedo · servicio en Asturias',symbol:'◒',summary:'Catering asturiano para bodas y celebraciones con propuestas gastronómicas propias.',detail:'Capilé ofrece catering para bodas y otros eventos desde Oviedo. Puedes consultar menús y servicios actuales en su web.',url:'https://www.capile.com/'},
  {id:'perfday',name:'Perfday Wedding',category:'Wedding planner',zone:'Asturias',place:'Asturias',symbol:'✳',summary:'Diseño, organización y acompañamiento integral para bodas en Asturias.',detail:'Perfday trabaja en la planificación y diseño de bodas en Asturias, desde las primeras decisiones hasta la coordinación del día.',url:'https://www.perfday.es/'},
  {id:'mynoah',name:'My Noah Candy',category:'Wedding planner',zone:'Asturias',place:'Asturias',symbol:'✿',summary:'Planificación de bodas con atención al diseño, flores y coordinación de proveedores.',detail:'My Noah Candy presenta servicios de organización y diseño de bodas en Asturias. Su web explica su enfoque y vías de contacto.',url:'https://www.mynoahcandy.com/'},
  {id:'boda-flores',name:'Boda y Flores',category:'Decoración',zone:'Asturias',place:'Asturias',symbol:'❀',summary:'Decoración personalizada para bodas y otros eventos en Asturias.',detail:'Boda y Flores muestra propuestas decorativas con flores y globos. Consulta ideas y presupuestos en su web.',url:'https://bodayflores.com/'},
  {id:'petit-grinza',name:'Petit Grinza',category:'Decoración',zone:'Asturias',place:'Asturias',symbol:'❁',summary:'Diseño y decoración de bodas con selección de materiales y flores.',detail:'Petit Grinza ofrece diseño y decoración de bodas en Asturias. Su propuesta incluye dirección estética y colaboración con otros especialistas.',url:'https://www.petitgrinza.com/dise%C3%B1o'},
  {id:'videodance',name:'Videodance',category:'DJ y música',zone:'Asturias',place:'Asturias',symbol:'♫',summary:'DJ para bodas con montajes de música, sonido e iluminación.',detail:'Videodance presenta un servicio de DJ para bodas en Asturias con personalización de música, iluminación y puesta en escena.',url:'https://videodance.es/dj/'},
  {id:'pronorte',name:'Pronorte',category:'Sonido e iluminación',zone:'Asturias',place:'Asturias',symbol:'◈',summary:'Servicios técnicos y alquiler de sonido e iluminación para eventos.',detail:'Pronorte es una empresa asturiana de servicios técnicos para eventos. Consulta con su equipo las necesidades de sonido e iluminación de tu boda.',url:'https://www.pronortesonido.es/'}
];

const categories = ['Todos','Espacios','Catering','Wedding planner','Decoración','DJ y música','Sonido e iluminación'];
const steps = ['Definir fecha aproximada','Decidir presupuesto','Elegir espacio','Seleccionar catering','Reservar música y proveedores','Enviar invitaciones'];
const state = {category:'Todos',search:'',zone:'all',favoritesOnly:false};
const $ = (id) => document.getElementById(id);
const safeRead = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const safeWrite = (key,value) => { try { localStorage.setItem(key,JSON.stringify(value)); } catch {} };
const favorites = new Set(safeRead('albor-favorites'));
const completed = new Set(safeRead('albor-steps'));
const categoryClass = {'Espacios':'venue','Catering':'catering','Wedding planner':'planner','Decoración':'decor','DJ y música':'music','Sonido e iluminación':'light'};
const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function renderCategories(){
  $('category-list').innerHTML = categories.map(category => `<button class="chip${state.category===category?' active':''}" type="button" data-category="${category}" aria-pressed="${state.category===category}">${category}</button>`).join('');
}
function matches(business){
  const query=normalize(state.search.trim());
  return (state.category==='Todos'||business.category===state.category)
    && (state.zone==='all'||business.zone===state.zone)
    && (!state.favoritesOnly||favorites.has(business.id))
    && (!query||normalize(`${business.name} ${business.category} ${business.place} ${business.summary}`).includes(query));
}
function renderCards(){
  const found=businesses.filter(matches);
  $('cards').innerHTML=found.map(b=>`<article class="card"><div class="card-visual ${categoryClass[b.category]}"><span class="card-category">${b.category}</span><span class="visual-symbol" aria-hidden="true">${b.symbol}</span><button class="favorite${favorites.has(b.id)?' saved':''}" data-favorite="${b.id}" type="button" aria-label="${favorites.has(b.id)?'Quitar de':'Guardar en'} favoritos: ${b.name}" aria-pressed="${favorites.has(b.id)}">${favorites.has(b.id)?'♥':'♡'}</button></div><div class="card-body"><span class="card-zone">↗ ${b.place}</span><h3>${b.name}</h3><p>${b.summary}</p><div class="card-actions"><button type="button" data-detail="${b.id}">Ver ficha <span aria-hidden="true">→</span></button><a href="${b.url}" target="_blank" rel="noopener noreferrer">Web oficial ↗</a></div></div></article>`).join('');
  $('result-count').textContent=`${found.length} ${found.length===1?'opción encontrada':'opciones encontradas'}`;
  $('saved-count').textContent=favorites.size;
  $('empty').hidden=found.length!==0;
}
function renderChecklist(){
  $('checklist').innerHTML=steps.map((step,index)=>`<label class="task${completed.has(index)?' checked':''}"><input type="checkbox" data-step="${index}" ${completed.has(index)?'checked':''}><span>${String(index+1).padStart(2,'0')}. ${step}</span></label>`).join('');
  $('progress-bar').style.width=`${completed.size/steps.length*100}%`;
  $('progress-label').textContent=`${completed.size} de ${steps.length} pasos completados`;
}
function resetFilters(){
  Object.assign(state,{category:'Todos',search:'',zone:'all',favoritesOnly:false});
  $('search').value='';$('zone').value='all';$('favorites-only').checked=false;
  renderCategories();renderCards();
}
function showDetail(id){
  const b=businesses.find(item=>item.id===id);if(!b)return;
  $('detail-content').innerHTML=`<div class="detail-visual" aria-hidden="true">${b.symbol}</div><div class="detail-inner"><p class="eyebrow">${b.category} · ${b.place}</p><h2 id="detail-title">${b.name}</h2><p>${b.detail}</p><div class="detail-meta"><span><strong>Zona</strong>${b.place}</span><span><strong>Disponibilidad y precio</strong>Consultar con el proveedor</span></div><div class="detail-actions"><a class="button button-dark" href="${b.url}" target="_blank" rel="noopener noreferrer">Visitar web oficial ↗</a><button type="button" data-favorite="${b.id}">${favorites.has(b.id)?'♥ Guardado':'♡ Guardar favorito'}</button></div><p class="detail-footnote">La información puede cambiar. Confirma los detalles en la web oficial antes de contratar.</p></div>`;
  $('detail-dialog').showModal();
}

$('category-list').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;state.category=button.dataset.category;renderCategories();renderCards();});
$('search').addEventListener('input',event=>{state.search=event.target.value;renderCards();});
$('zone').addEventListener('change',event=>{state.zone=event.target.value;renderCards();});
$('favorites-only').addEventListener('change',event=>{state.favoritesOnly=event.target.checked;renderCards();});
$('reset-filters').addEventListener('click',resetFilters);
$('empty-reset').addEventListener('click',resetFilters);
$('saved-nav').addEventListener('click',()=>{state.favoritesOnly=true;$('favorites-only').checked=true;renderCards();$('catalogo').scrollIntoView({behavior:'smooth'});});
$('cards').addEventListener('click',event=>{const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);return;}const detail=event.target.closest('[data-detail]');if(detail)showDetail(detail.dataset.detail);});
$('detail-content').addEventListener('click',event=>{const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);showDetailContent(favorite.dataset.favorite);}});
function showDetailContent(id){const dialog=$('detail-dialog');dialog.close();showDetail(id);}
function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);safeWrite('albor-favorites',[...favorites]);renderCards();}
$('dialog-close').addEventListener('click',()=>$('detail-dialog').close());
$('detail-dialog').addEventListener('click',event=>{if(event.target===$('detail-dialog'))$('detail-dialog').close();});
$('checklist').addEventListener('change',event=>{const input=event.target.closest('[data-step]');if(!input)return;const index=Number(input.dataset.step);if(input.checked)completed.add(index);else completed.delete(index);safeWrite('albor-steps',[...completed]);renderChecklist();});
$('total-count').textContent=businesses.length;
renderCategories();renderCards();renderChecklist();
