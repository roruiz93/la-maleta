// ============================================================
//  la-maleta-web — Página pública
//  Solo LECTURA de Firebase. Cero código de administración.
// ============================================================

import { listenContent, listenColors, listenImages } from "./firebase.js";
import { translations, langMeta } from "./i18n.js";

// ─── Estado ───────────────────────────────────────────────
let currentLang   = localStorage.getItem("lm_lang") || "es";
let remoteContent = {};

// ─── Arranque ─────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  buildLangSwitcher();
  applyLang(currentLang, false);
  startListeners();
  document.documentElement.lang = currentLang;
});

// ─── Listeners en tiempo real ─────────────────────────────
function startListeners() {
  listenContent((data) => {
    if (data) { remoteContent = data; applyLang(currentLang, false); }
  });
  listenColors((data) => applyColors(data));
  listenImages((data) => applyImages(data));
}

// ─── Idioma ───────────────────────────────────────────────
function buildLangSwitcher() {
  const wrap = document.getElementById("lang-switcher");
  if (!wrap) return;
  wrap.innerHTML = Object.entries(langMeta).map(([code, meta]) => `
    <button
      class="lang-btn ${code === currentLang ? "active" : ""}"
      onclick="switchLang('${code}')"
      title="${meta.label}"
    >${meta.flag} ${meta.label}</button>
  `).join("");
}

window.switchLang = function (code) {
  if (!translations[code]) return;
  currentLang = code;
  localStorage.setItem("lm_lang", code);
  document.documentElement.lang = code;
  applyLang(code, true);
  buildLangSwitcher();
};

function applyLang(lang, animate) {
  const base   = translations[lang] || translations["es"];
  const saved  = remoteContent[lang] || {};
  const merged = { ...base, ...saved };

  document.querySelectorAll("[data-field]").forEach((el) => {
    const key = el.dataset.field;
    if (merged[key] === undefined) return;
    if (animate) {
      el.style.opacity   = "0";
      el.style.transform = "translateY(6px)";
      el.style.transition = "opacity .25s, transform .25s";
      setTimeout(() => {
        el.innerHTML       = merged[key];
        el.style.opacity   = "1";
        el.style.transform = "translateY(0)";
      }, 100);
    } else {
      el.innerHTML = merged[key];
    }
  });
}

// ─── Colores ──────────────────────────────────────────────
function applyColors(data) {
  if (!data) return;
  const map = { gold:"--gold", bg:"--bg", text:"--text", primary:"--primary", cardBg:"--card-bg" };
  Object.entries(map).forEach(([k, v]) => {
    if (data[k]) document.documentElement.style.setProperty(v, data[k]);
  });
}

// ─── Imágenes ─────────────────────────────────────────────
function applyImages(data) {
  if (!data) return;
  document.querySelectorAll("[data-img]").forEach((img) => {
    const key = img.dataset.img;
    if (data[key]) img.src = data[key];
  });
}

// ─── Destinos destacados (home) ───────────────────────────
// Conecta botones "Ver más" con IDs reales de Firebase
import { listenDestinos, listenSettings } from "./firebase.js";
import { buildWhatsApp, updateFooterFromSettings } from "./componentes/ver-destino.js";

let _destinosIds = [];

listenDestinos((items) => {
  _destinosIds = items.map(d => d.id);
  console.log(import.meta.env)
  // Reasignar onclick de botones .ver-btn con IDs reales
  document.querySelectorAll(".ver-btn").forEach((btn, i) => {
    btn.onclick = () => {
      const id = _destinosIds[i];
      window.location.href = id ? `./ver-destino.html?id=${id}` : "./destinos.html";
    };
  });
});

listenSettings((s) => {
  buildWhatsApp(s.whatsapp, s.whatsappMsg);
  updateFooterFromSettings(s);
});
