const cameraDirectory = "https://www.webcamsdeasturias.com/las-playas-de-asturias/7/";

const beaches = [
  { id: "san-lorenzo", name: "San Lorenzo", town: "Gijón", webcam: true, temp: "22°", water: "19°", wind: "↗ 12 km/h", waves: "0,6 m", uv: "UV 5", tide: "15:42", status: "Buen día para playa", condition: "good" },
  { id: "rodiles", name: "Rodiles", town: "Villaviciosa", webcam: true, temp: "21°", water: "18°", wind: "↗ 14 km/h", waves: "0,7 m", uv: "UV 5", tide: "15:38", status: "Buen día para playa", condition: "good" },
  { id: "salinas", name: "Salinas", town: "Castrillón", webcam: true, temp: "21°", water: "18°", wind: "→ 18 km/h", waves: "0,9 m", uv: "UV 5", tide: "15:51", status: "Oleaje moderado", condition: "caution" },
  { id: "aguilar", name: "Aguilar", town: "Muros de Nalón", webcam: true, temp: "20°", water: "18°", wind: "↗ 10 km/h", waves: "0,5 m", uv: "UV 4", tide: "15:47", status: "Buen día para playa", condition: "good" },
  { id: "penarronda", name: "Peñarronda", town: "Tapia de Casariego", webcam: true, temp: "20°", water: "18°", wind: "↗ 17 km/h", waves: "0,8 m", uv: "UV 4", tide: "15:58", status: "Oleaje moderado", condition: "caution" }
];

const app = document.querySelector("#app");

function metric(value, label) {
  return `<div class="metric"><strong>${value}</strong><span>${label}</span></div>`;
}

function renderList() {
  app.innerHTML = `<section><div class="screen-heading"><h1>Elige tu playa</h1><p>Consulta cómo está ahora mismo</p></div><div class="beach-list">${beaches.map((beach) => `<button class="beach-row" data-beach="${beach.id}" type="button"><span class="beach-symbol" aria-hidden="true">☀</span><span><span class="beach-name">${beach.name}</span><span class="beach-meta">${beach.town}${beach.webcam ? " · Webcam disponible" : ""}</span></span>${beach.webcam ? '<span class="live">EN DIRECTO</span>' : ""}</button>`).join("")}</div></section>`;
  document.querySelectorAll("[data-beach]").forEach((button) => button.addEventListener("click", () => {
    window.location.hash = `#/playa/${button.dataset.beach}`;
  }));
}

function renderBeach(beach) {
  const webcam = beach.webcam
    ? `<a class="webcam-link" href="${cameraDirectory}" target="_blank" rel="noopener noreferrer">↗ Ver webcam en directo</a><p class="source-note">Se abre en la fuente original</p>`
    : `<div class="no-cam"><strong>Webcam no disponible</strong>Esta playa todavía no tiene una fuente enlazada.</div>`;
  app.innerHTML = `<section><button class="back" type="button" id="back">‹ Todas las playas</button><header class="hero"><p class="eyebrow">${beach.town.toUpperCase()} · AHORA</p><h1>${beach.name}</h1><div class="status ${beach.condition === "caution" ? "caution" : ""}">${beach.status}</div></header><div class="details">${webcam}<div class="metrics">${metric(beach.temp, "Temperatura")}${metric(beach.wind, "Viento")}${metric(beach.waves, "Oleaje")}${metric(beach.uv, "Índice UV")}${metric(beach.tide, "Próx. bajamar")}${metric(beach.water, "Temperatura del agua")}</div><p class="update">Datos de demostración · Actualizado hace 10 min</p></div></section>`;
  document.querySelector("#back").addEventListener("click", () => { window.location.hash = "#/playas"; });
}

function render() {
  const id = window.location.hash.replace("#/playa/", "");
  const beach = beaches.find((item) => item.id === id);
  beach ? renderBeach(beach) : renderList();
}

window.addEventListener("hashchange", render);
render();

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
