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
  "san-lorenzo": { place: "La Mar y Morena", detail: "Bar musical frente a la playa · consultar su programación", parking: "Aparcamiento disponible en el entorno urbano · precio no confirmado" },
  rodiles: { place: "Mestizo", detail: "Chiringuito de playa · conciertos y sesiones puntuales en temporada", parking: "Aparcamiento y servicios de temporada junto al arenal" },
  salinas: { place: "Agenda de Salinas", detail: "Festivales y conciertos de verano en la zona", parking: "Aparcamiento público cercano · más de 100 plazas referenciadas" },
  aguilar: { place: "Restaurante Playa de Aguilar", detail: "Restaurante cercano y oferta de chiringuitos en temporada", parking: "Parking vigilado y regulado en temporada · pago para no residentes" },
  penarronda: { place: "Chiringuito Peñarronda", detail: "Chiringuito junto a la escuela de surf", parking: "Aparcamiento amplio junto a la playa · precio no confirmado" }
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
  document.querySelector(".metrics").insertAdjacentHTML("afterend", `<section class="sunset-card" id="sunset-${b.id}" aria-live="polite"><div class="sunset-head"><span class="sunset-icon" aria-hidden="true">◒</span><div><small>PUESTA DE SOL · HOY</small><strong>Cargando…</strong></div></div></section>`);
  loadSunset(b);
  const image = beachImages[b.id];
  if (image) {
    const hero = document.querySelector(".hero");
    hero.style.backgroundImage = `linear-gradient(135deg, rgba(7, 35, 52, .66), rgba(10, 102, 128, .24)), url("https://commons.wikimedia.org/wiki/Special:FilePath/${image.file}?width=1400")`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
    hero.insertAdjacentHTML("beforeend", `<a href="${image.page}" target="_blank" rel="noopener noreferrer" style="position:absolute;right:18px;bottom:16px;color:#fff;background:rgba(0,0,0,.45);border-radius:999px;padding:7px 10px;font-size:11px;text-decoration:none;z-index:2">Foto: ${image.author} · ${image.license}</a>`);
  }
  document.querySelector(".practical").insertAdjacentHTML("afterend", `<div class="quick-note" style="margin-top:20px"><span>🅿</span><div><strong>Aparcamiento</strong>${plan.parking}</div></div><div class="quick-note"><span>♫</span><div><strong>Plan en la playa · ${plan.place}</strong>${plan.detail}<br><span style="font-size:12px;color:var(--muted)">Conciertos: se mostrarán aquí cuando estén confirmados.</span></div></div>`);
  document.querySelector("#back").addEventListener("click", () => { window.location.hash = "#/playas"; });
}

function render() { const id = window.location.hash.replace("#/playa/", ""); const beach = beaches.find((item) => item.id === id); beach ? renderBeach(beach) : renderList(); }
window.addEventListener("hashchange", render); render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
