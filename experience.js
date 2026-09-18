const homePreferences = { query: "", favoritesOnly: false, scroll: 0 };
let favoriteBeaches;
try { const saved = JSON.parse(localStorage.getItem("brisa-favorites") || "[]"); favoriteBeaches = new Set(Array.isArray(saved) ? saved : []); }
catch { favoriteBeaches = new Set(); }
const normalizeSearch = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
let announcementTimer;
function announce(message) { const node = document.querySelector("#app-message"); node.textContent = message; clearTimeout(announcementTimer); announcementTimer = setTimeout(() => { node.textContent = ""; }, 4500); }
async function fetchForecast(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try { const response = await fetch(url, { signal: controller.signal }); const body = await response.text(); return { ok: response.ok, status: response.status, json: async () => JSON.parse(body) }; }
  finally { clearTimeout(timeout); }
}
function updateConnection() {
  const banner = document.querySelector("#connection-note");
  banner.hidden = navigator.onLine;
  banner.textContent = "Sin conexión. Las previsiones y webcams necesitan internet.";
}
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);

function enhanceExperience(beach) {
  if (!document.querySelector("#app-message")) {
    document.body.insertAdjacentHTML("beforeend", '<div id="app-message" class="app-message" role="status"></div>');
    document.querySelector(".topbar").insertAdjacentHTML("afterend", '<p id="connection-note" class="connection-note" role="status" hidden></p>');
  }
  updateConnection();
  document.title = beach ? `${beach.name} · Brisa` : "Brisa · Playas de Asturias";
  if (!beach) { enhanceHome(); return; }
  const hero = document.querySelector(".hero");
  const destination = encodeURIComponent(`Playa de ${beach.name}, ${beach.town}, Asturias, España`);
  hero.insertAdjacentHTML("beforeend", `<div class="beach-actions"><button id="favorite" type="button"></button><a href="https://www.google.com/maps/search/?api=1&query=${destination}" target="_blank" rel="noopener noreferrer">Cómo llegar ↗</a><button id="share-beach" type="button">Compartir ↗</button></div>`);
  const favorite = document.querySelector("#favorite");
  const paintFavorite = () => { const active = favoriteBeaches.has(beach.id); favorite.textContent = active ? "♥ Guardada" : "♡ Guardar"; favorite.setAttribute("aria-pressed", String(active)); favorite.setAttribute("aria-label", `${active ? "Quitar de" : "Añadir a"} favoritas: ${beach.name}`); };
  paintFavorite();
  favorite.addEventListener("click", () => {
    favoriteBeaches.has(beach.id) ? favoriteBeaches.delete(beach.id) : favoriteBeaches.add(beach.id);
    paintFavorite();
    try { localStorage.setItem("brisa-favorites", JSON.stringify([...favoriteBeaches])); announce(favoriteBeaches.has(beach.id) ? "Playa guardada en tus favoritas." : "Playa eliminada de tus favoritas."); }
    catch { announce("Guardada para esta sesión. El navegador no permite conservar tus favoritas."); }
  });
  document.querySelector("#share-beach").addEventListener("click", async () => {
    const url = `https://mestizobeach.github.io/brisa/#/playa/${beach.id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${beach.name} · Brisa`, url });
      else { await navigator.clipboard.writeText(url); announce("Enlace copiado para compartir."); }
    } catch (error) {
      if (error.name === "AbortError") return;
      let field = document.querySelector("#share-link");
      if (!field) { hero.insertAdjacentHTML("beforeend", '<label class="share-fallback">Copia este enlace<input id="share-link" readonly></label>'); field = document.querySelector("#share-link"); }
      field.value = url; field.focus(); field.select();
    }
  });
  const sections = [["Webcam", ".hero-live"], ["Tiempo", ".forecast"], ["Mareas", ".tide-card"], ["Surf", ".surf-panel"], ["Atardecer", ".sunset-card"], ["Comer", ".food-section"]];
  hero.insertAdjacentHTML("afterend", `<nav class="section-shortcuts" aria-label="Apartados de la playa">${sections.map(([label], i) => `<button type="button" data-section="${i}">${label}</button>`).join("")}</nav>`);
  document.querySelectorAll("[data-section]").forEach(button => button.addEventListener("click", () => {
    const target = document.querySelector(sections[Number(button.dataset.section)][1]);
    if (!target) return;
    target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }));
  document.querySelector(".hero-live-foot").insertAdjacentHTML("afterend", '<p class="camera-help">Si la cámara no reproduce, prueba «Abrir en origen». La disponibilidad depende de su proveedor.</p>');
  document.querySelector(".details").insertAdjacentHTML("afterbegin", '<div class="refresh-row"><span>Previsión para hoy · hora de Asturias</span><button type="button" id="refresh-data">↻ Actualizar</button></div>');
  document.querySelector("#refresh-data").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.disabled = true; button.textContent = "Actualizando…";
    marineRequests.clear();
    await Promise.allSettled([loadHourly(beach), loadDaily(beach), loadTides(beach), loadWaterTemperature(beach), loadSurf(beach), loadSunset(beach)]);
    if (button.isConnected) { button.disabled = false; button.textContent = "↻ Actualizar"; announce("Consulta terminada. Cada apartado indica si sus datos están disponibles."); }
  });
  const food = document.querySelectorAll(".food-card");
  food.forEach((card, i) => {
    const query = encodeURIComponent(`${beachFood[beach.id][i].name} ${beach.name} Asturias`);
    card.querySelector(".food-content").insertAdjacentHTML("beforeend", `<a class="maps-link" href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" rel="noopener noreferrer">Ver en Google Maps ↗</a>`);
  });
}

function enhanceHome() {
  document.querySelector(".screen-heading").insertAdjacentHTML("afterend", '<div class="home-tools"><label for="beach-search">Encuentra tu playa</label><input id="beach-search" type="search" placeholder="Playa o localidad" autocomplete="off"><div class="home-filters"><button type="button" id="all-beaches">Todas</button><button type="button" id="favorite-filter">♥ Favoritas</button><span id="result-count" role="status"></span></div></div>');
  const search = document.querySelector("#beach-search");
  search.value = homePreferences.query;
  const cards = [...document.querySelectorAll("[data-beach]")];
  cards.forEach(card => {
    if (favoriteBeaches.has(card.dataset.beach)) card.querySelector(".beach-number").insertAdjacentHTML("beforeend", ' <span aria-label="Favorita">♥</span>');
    card.querySelector(".live").textContent = "WEBCAM";
    card.addEventListener("click", () => { homePreferences.scroll = window.scrollY; });
  });
  document.querySelector(".beach-list").insertAdjacentHTML("afterend", '<div class="empty-results" hidden><strong>No hay playas para mostrar</strong><p></p><button type="button" id="reset-search">Ver todas las playas</button></div>');
  function filter() {
    let count = 0;
    cards.forEach(card => {
      const beach = beaches.find(b => b.id === card.dataset.beach);
      const visible = normalizeSearch(`${beach.name} ${beach.town}`).includes(normalizeSearch(homePreferences.query)) && (!homePreferences.favoritesOnly || favoriteBeaches.has(beach.id));
      card.hidden = !visible;
      card.classList.toggle("first-visible", visible && count === 0);
      if (visible) count++;
    });
    document.querySelector("#result-count").textContent = `${count} ${count === 1 ? "playa" : "playas"}`;
    document.querySelector("#all-beaches").setAttribute("aria-pressed", String(!homePreferences.favoritesOnly));
    document.querySelector("#favorite-filter").setAttribute("aria-pressed", String(homePreferences.favoritesOnly));
    document.querySelector(".empty-results").hidden = count > 0;
    document.querySelector(".empty-results p").textContent = homePreferences.favoritesOnly ? "Guarda playas con el corazón de su ficha o prueba otra búsqueda." : "Prueba con otro nombre de playa o localidad.";
  }
  search.addEventListener("input", () => { homePreferences.query = search.value; filter(); });
  document.querySelector("#all-beaches").addEventListener("click", () => { homePreferences.favoritesOnly = false; filter(); });
  document.querySelector("#favorite-filter").addEventListener("click", () => { homePreferences.favoritesOnly = true; filter(); });
  document.querySelector("#reset-search").addEventListener("click", () => { homePreferences.query = ""; homePreferences.favoritesOnly = false; search.value = ""; filter(); search.focus(); });
  filter();
}
