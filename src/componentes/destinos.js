// ============================================================
//  componentes/destinos.js
//  Grilla de todos los destinos con filtros por categoría
// ============================================================
import { listenDestinos, listenContent } from "../firebase.js";
import { initShared, applyContent } from "./_shared.js";

let todos  = [];
let filtro = "todos";

window.addEventListener("DOMContentLoaded", () => {
  initShared();
  listenContent(applyContent);

  listenDestinos(items => {
    todos = items.filter(d => d.activo !== false);
    renderFiltros();
    renderGrid(todos);
  });
});

// ─── Filtros por categoría ────────────────────────────────
function renderFiltros() {
  const wrap = document.getElementById("filtros");
  if (!wrap) return;
  const cats = ["todos", ...new Set(todos.map(d => d.categoria).filter(Boolean))];
  if (cats.length <= 2) { wrap.innerHTML = ""; return; }
  wrap.innerHTML = cats.map(c => `
    <button class="filtro-btn ${c === filtro ? "active" : ""}" onclick="filtrarDest('${c}')">
      ${c === "todos" ? "Todos" : c}
    </button>`).join("");
}

window.filtrarDest = function(cat) {
  filtro = cat;
  renderFiltros();
  renderGrid(cat === "todos" ? todos : todos.filter(d => d.categoria === cat));
};

// ─── Grilla de cards ──────────────────────────────────────
function renderGrid(items) {
  const el = document.getElementById("dest-grid");
  if (!el) return;
  if (!items.length) {
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 16l4.553 2.276A1 1 0 0021 24.382V8.618a1 1 0 00-.553-.894L15 5m0 18V5m0 0L9 7"/>
        </svg>
        <p>No hay destinos en esta categoría todavía.</p>
      </div>`;
    return;
  }
  el.innerHTML = `<div class="destinos-page-grid">${items.map(cardDestino).join("")}</div>`;
}

export function cardDestino(d) {
  const img    = d.imagen || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
  const desc   = d.descripcionCorta || (d.descripcion || "").slice(0, 90);
  const precio = (d.precio || 0).toLocaleString("es-AR");
  return `
    <a class="destino-card-full" href="./ver-destino.html?id=${d.id}">
      <div class="dcf-img">
        <img src="${img}" alt="${d.nombre}" loading="lazy">
        ${d.categoria ? `<span class="dcf-badge">${d.categoria}</span>` : ""}
      </div>
      <div class="dcf-body">
        <div class="dcf-name">${d.nombre}</div>
        <div class="dcf-desc">${desc}</div>
        <div class="dcf-footer">
          <span class="dcf-price">desde $${precio}</span>
          <span class="dcf-btn">Ver destino →</span>
        </div>
      </div>
    </a>`;
}
