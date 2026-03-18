// ============================================================
//  componentes/informacion.js
//  Página de Información / Experiencias
//  Muestra las experiencias cargadas desde Firebase
// ============================================================
import { listenExperiencias, listenContent, listenSettings } from "../firebase.js";
import { initShared, applyContent, buildWhatsApp } from "./_shared.js";

window.addEventListener("DOMContentLoaded", () => {
  initShared();
  listenContent(applyContent);

  listenExperiencias(items => {
    renderExperiencias(items.filter(e => e.activo !== false));
  });

  listenSettings(s => {
    if (s.whatsapp) buildWhatsApp(s.whatsapp, s.whatsappMsg);
  });
});

function renderExperiencias(items) {
  const el = document.getElementById("exp-grid");
  if (!el) return;

  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
        <p>No hay experiencias disponibles todavía.<br>¡Volvé pronto!</p>
      </div>`;
    return;
  }

  el.innerHTML = `<div class="exp-grid-wrap">${items.map(card).join("")}</div>`;
}

function card(e) {
  const img = e.imagen || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80";
  return `
    <div class="exp-card">
      <div class="exp-img">
        <img src="${img}" alt="${e.nombre}" loading="lazy">
      </div>
      <div class="exp-body">
        <span class="exp-tag">${e.categoria || "Experiencia"}</span>
        <div class="exp-name">${e.nombre}</div>
        <div class="exp-desc">${e.descripcion || ""}</div>
        <a href="./contacto.html?destino=${encodeURIComponent(e.nombre)}" class="exp-btn">
          Solicitar información
        </a>
      </div>
    </div>`;
}
