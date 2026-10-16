/* Escuela Técnica N.º 5 | comportamiento */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = matchMedia("(max-width: 820px)").matches;

if (window.lucide) lucide.createIcons();

/* Carga */
addEventListener("load", () => setTimeout(() => $("#loader").classList.add("done"), reduce ? 0 : 1200));

/* Barra de progreso, menú y botón volver */
const nav = $("#nav"), bar = $("#progress"), topBtn = $("#top");
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  nav.classList.toggle("scrolled", y > 40);
  topBtn.classList.toggle("show", y > 600);
  if (!reduce) $$("[data-parallax] img, [data-parallax] .ill").forEach(el => el.style.transform = `translateY(${Math.min(y, 800) * 0.08}px) scale(1.12)`);
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
topBtn.onclick = () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
$("#burger").onclick = e => { const o = $("#menu").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", o); };
$$("#menu a").forEach(a => a.onclick = () => $("#menu").classList.remove("open"));

/* Link activo según sección */
const links = $$("#menu a");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("active", l.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section").forEach(s => spy.observe(s));

/* Aparición al hacer scroll */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 5) * 70 + "ms"; io.observe(el); });

/* Efecto de escritura */
function typeText(el, text, speed = 45) {
  if (reduce) { el.textContent = text; return; }
  let i = 0; (function t() { el.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(t, speed); })();
}
setTimeout(() => typeText($("#slogan"), $("#slogan").dataset.text), reduce ? 0 : 1500);

const codeEl = $("#code");
const codeTxt = "int luz = 0;\nvoid loop() {\n  if (boton()) {\n    luz = !luz;\n    rele(luz);\n  }\n}";
new IntersectionObserver(([e], ob) => { if (e.isIntersecting) { typeText(codeEl, codeTxt, 35); ob.disconnect(); } }).observe(codeEl);

/* Ondas en botones */
document.addEventListener("click", e => {
  const b = e.target.closest(".btn"); if (!b || reduce) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
  const d = document.createElement("span"); d.className = "ripple";
  d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(d); setTimeout(() => d.remove(), 600);
});

/* Fondo animado: partículas y líneas */
(function () {
  if (reduce) return;
  const c = $("#bg"), x = c.getContext("2d"); let W, H, P = [];
  const N = mobile ? 28 : 70, link = mobile ? 90 : 130;
  function size() { W = c.width = innerWidth; H = c.height = innerHeight; }
  size(); addEventListener("resize", size);
  for (let i = 0; i < N; i++) P.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, o: Math.random() < .15 });
  let on = true; document.addEventListener("visibilitychange", () => { on = !document.hidden; if (on) draw(); });
  function draw() {
    if (!on) return; x.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
      x.fillStyle = p.o ? "#ff7a1a" : "#22e4ff"; x.fillRect(p.x, p.y, 2.5, 2.5);
      for (let j = i + 1; j < P.length; j++) {
        const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < link) { x.strokeStyle = `rgba(34,228,255,${.22 * (1 - d / link)})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, p.y); x.lineTo(q.x, q.y); x.stroke(); }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* Galería y visor (las imágenes están en el HTML) */
const items = $$("#gal button"), lb = $("#lb"); let cur = 0;
items.forEach((b, i) => b.onclick = () => open(i));
function show(i) {
  cur = (i + items.length) % items.length; const b = items[cur];
  const m = b.firstElementChild.cloneNode(true); m.classList.add("lbm");
  $("#lbimg").replaceChildren(m); $("#lbcap").textContent = `${b.dataset.cap} (${cur + 1}/${items.length})`;
}
function open(i) { show(i); lb.classList.add("open"); $(".x", lb).focus(); }
function close() { lb.classList.remove("open"); }
$(".x", lb).onclick = close; $(".p", lb).onclick = () => show(cur - 1); $(".n", lb).onclick = () => show(cur + 1);
lb.onclick = e => { if (e.target === lb) close(); };
addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
});

/* ===== v2: más animaciones ===== */
const hover = matchMedia("(hover: hover)").matches;

/* Título de portada letra por letra */
const h1 = $("h1");
if (h1 && !reduce) {
  h1.setAttribute("aria-label", h1.textContent.trim().replace(/\s+/g, " "));
  const st = { i: 0 };
  (function split(n) {
    [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => {
          if (!w.trim()) { f.append(w); return; }
          const sp = document.createElement("span"); sp.className = "w"; sp.setAttribute("aria-hidden", "true");
          [...w].forEach(ch => { const k = document.createElement("span"); k.className = "ch"; k.textContent = ch; k.style.setProperty("--i", st.i++); sp.append(k); });
          f.append(sp);
        });
        c.replaceWith(f);
      } else split(c);
    });
  })(h1);
}

/* Cinta de especialidades */
const mq = $(".marq div");
if (mq) {
  const t = ["Muestra 6 de noviembre", "Informática", "Programación", "Construcciones", "Tu futuro también se construye acá"], half = [...t, ...t];
  [...half, ...half].forEach(x => { const s = document.createElement("span"); s.textContent = x + " ◆"; mq.append(s); });
}

/* Revelados con dirección, escalonados y títulos animados */
$$("h2").forEach(el => { if (!el.classList.contains("rv")) { el.classList.add("rv"); io.observe(el); } });
$$(".g3 > .rv, .g5 > .rv").forEach((el, i) => el.classList.add(["rv-l", "rv-z", "rv-r"][i % 3]));
$$(".grid").forEach(g => [...g.children].forEach((el, i) => el.style.transitionDelay = i * 90 + "ms"));
$$(".rv").forEach(el => el.addEventListener("transitionend", e => { if (e.target === el) el.classList.add("done"); }, { once: true }));

/* Efectos con mouse: foco de luz, inclinación 3D, botones magnéticos, cursor luminoso */
if (hover && !reduce) {
  $$(".card:not(.loc)").forEach(c => {
    c.addEventListener("pointermove", e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
      c.style.transform = `perspective(700px) rotateX(${(.5 - y / r.height) * 8}deg) rotateY(${(x / r.width - .5) * 10}deg) translateY(-6px)`;
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });
  $$(".btn").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25 - 2}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transform = ""; });
  });
  const cur = document.createElement("div"); cur.id = "cursor"; cur.setAttribute("aria-hidden", "true"); document.body.append(cur);
  let cx = 0, cy = 0, tick = false;
  addEventListener("pointermove", e => {
    cx = e.clientX; cy = e.clientY;
    if (!tick) { tick = true; requestAnimationFrame(() => { cur.style.transform = `translate(${cx}px,${cy}px)`; tick = false; }); }
  });
}

/* Visor: deslizar con el dedo para cambiar de foto */
(function () {
  let sx = 0, sy = 0;
  lb.addEventListener("touchstart", e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();

/* Cuenta regresiva a la muestra: viernes 6 de noviembre de 2026 */
(function () {
  const box = $("#count"); if (!box) return;
  const target = new Date(2026, 10, 6, 0, 0, 0).getTime(); // mes 10 = noviembre
  const f = { d: $("#cd-d"), h: $("#cd-h"), m: $("#cd-m"), s: $("#cd-s") };
  function tick() {
    const ms = target - Date.now();
    if (ms <= 0) { box.hidden = true; return; }
    const s = Math.floor(ms / 1000);
    f.d.textContent = Math.floor(s / 86400);
    f.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
    f.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
    f.s.textContent = String(s % 60).padStart(2, "0");
    box.hidden = false;
    setTimeout(tick, 1000);
  }
  tick();
})();
