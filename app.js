const cameraDirectory = "https://www.webcamsdeasturias.com/las-playas-de-asturias/7/";

const beaches = [
  { id:"san-lorenzo", name:"San Lorenzo", town:"Gijón", temp:"22°", water:"19°", wind:"↗ 12 km/h", waves:"0,6 m", period:"9 s", swell:"NO", uv:"UV 5", tide:"15:42", status:"Buen día para playa", condition:"good", tip:"Mar tranquilo y temperatura agradable. Buen momento para paseo, baño o terraza.", surf:"Suave y ordenado. Mejor para iniciación que para olas grandes.", practical:["Paseo marítimo","Acceso urbano","Servicios cercanos"] },
  { id:"rodiles", name:"Rodiles", town:"Villaviciosa", temp:"21°", water:"18°", wind:"↗ 14 km/h", waves:"0,7 m", period:"10 s", swell:"NO", uv:"UV 5", tide:"15:38", status:"Buen día para playa", condition:"good", tip:"El viento es llevadero. Revisa la webcam antes de salir por si cambia el mar.", surf:"Olas con periodo medio. La marea cambia mucho la experiencia.", practical:["Arenal amplio","Entorno natural","Servicios de temporada"] },
  { id:"salinas", name:"Salinas", town:"Castrillón", temp:"21°", water:"18°", wind:"→ 18 km/h", waves:"0,9 m", period:"8 s", swell:"N", uv:"UV 5", tide:"15:51", status:"Oleaje moderado", condition:"caution", tip:"Hay algo de mar. Para un paseo está bien; para el baño, mantén precaución.", surf:"Condiciones activas, con viento lateral. Consulta la webcam antes de entrar.", practical:["Paseo marítimo","Restauración","Ambiente surf"] },
  { id:"aguilar", name:"Aguilar", town:"Muros de Nalón", temp:"20°", water:"18°", wind:"↗ 10 km/h", waves:"0,5 m", period:"8 s", swell:"NO", uv:"UV 4", tide:"15:47", status:"Buen día para playa", condition:"good", tip:"Condiciones suaves para disfrutar de la playa. Lleva protección solar aunque haya nubes.", surf:"Ola pequeña y suave. Revisa el punto de rompiente desde la webcam.", practical:["Arenal familiar","Entorno verde","Servicios de temporada"] },
  { id:"penarronda", name:"Peñarronda", town:"Tapia de Casariego", temp:"20°", water:"18°", wind:"↗ 17 km/h", waves:"0,8 m", period:"9 s", swell:"NO", uv:"UV 4", tide:"15:58", status:"Oleaje moderado", condition:"caution", tip:"Viento y olas moderados. Mira la webcam para decidir si te compensa ir ahora.", surf:"Mar de fondo moderado. El viento puede afectar la calidad de la ola.", practical:["Arenal amplio","Entorno natural","Consulta la webcam"] }
];

const app = document.querySelector("#app");
const beachPlans = {
  "san-lorenzo": { parking: "Aparcamiento disponible en el entorno urbano · precio no confirmado" },
  rodiles: { parking: "Aparcamiento y servicios de temporada junto al arenal" },
  salinas: { parking: "Aparcamiento público cercano · más de 100 plazas referenciadas" },
  aguilar: { parking: "Parking vigilado y regulado en temporada · pago para no residentes" },
  penarronda: { parking: "Aparcamiento amplio junto a la playa · precio no confirmado" }
};
const beachFood = {
  "san-lorenzo": [
    { name: "Ambigú Lounge", kind: "Terraza", place: "Frente a San Lorenzo", detail: "Comida informal, bebidas y vistas a la playa.", icon: "✺", url: "https://ambigu-bellavista.com/espacio/", link: "Web" },
    { name: "Topolino", kind: "Restaurante", place: "Frente a la escalera 14", detail: "Cocina asturiana y menú diario.", icon: "◈", url: "https://www.restaurantetopolino.es/", link: "Web" },
    { name: "Umami", kind: "Restaurante", place: "En el Muro de San Lorenzo", detail: "Cocina y encuentros frente al mar.", icon: "◈", url: "https://umamigijon.com/nueva/", link: "Web" }
  ],
  rodiles: [
    { name: "Mestizo", kind: "Chiringuito", place: "Frente a Rodiles", detail: "Pizzas, bebidas y música de temporada.", icon: "✺", url: "https://www.instagram.com/mestizo.rodiles/", link: "Instagram" },
    { name: "Entrepeñas", kind: "Bar restaurante", place: "Acceso a la playa", detail: "Comida y terraza cerca del arenal.", icon: "◈", url: "https://www.tripadvisor.es/Restaurant_Review-g608997-d12962649-Reviews-Cafe_Bar_Restaurante_Entrepenas-Villaviciosa_Asturias.html", link: "Ficha" },
    { name: "Bar Miami", kind: "Bar", place: "Zona de Rodiles", detail: "Comida casera junto a la playa.", icon: "☕", url: "https://mapcarta.com/es/W896355059", link: "Ubicación" }
  ],
  salinas: [
    { name: "Ewan Salinas", kind: "Restaurante terraza", place: "Paseo de Salinas", detail: "Cocina informal y gran terraza frente al mar.", icon: "✺", url: "https://www.instagram.com/ewan_salinas/", link: "Instagram" },
    { name: "Real Balneario", kind: "Restaurante", place: "Junto a la playa", detail: "Cocina de producto y terraza con vistas.", icon: "◈", url: "https://www.realbalneario.com/es/", link: "Web" },
    { name: "Agüita", kind: "Bar restaurante", place: "Frente a Salinas", detail: "Desayunos, comidas y terraza exterior.", icon: "☕", url: "https://reddepueblosdelsurf.com/listing/aguita/", link: "Ficha" }
  ],
  aguilar: [
    { name: "Restaurante Playa de Aguilar", kind: "Restaurante", place: "A un paso de la playa", detail: "Cocina asturiana y terraza en el entorno de Aguilar.", icon: "◈", url: "https://restauranteplayadeaguilar.com/", link: "Web" }
  ],
  penarronda: [
    { name: "Bar Lua", kind: "Chiringuito", place: "Playa de Peñarronda", detail: "Bar de playa en Barres.", icon: "✺", url: "https://www.castropol.es/bar-cafeteria", link: "Ficha" },
    { name: "Bar Parajes", kind: "Bar restaurante", place: "Playa de Peñarronda", detail: "Comida y terraza cerca del arenal.", icon: "◈", url: "https://www.castropol.es/bar-cafeteria", link: "Ficha" },
    { name: "Bar Toni", kind: "Bar", place: "Playa de Peñarronda", detail: "Otra opción junto a la playa, en Barres.", icon: "☕", url: "https://www.castropol.es/bar-cafeteria", link: "Ficha" }
  ]
};
const foodSection = (id) => {
  const places = beachFood[id];
  return `<section class="food-section"><div class="food-heading"><div><p class="section-label">PARA COMER Y TOMAR ALGO</p><h2>Chiringuitos y restaurantes</h2></div><span>${places.length}</span></div><div class="food-list">${places.map((place) => `<article class="food-card"><span class="food-icon" aria-hidden="true">${place.icon}</span><div class="food-content"><span class="food-kind">${place.kind}</span><h3>${place.name}</h3><p class="food-place">${place.place}</p><p class="food-detail">${place.detail}</p><a href="${place.url}" target="_blank" rel="noopener noreferrer">↗ ${place.link}</a></div></article>`).join("")}</div><p class="food-note">Locales junto a la playa que hemos podido verificar. Consulta sus horarios antes de ir.</p></section>`;
};
// Fotografías reutilizables. Se cargan desde Wikimedia Commons y mantienen enlace
// directo a autoría y licencia para que la atribución siempre sea visible.
const beachImages = {
  "san-lorenzo": { file: "Playa_de_San_Lorenzo_en_Gij%C3%B3n.jpg", author: "Mentxuwiki", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Playa_de_San_Lorenzo_en_Gij%C3%B3n.jpg" },
  rodiles: { file: "Playa_de_Rodiles,_Asturias.jpg", author: "Encina waslala", license: "CC BY-SA 4.0", page: "https://commons.wikimedia.org/wiki/File:Playa_de_Rodiles,_Asturias.jpg" },
  salinas: { file: "Playa_de_Salinas-La_Pe%C3%B1ona._01.jpg", author: "Adolfobrigido", license: "CC BY-SA", page: "https://commons.wikimedia.org/wiki/File:Playa_de_Salinas-La_Pe%C3%B1ona._01.jpg" },
  aguilar: { file: "Playa_Del_Aguilar_Asturias_(7200185).jpeg", author: "Francisco Rodriguez", license: "CC BY 3.0", page: "https://commons.wikimedia.org/wiki/File:Playa_Del_Aguilar_Asturias_(7200185).jpeg" },
  penarronda: { file: "Playa-Penarronda.jpg", author: "Marta Gonzalez", license: "Dominio público", page: "https://commons.wikimedia.org/wiki/File:Playa-Penarronda.jpg" }
};
const beachCoordinates = {
  "san-lorenzo": [43.543, -5.661], rodiles: [43.534, -5.384],
  salinas: [43.578, -5.964], aguilar: [43.557, -6.109],
  penarronda: [43.553, -6.996]
};
const tideSources = {
  "san-lorenzo": { slug: "gijon", label: "Gijón" },
  rodiles: { slug: "gijon", label: "Gijón · referencia cercana" },
  salinas: { slug: "castrillon", label: "Castrillón" },
  aguilar: { slug: "castrillon", label: "Castrillón · referencia cercana" },
  penarronda: { slug: "tapia-de-casariego", label: "Tapia de Casariego" }
};
const madridToday = () => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
};
const tideSection = (id) => `<section class="tide-card" id="tides-${id}" aria-label="Mareas y temperatura del agua de hoy"><div class="tide-heading"><span aria-hidden="true">≈</span><div><p class="section-label">HOY EN LA PLAYA</p><h2>Mareas y agua</h2></div></div><div class="tide-events" id="tide-events-${id}" aria-live="polite">Cargando pleamares y bajamares…</div><div class="water-row"><span>Temperatura del agua<small>Superficie estimada</small></span><strong id="water-${id}" aria-live="polite">—</strong></div><p class="tide-source" id="tide-source-${id}">Predicción astronómica aproximada.</p><p class="tide-source">Agua: <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener noreferrer">Open-Meteo</a> / <a href="https://www.dwd.de/" target="_blank" rel="noopener noreferrer">DWD</a> · temperatura superficial estimada.</p></section>`;

async function loadTides(beach) {
  const events = document.querySelector(`#tide-events-${beach.id}`);
  const note = document.querySelector(`#tide-source-${beach.id}`);
  const source = tideSources[beach.id];
  try {
    const response = await fetch(`https://demareas.com/api/${source.slug}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const day = data.dias?.find((entry) => entry.fecha === madridToday());
    const tides = day?.mareas?.filter((tide) => ["pleamar", "bajamar"].includes(tide.tipo) && /^\d{2}:\d{2}$/.test(tide.hora));
    if (!tides?.length) throw new Error("No hay mareas para hoy");
    if (!events?.isConnected) return;
    const now = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
    const next = tides.findIndex((tide) => tide.hora >= now);
    events.innerHTML = tides.map((tide, i) => `<div class="tide-event ${i === next ? "next" : ""}"><span class="tide-arrow" aria-hidden="true">${tide.tipo === "pleamar" ? "↑" : "↓"}</span><span>${tide.tipo === "pleamar" ? "Pleamar" : "Bajamar"}</span><strong>${tide.hora}</strong>${i === next ? "<small>Próxima</small>" : ""}</div>`).join("");
    note.innerHTML = `Mareas: <a href="https://demareas.com/${source.slug}/" target="_blank" rel="noopener noreferrer">demareas.com</a> · CC BY 4.0 · ${source.label}. Las horas pueden variar en la playa.`;
  } catch {
    if (events?.isConnected) events.textContent = "No se han podido cargar las mareas de hoy.";
    if (note?.isConnected) note.innerHTML = `Consulta las mareas en <a href="https://demareas.com/${source.slug}/" target="_blank" rel="noopener noreferrer">demareas.com</a>.`;
  }
}

async function loadWaterTemperature(beach) {
  const value = document.querySelector(`#water-${beach.id}`);
  try {
    const temperature = (await marineForecast(beach)).current?.sea_surface_temperature;
    if (typeof temperature !== "number" || !Number.isFinite(temperature)) throw new Error("Temperatura no disponible");
    if (value?.isConnected) value.innerHTML = `${temperature.toFixed(1).replace(".", ",")}° <small>C</small>`;
  } catch {
    if (value?.isConnected) value.textContent = "Sin datos";
  }
}
const marineRequests = new Map();
function marineForecast(beach) {
  const key = `${beach.id}:${madridToday()}`;
  if (!marineRequests.has(key)) {
    const [latitude, longitude] = beachCoordinates[beach.id];
    const url = new URL("https://marine-api.open-meteo.com/v1/marine");
    url.search = new URLSearchParams({ latitude, longitude, current: "sea_surface_temperature", hourly: "wave_height,wave_period,wave_direction,swell_wave_height", timezone: "Europe/Madrid", forecast_days: "1", cell_selection: "sea" });
    marineRequests.set(key, fetch(url).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }).catch((error) => { marineRequests.delete(key); throw error; }));
  }
  return marineRequests.get(key);
}
const surfSection = (id) => `<section class="surf-panel" id="surf-${id}" aria-label="Previsión de surf de hoy"><div class="surf-top"><div><p class="section-label">SURF · HOY</p><h2>Olas por horas</h2></div><span aria-hidden="true">≋</span></div><div class="surf-main"><div><strong id="surf-height-${id}">—</strong><small id="surf-selected-hour-${id}">Cargando previsión…</small></div><div class="surf-facts"><span>Periodo <strong id="surf-period-${id}">—</strong></span><span>Dirección <strong id="surf-direction-${id}">—</strong></span><span>Mar de fondo <strong id="surf-swell-${id}">—</strong></span></div></div><p class="surf-chart-label">ALTURA DE OLA A CADA HORA · DESLIZA Y TOCA</p><div class="surf-hours" id="surf-hours-${id}" aria-label="Altura de ola por hora"></div><p class="surf-note">Altura significativa prevista mar adentro. La ola al romper puede ser diferente. Datos: <a href="https://open-meteo.com/en/docs/marine-weather-api" target="_blank" rel="noopener noreferrer">Open-Meteo</a> / <a href="https://www.dwd.de/" target="_blank" rel="noopener noreferrer">DWD</a>.</p></section>`;
const waveNumber = (value) => typeof value === "number" && Number.isFinite(value) ? value.toFixed(1).replace(".", ",") : "—";
const waveDirection = (degrees) => {
  if (typeof degrees !== "number" || !Number.isFinite(degrees)) return "—";
  return ["N", "NE", "E", "SE", "S", "SO", "O", "NO"][Math.round(degrees / 45) % 8];
};

async function loadSurf(beach) {
  const panel = document.querySelector(`#surf-${beach.id}`);
  if (!panel) return;
  try {
    const hourly = (await marineForecast(beach)).hourly;
    if (!hourly?.time?.length || !["wave_height", "wave_period", "wave_direction", "swell_wave_height"].every((key) => Array.isArray(hourly[key]))) throw new Error("Previsión incompleta");
    const rows = hourly.time.map((time, i) => ({ time, height: hourly.wave_height[i], period: hourly.wave_period[i], direction: hourly.wave_direction[i], swell: hourly.swell_wave_height[i] })).filter((row) => row.time.startsWith(madridToday()));
    if (!rows.length || !rows.some((row) => typeof row.height === "number")) throw new Error("No hay olas para hoy");
    if (!panel.isConnected) return;
    const hours = panel.querySelector(`#surf-hours-${beach.id}`);
    const maximum = Math.max(1, ...rows.map((row) => typeof row.height === "number" ? row.height : 0));
    const now = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", hourCycle: "h23" }).format(new Date());
    let selected = Math.max(0, rows.findIndex((row) => row.time.slice(11, 13) === now));
    const show = (index) => {
      const row = rows[index];
      panel.querySelector(`#surf-height-${beach.id}`).textContent = `${waveNumber(row.height)} m`;
      panel.querySelector(`#surf-selected-hour-${beach.id}`).textContent = `A las ${row.time.slice(11, 16)}`;
      panel.querySelector(`#surf-period-${beach.id}`).textContent = `${waveNumber(row.period)} s`;
      panel.querySelector(`#surf-direction-${beach.id}`).textContent = waveDirection(row.direction);
      panel.querySelector(`#surf-swell-${beach.id}`).textContent = `${waveNumber(row.swell)} m`;
      hours.querySelectorAll(".surf-hour").forEach((button, i) => {
        button.classList.toggle("selected", i === index);
        button.setAttribute("aria-pressed", String(i === index));
      });
    };
    hours.innerHTML = rows.map((row, i) => `<button class="surf-hour" type="button" data-hour="${i}" aria-label="${row.time.slice(11, 16)}, ola ${waveNumber(row.height)} metros"><time>${row.time.slice(11, 13)}</time><span class="surf-bar"><span style="height:${Math.max(12, Math.round((Number(row.height) || 0) / maximum * 64))}px"></span></span><strong>${waveNumber(row.height)}</strong></button>`).join("");
    hours.querySelectorAll(".surf-hour").forEach((button) => button.addEventListener("click", () => show(Number(button.dataset.hour))));
    show(selected);
    const chosen = hours.children[selected];
    hours.scrollLeft = chosen.offsetLeft - hours.offsetLeft - hours.clientWidth / 2 + chosen.clientWidth / 2;
  } catch {
    if (panel.isConnected) panel.querySelector(`#surf-hours-${beach.id}`).textContent = "No se ha podido cargar la previsión de olas de hoy.";
  }
}
const metric = (value, label) => `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
const hours = (temp, waves) => {
  const temperature = Number.parseInt(temp, 10);
  const forecast = [
    ["Ahora", "☀", temperature, "0%", "↗ 12"], ["15", "☀", temperature, "0%", "↗ 13"],
    ["16", "⛅", temperature - 1, "0%", "↗ 14"], ["17", "⛅", temperature - 1, "5%", "↗ 15"],
    ["18", "☁", temperature - 2, "10%", "→ 14"], ["19", "☁", temperature - 2, "10%", "→ 12"],
    ["20", "☾", temperature - 3, "5%", "↘ 9"], ["21", "☾", temperature - 3, "5%", "↘ 8"],
    ["22", "☾", temperature - 4, "0%", "↓ 7"], ["23", "☾", temperature - 4, "0%", "↓ 6"]
  ];
  return forecast.map(([hour, icon, degree, rain, wind]) => `<div class="hour"><time>${hour}</time><i aria-hidden="true">${icon}</i><b>${degree}°</b><small>${rain} · ${wind}</small></div>`).join("");
};

function sunsetEstimate(weather) {
  const sunset = weather?.daily?.sunset?.[0];
  const hourly = weather?.hourly;
  if (!sunset || !hourly?.time?.length || !["cloud_cover", "cloud_cover_low", "cloud_cover_high", "visibility", "precipitation_probability"].every((field) => Array.isArray(hourly[field]))) throw new Error("Previsión incompleta");
  const sunsetMinutes = Number(sunset.slice(11, 13)) * 60 + Number(sunset.slice(14, 16));
  const date = sunset.slice(0, 10);
  const candidates = hourly.time.map((time, i) => ({ time, i, distance: Math.abs(Number(time.slice(11, 13)) * 60 - sunsetMinutes) }))
    .filter((item) => item.time.startsWith(date))
    .sort((a, b) => a.distance - b.distance).slice(0, 2);
  if (!candidates.length) throw new Error("Faltan horas cercanas al atardecer");
  const average = (field) => candidates.reduce((sum, item) => sum + (Number(hourly[field]?.[item.i]) || 0), 0) / candidates.length;
  const clouds = average("cloud_cover");
  const low = average("cloud_cover_low");
  const high = average("cloud_cover_high");
  const visibility = average("visibility");
  const rain = average("precipitation_probability");
  const obscured = low >= 70 || clouds >= 85 || visibility < 3500 || rain >= 65;
  const colorful = !obscured && low < 45 && high >= 20 && high <= 75 && visibility >= 10000 && rain < 30;
  const visibilityText = obscured ? "Poco visible" : clouds >= 65 || visibility < 8000 ? "Visibilidad media" : "Buena visibilidad";
  const intensity = obscured ? "Baja" : colorful ? "Alta" : "Media";
  const color = obscured ? "Poco visible" : colorful ? "Muy naranja, posible" : "Tonos cálidos suaves";
  const description = obscured ? "Las nubes bajas, la lluvia o la bruma podrían tapar la caída del sol." : colorful ? "Nubes altas y horizonte relativamente despejado: buenas opciones de un cielo naranja." : "Podrían verse tonos cálidos, según cambien las nubes a última hora.";
  return { time: sunset.slice(11, 16), visibilityText, intensity, color, description, clouds: Math.round(clouds) };
}

async function loadSunset(beach) {
  const card = document.querySelector(`#sunset-${beach.id}`);
  if (!card) return;
  const [latitude, longitude] = beachCoordinates[beach.id];
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude, longitude, daily: "sunset", hourly: "cloud_cover,cloud_cover_low,cloud_cover_high,visibility,precipitation_probability", timezone: "Europe/Madrid", forecast_days: "1" });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const estimate = sunsetEstimate(await response.json());
    if (!card.isConnected) return;
    card.innerHTML = `<div class="sunset-head"><span class="sunset-icon" aria-hidden="true">◒</span><div><small>PUESTA DE SOL · HOY</small><strong>${estimate.time}</strong></div></div><div class="sunset-outlook"><strong>${estimate.visibilityText}</strong><span>${estimate.color}</span></div><div class="sunset-meter" aria-label="Intensidad estimada ${estimate.intensity.toLowerCase()}"><span class="${estimate.intensity.toLowerCase()}"></span></div><p>${estimate.description}</p><small class="sunset-source">Intensidad estimada: ${estimate.intensity} · Nubosidad ${estimate.clouds}% · <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a><br>La vista desde la arena también depende del horizonte.</small>`;
  } catch {
    if (card.isConnected) card.innerHTML = `<div class="sunset-head"><span class="sunset-icon" aria-hidden="true">◒</span><div><small>PUESTA DE SOL · HOY</small><strong>Sin datos</strong></div></div><p>No se ha podido cargar la previsión de hoy. Inténtalo de nuevo más tarde.</p>`;
  }
}

function renderList() {
  app.innerHTML = `<section><div class="screen-heading"><h1>Elige tu playa</h1><p>Tiempo, mar y webcam en un vistazo</p></div><div class="beach-list">${beaches.map((b) => `<button class="beach-row" data-beach="${b.id}" type="button"><span class="beach-symbol" aria-hidden="true">☀</span><span><span class="beach-name">${b.name}</span><span class="beach-meta">${b.town} · ${b.status}</span></span><span class="live">DIRECTO</span></button>`).join("")}</div></section>`;
  document.querySelectorAll("[data-beach]").forEach((button) => button.addEventListener("click", () => { window.location.hash = `#/playa/${button.dataset.beach}`; }));
}

function renderBeach(b) {
  app.innerHTML = `<section><button class="back" type="button" id="back">‹ Todas las playas</button><header class="hero"><p class="eyebrow">${b.town.toUpperCase()} · AHORA</p><h1>${b.name}</h1><div class="status ${b.condition === "caution" ? "caution" : ""}">${b.status}</div></header><div class="details"><a class="webcam-link" href="${cameraDirectory}" target="_blank" rel="noopener noreferrer">↗ Ver webcam en directo</a><p class="source-note">Se abre en la fuente original</p><p class="section-label">PREVISIÓN POR HORAS · HOY</p><div class="forecast">${hours(b.temp,b.waves)}</div><div class="quick-note" style="margin-top:20px"><span>✦</span><div><strong>Así está ahora</strong>${b.tip}</div></div><p class="section-label">CONDICIONES</p><div class="metrics">${metric(b.temp,"Temperatura")}${metric(b.wind,"Viento")}${metric(b.waves,"Oleaje")}${metric(b.uv,"Índice UV")}${metric(b.tide,"Próx. bajamar")}${metric(b.water,"Temperatura del agua")}</div><section class="surf"><p class="section-label">SURF</p><div class="surf-grid"><div><strong>${b.waves}</strong><span>Altura de ola</span></div><div><strong>${b.period}</strong><span>Periodo</span></div><div><strong>${b.swell}</strong><span>Dirección</span></div></div><p>${b.surf}</p></section><div class="practical">${b.practical.map((item) => `<span>${item}</span>`).join("")}</div><p class="update">Tiempo, mar y surf: datos de demostración · Puesta de sol: previsión real</p></div></section>`;
  const plan = beachPlans[b.id];
  const metrics = document.querySelector(".metrics");
  metrics.previousElementSibling.remove();
  metrics.insertAdjacentHTML("afterend", `${tideSection(b.id)}<section class="sunset-card" id="sunset-${b.id}" aria-live="polite"><div class="sunset-head"><span class="sunset-icon" aria-hidden="true">◒</span><div><small>PUESTA DE SOL · HOY</small><strong>Cargando…</strong></div></div></section>`);
  metrics.remove();
  const oldSurf = document.querySelector(".surf");
  oldSurf.insertAdjacentHTML("beforebegin", surfSection(b.id));
  oldSurf.remove();
  document.querySelector(".update").textContent = "Tiempo por horas: datos de demostración · Mareas, agua, puesta de sol y surf: previsiones";
  loadTides(b);
  loadWaterTemperature(b);
  loadSurf(b);
  loadSunset(b);
  const image = beachImages[b.id];
  if (image) {
    const hero = document.querySelector(".hero");
    hero.style.backgroundImage = `linear-gradient(135deg, rgba(7, 35, 52, .66), rgba(10, 102, 128, .24)), url("https://commons.wikimedia.org/wiki/Special:FilePath/${image.file}?width=1400")`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
    hero.insertAdjacentHTML("beforeend", `<a href="${image.page}" target="_blank" rel="noopener noreferrer" style="position:absolute;right:18px;bottom:16px;color:#fff;background:rgba(0,0,0,.45);border-radius:999px;padding:7px 10px;font-size:11px;text-decoration:none;z-index:2">Foto: ${image.author} · ${image.license}</a>`);
  }
  document.querySelector(".practical").insertAdjacentHTML("afterend", `<div class="quick-note" style="margin-top:20px"><span>🅿</span><div><strong>Aparcamiento</strong>${plan.parking}</div></div>${foodSection(b.id)}<div class="quick-note" style="margin-top:20px"><span>♫</span><div><strong>Conciertos</strong>Se mostrarán aquí cuando estén confirmados.</div></div>`);
  document.querySelector("#back").addEventListener("click", () => { window.location.hash = "#/playas"; });
}

function render() { const id = window.location.hash.replace("#/playa/", ""); const beach = beaches.find((item) => item.id === id); beach ? renderBeach(beach) : renderList(); }
window.addEventListener("hashchange", render); render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
