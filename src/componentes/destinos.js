// ============================================================
//  componentes/ver-destino.js
//  Detalle de un destino con carrusel de imágenes
// ============================================================
import { getDestino, listenSettings, saveConsulta } from "../firebase.js";
import { initShared, buildWhatsApp } from "./_shared.js";
import { sanitize, validateContactForm, checkRateLimit } from "../security.js";

// ─── CSS del carrusel inyectado una sola vez ──────────────
function _injectCarouselCSS() {
  if (document.getElementById("vd-carousel-style")) return;
  const style = document.createElement("style");
  style.id = "vd-carousel-style";
  style.textContent = `
    .vd-carousel{position:relative;width:100%;height:520px;overflow:hidden;background:#111}
    @media(max-width:768px){.vd-carousel{height:300px}}
    .vd-carousel-track{position:relative;width:100%;height:100%}
    .vd-slide{position:absolute;inset:0;opacity:0;transition:opacity .6s ease;pointer-events:none}
    .vd-slide.active{opacity:1;pointer-events:auto}
    .vd-slide img{width:100%;height:100%;object-fit:cover;display:block}
    .vd-hero-ov{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,.55) 100%)}
    .vd-hero-info{position:absolute;bottom:48px;left:48px;right:48px;z-index:10;color:#fff}
    @media(max-width:768px){.vd-hero-info{bottom:56px;left:20px;right:20px}}
    .vd-hero-info h1{font-family:'Playfair Display',serif;font-size:clamp(28px,5vw,52px);font-weight:700;margin:8px 0 12px;text-shadow:0 2px 12px rgba(0,0,0,.4);line-height:1.15}
    .vd-tag{display:inline-block;background:var(--gold,#b8924a);color:#fff;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:4px 12px;border-radius:20px}
    .vd-meta{display:flex;gap:16px;flex-wrap:wrap}
    .vd-meta span{background:rgba(255,255,255,.18);backdrop-filter:blur(6px);padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600}
    .vd-carousel-btn{position:absolute;top:50%;transform:translateY(-50%);z-index:20;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);color:#fff;border:none;width:48px;height:48px;border-radius:50%;font-size:28px;cursor:pointer;transition:background .2s,transform .2s;display:flex;align-items:center;justify-content:center}
    .vd-carousel-btn:hover{background:rgba(0,0,0,.6);transform:translateY(-50%) scale(1.08)}
    .vd-prev{left:16px}.vd-next{right:16px}
    @media(max-width:480px){.vd-carousel-btn{width:36px;height:36px;font-size:22px}.vd-prev{left:8px}.vd-next{right:8px}}
    .vd-dots{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:20;display:flex;gap:8px}
    .vd-dot{width:8px;height:8px;border-radius:50%;border:none;background:rgba(255,255,255,.45);cursor:pointer;transition:background .25s,transform .25s;padding:0}
    .vd-dot.active{background:#fff;transform:scale(1.35)}
    .vd-counter{position:absolute;top:16px;right:16px;z-index:20;background:rgba(0,0,0,.4);backdrop-filter:blur(4px);color:#fff;font-size:12px;font-weight:600;padding:4px 10px;border-radius:12px}
  `;
  document.head.appendChild(style);
}

// ─── Estado del carrusel ──────────────────────────────────
let _carouselIndex = 0;
let _carouselTotal = 0;
let _carouselTimer = null;

export function initVerDestino() {
  initShared();
  _init();
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("ver-destino-contenido") && !window._verDestinoInited) {
    window._verDestinoInited = true;
    initVerDestino();
  }
});

async function _init() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) { location.href = "./destinos.html"; return; }

  const wrap = document.getElementById("ver-destino-contenido");
  if (!wrap) return;

  wrap.innerHTML = `<div class="loading" style="padding:120px 0"><div class="spinner"></div>Cargando destino...</div>`;

  const d = await getDestino(id);
  if (!d || d.activo === false) { location.href = "./destinos.html"; return; }

  document.title = `${d.nombre} — Viajes La Maleta`;
  const bc = document.getElementById("bc-nombre");
  if (bc) bc.textContent = d.nombre;

  listenSettings(s => {
    const num = s.whatsapp || "5491100000000";
    buildWhatsApp(num, "Hola, quiero información sobre un viaje");
    renderDestino(d, wrap, num, `Hola, quiero información sobre el viaje a ${d.nombre}`);
  });
}

function renderDestino(d, wrap, waNum, waMsg) {
  _injectCarouselCSS();

  const waUrl      = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  const imgs       = Array.isArray(d.imagenes) && d.imagenes.length > 0
                       ? d.imagenes
                       : (d.imagen ? [d.imagen] : ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85"]);
  const incluye    = Array.isArray(d.incluye)    ? d.incluye    : [];
  const itinerario = Array.isArray(d.itinerario) ? d.itinerario : [];
  const precio     = (d.precio || 0).toLocaleString("es-AR");

  _carouselIndex = 0;
  _carouselTotal = imgs.length;
  clearInterval(_carouselTimer);

  wrap.innerHTML = `
    <div class="vd-carousel" id="vd-carousel">
      <div class="vd-carousel-track">
        ${imgs.map((src, i) => `
          <div class="vd-slide${i === 0 ? ' active' : ''}" data-index="${i}">
            <img src="${i === 0 ? src : ''}" data-src="${src}"
                 alt="${d.nombre} — foto ${i + 1}"${i > 0 ? ' class="lazy"' : ''}>
            <div class="vd-hero-ov"></div>
          </div>`).join("")}
      </div>

      <div class="vd-hero-info">
        ${d.categoria ? `<span class="vd-tag">${d.categoria}</span>` : ""}
        <h1>${d.nombre}</h1>
        <div class="vd-meta">
          ${d.duracion   ? `<span>📅 ${d.duracion}</span>`    : ""}
          ${d.dificultad ? `<span>⚡ ${d.dificultad}</span>` : ""}
          ${d.precio     ? `<span>💲 desde $${precio}</span>` : ""}
        </div>
      </div>

      ${imgs.length > 1 ? `
        <button class="vd-carousel-btn vd-prev" onclick="carouselMove(-1)" aria-label="Anterior">&#8249;</button>
        <button class="vd-carousel-btn vd-next" onclick="carouselMove(1)"  aria-label="Siguiente">&#8250;</button>
        <div class="vd-dots">
          ${imgs.map((_, i) => `<button class="vd-dot${i === 0 ? ' active' : ''}" onclick="carouselGoTo(${i})"></button>`).join("")}
        </div>
        <div class="vd-counter"><span id="vd-cur">1</span> / ${imgs.length}</div>
      ` : ""}
    </div>

    <div class="vd-layout">
      <div class="vd-main">

        <div class="vd-section">
          <h2>Sobre este destino</h2>
          <p>${d.descripcion || d.descripcionCorta || ""}</p>
        </div>

        ${incluye.length ? `
        <div class="vd-section">
          <h2>¿Qué incluye?</h2>
          <ul class="vd-includes">${incluye.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>` : ""}

        ${itinerario.length ? `
        <div class="vd-section">
          <h2>Itinerario día a día</h2>
          <div class="vd-itinerario">
            ${itinerario.map((dia, i) => `
              <div class="vd-dia">
                <div class="vd-dia-num">${i + 1}</div>
                <div class="vd-dia-body">
                  <h3>${dia.titulo || `Día ${i + 1}`}</h3>
                  <p>${dia.descripcion || ""}</p>
                </div>
              </div>`).join("")}
          </div>
        </div>` : ""}

        <div class="vd-section" id="form-consulta">
          <h2>¿Te interesa este destino?</h2>
          <p style="color:var(--text-l);margin-bottom:24px">Completá el formulario y te contactamos a la brevedad.</p>
          <div class="form-box">
            <input type="text" id="hp-field" name="website" tabindex="-1" autocomplete="off"
                   style="position:absolute;left:-9999px;opacity:0;height:0;pointer-events:none">
            <div class="form-row">
              <div class="form-field"><label>Nombre *</label><input type="text" id="vd-nombre" placeholder="Tu nombre" maxlength="100"></div>
              <div class="form-field"><label>Email *</label><input type="email" id="vd-email" placeholder="tu@email.com"></div>
            </div>
            <div class="form-field">
              <label>Teléfono <span style="font-weight:400">(opcional)</span></label>
              <input type="tel" id="vd-tel" placeholder="+54 9 11 0000-0000">
            </div>
            <div class="form-field">
              <label>Mensaje</label>
              <textarea id="vd-msg" rows="3">Hola, me interesa el viaje a ${d.nombre}. ¿Podría darme más información?</textarea>
            </div>
            <button class="form-submit" id="vd-submit"
              onclick="enviarConsulta('${d.nombre.replace(/'/g,"\\'")}','${d.id}')">
              Enviar consulta
            </button>
            <div class="form-success" id="vd-ok">✅ ¡Gracias! Te contactamos en las próximas horas.</div>
            <div class="form-error"   id="vd-err"></div>
          </div>
        </div>

      </div>

      <aside class="vd-sidebar">
        <div class="vd-box">
          <div class="vd-precio">desde $${precio}</div>
          <div class="vd-precio-sub">por persona${d.duracion ? " · " + d.duracion : ""}</div>
          <button class="vd-cta-btn"
            onclick="document.getElementById('form-consulta').scrollIntoView({behavior:'smooth'})">
            📋 Consultar disponibilidad
          </button>
          <a class="vd-wa-btn" href="${waUrl}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Consultar por WhatsApp
          </a>
          <div class="vd-detalles">
            ${d.duracion   ? `<div class="vd-det-row"><span>⏱</span><span>${d.duracion}</span></div>`   : ""}
            ${d.categoria  ? `<div class="vd-det-row"><span>🌍</span><span>${d.categoria}</span></div>`  : ""}
            ${d.dificultad ? `<div class="vd-det-row"><span>⚡</span><span>${d.dificultad}</span></div>` : ""}
            <div class="vd-det-row"><span>🛡️</span><span>Pago seguro garantizado</span></div>
            <div class="vd-det-row"><span>📞</span><span>Atención personalizada</span></div>
          </div>
        </div>
      </aside>
    </div>`;

  if (imgs.length > 1) _initCarousel();
}

// ─── Lógica del carrusel ──────────────────────────────────
function _initCarousel() {
  _carouselGoTo(0);
  _carouselTimer = setInterval(() => carouselMove(1), 5000);
  const el = document.getElementById("vd-carousel");
  if (el) {
    el.addEventListener("mouseenter", () => clearInterval(_carouselTimer));
    el.addEventListener("mouseleave", () => {
      _carouselTimer = setInterval(() => carouselMove(1), 5000);
    });
    // Swipe móvil
    let startX = 0;
    el.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener("touchend",   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) carouselMove(diff > 0 ? 1 : -1);
    });
  }
}

function _carouselGoTo(index) {
  const slides = document.querySelectorAll(".vd-slide");
  const dots   = document.querySelectorAll(".vd-dot");
  const curEl  = document.getElementById("vd-cur");
  if (!slides.length) return;

  // Lazy load
  const lazyImg = slides[index]?.querySelector("img.lazy");
  if (lazyImg?.dataset.src) { lazyImg.src = lazyImg.dataset.src; lazyImg.classList.remove("lazy"); }

  slides.forEach((s, i) => s.classList.toggle("active", i === index));
  dots.forEach((d, i)   => d.classList.toggle("active", i === index));
  if (curEl) curEl.textContent = index + 1;
  _carouselIndex = index;
}

window.carouselMove = (dir)   => _carouselGoTo((_carouselIndex + dir + _carouselTotal) % _carouselTotal);
window.carouselGoTo = (index) => _carouselGoTo(index);

// ─── Formulario ───────────────────────────────────────────
window.enviarConsulta = async function(destino, destinoId) {
  if (document.getElementById("hp-field")?.value) return;
  const limit = checkRateLimit("vd-consulta", 3, 60000);
  if (limit.blocked) { mostrarErr(limit.message); return; }

  const nombre = sanitize(document.getElementById("vd-nombre").value.trim());
  const email  = sanitize(document.getElementById("vd-email").value.trim());
  const tel    = sanitize(document.getElementById("vd-tel").value.trim());
  const msg    = sanitize(document.getElementById("vd-msg").value.trim());

  const errors = validateContactForm({ nombre, email, tel, mensaje: msg || "consulta" });
  if (errors.length) { mostrarErr(errors[0]); return; }

  const btn = document.getElementById("vd-submit");
  btn.disabled = true; btn.textContent = "Enviando...";
  document.getElementById("vd-err").classList.remove("show");

  try {
    await saveConsulta({ nombre, email, tel, mensaje: msg, destino, destinoId, origen: "ver-destino" });
    document.getElementById("vd-ok").classList.add("show");
    btn.textContent = "Enviado ✓";
  } catch(e) {
    mostrarErr("Hubo un error. Intentá de nuevo o escribinos por WhatsApp.");
    btn.disabled = false; btn.textContent = "Enviar consulta";
  }
};

function mostrarErr(msg) {
  const el = document.getElementById("vd-err");
  if (!el) return;
  el.textContent = "❌ " + msg;
  el.classList.add("show");
}