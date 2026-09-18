// Cielo decorativo generado localmente a partir de la previsión actual.
let skyScene = null;
let skyRefresh = null;
let skyBeach = null;
function setWeatherView(beach) {
  skyScene?.destroy(); skyScene = null;
  clearInterval(skyRefresh); skyBeach = beach || null;
  document.body.classList.toggle("weather-view", Boolean(beach));
  document.body.removeAttribute("data-sky");
  document.body.removeAttribute("data-phase");
  if (!beach) return;
  const canvas = document.createElement("canvas");
  canvas.className = "weather-sky"; canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  skyScene = createSky(canvas);
  skyRefresh = setInterval(() => { if (!document.hidden && skyBeach === beach) loadHourly(beach); }, 300000);
}
document.addEventListener("visibilitychange", () => { if (!document.hidden && skyBeach) loadHourly(skyBeach); });
function updateWeatherSky(current) {
  if (!skyScene) return;
  if (!current || !Number.isFinite(current.code) || ![0, 1].includes(current.day)) {
    document.body.removeAttribute("data-sky"); document.body.removeAttribute("data-phase"); skyScene.set(null); return;
  }
  const code = current.code;
  const type = code >= 95 ? "storm" : (code >= 71 && code <= 77) || (code >= 85 && code <= 86) ? "snow" : code >= 51 ? "rain" : code >= 45 ? "fog" : code === 3 ? "overcast" : code > 0 ? "clouds" : "clear";
  document.body.dataset.sky = type;
  document.body.dataset.phase = current.day === 1 ? "day" : "night";
  skyScene.set({ type, day: current.day === 1 });
}
function createSky(canvas) {
  const ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let scene = null, width = 0, height = 0, frame = 0, last = 0, elapsed = 0;
  const stars = Array.from({ length: 65 }, (_, i) => ({ x: ((i * 73 + 19) % 101) / 101, y: ((i * 37 + 11) % 97) / 130, r: .5 + (i % 3) * .35 }));
  function resize() {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0); paint();
  }
  function glow(x, y, radius, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, color); g.addColorStop(1, "transparent");
    ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  function paint() {
    if (!ctx) return;
    const { type = "unknown", day = false } = scene || {};
    const dark = ["rain", "storm", "overcast", "fog"].includes(type);
    const colors = !scene ? ["#344759", "#687d86"] : day ? dark ? ["#354c60", "#8da5b1"] : ["#1361a0", "#73b9d4"] : ["#071020", "#203c59"];
    const gradient = ctx.createLinearGradient(0, 0, 0, height); gradient.addColorStop(0, colors[0]); gradient.addColorStop(1, colors[1]); ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
    if (!scene) return;
    const t = elapsed / 1000;
    if (!day && !dark) {
      stars.forEach((s, i) => { ctx.globalAlpha = .45 + .35 * Math.sin(t * .5 + i); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2); ctx.fill(); }); ctx.globalAlpha = 1;
    }
    if (!dark) {
      const x = width * .79, y = Math.min(height * .17, 145), r = day ? 38 : 27;
      glow(x, y, day ? 190 : 110, day ? "#ffe4a76b" : "#c8e5ff35");
      ctx.fillStyle = day ? "#fff4d7" : "#e5eff6"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      if (!day) { ctx.fillStyle = "#14283f"; ctx.beginPath(); ctx.arc(x + 12, y - 9, r * .85, 0, Math.PI * 2); ctx.fill(); }
    }
    const amount = type === "clear" ? 2 : type === "clouds" ? 5 : 9;
    for (let i = 0; i < amount; i++) {
      const span = width + 600;
      const x = ((i * 263 + t * (5 + i % 3)) % span) - 250;
      const y = (i * 131 % Math.max(height * .7, 200)) + 70;
      ctx.save(); ctx.translate(x, y); ctx.scale(2.3, .75);
      glow(0, 0, 100 + i % 3 * 20, day ? dark ? "#dae4ea55" : "#ffffff63" : "#7792b92e");
      glow(45, -24, 72, day ? "#eef4f750" : "#8da5bd24"); ctx.restore();
    }
    if (["rain", "storm", "snow"].includes(type)) {
      ctx.strokeStyle = "#d3e9f75e"; ctx.lineWidth = 1;
      for (let i = 0; i < 85; i++) {
        const snow = type === "snow";
        const x = ((i * 97 + (snow ? Math.sin(t + i) * 15 : t * 25)) % (width + 30)) - 15;
        const y = (i * 53 + t * (snow ? 23 : 280)) % (height + 40) - 20;
        if (snow) { ctx.fillStyle = "#ffffffa0"; ctx.beginPath(); ctx.arc(x, y, 1.5 + i % 2, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 17); ctx.stroke(); }
      }
    }
    if (type === "fog") { glow(width * .5 + Math.sin(t * .08) * 50, height * .4, width, "#dbe4e890"); }
  }
  function loop(now) { if (now - last > 45) { elapsed += Math.min(now - last, 100); last = now; paint(); } frame = requestAnimationFrame(loop); }
  function activity() { cancelAnimationFrame(frame); if (!document.hidden && !reduced.matches) { last = performance.now(); frame = requestAnimationFrame(loop); } else paint(); }
  window.addEventListener("resize", resize); document.addEventListener("visibilitychange", activity); reduced.addEventListener("change", activity);
  resize(); activity();
  return { set(value) { scene = value; paint(); }, destroy() { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", activity); reduced.removeEventListener("change", activity); canvas.remove(); } };
}
