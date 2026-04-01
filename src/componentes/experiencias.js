// ============================================================
//  experiencias.js — Cargar experiencias desde Firebase
// ============================================================

import { getExperiencias } from "../firebase.js";
import { translations, getCurrentLang } from "../i18n.js";

// Cargar experiencias al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🎯 Cargando experiencias...");
  await cargarExperiencias();
});

async function cargarExperiencias() {
  const container = document.getElementById("exp-grid");
  if (!container) return;

  try {
    // Obtener experiencias desde Firebase
    const experiencias = await getExperiencias();
    console.log("📋 Experiencias obtenidas:", experiencias);

    // Si no hay experiencias, mostrar mensaje
    if (!experiencias || experiencias.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p data-field="exp-empty">No hay experiencias disponibles todavía.<br>¡Volvé pronto!</p>
        </div>
      `;
      return;
    }

    // Filtrar solo experiencias activas
    const activas = experiencias.filter(exp => exp.activo !== false);

    if (activas.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p data-field="exp-empty">No hay experiencias disponibles todavía.<br>¡Volvé pronto!</p>
        </div>
      `;
      return;
    }

    // Generar HTML para cada experiencia
    container.innerHTML = activas.map(exp => {
      const imagen = exp.imagen || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";
      const categoria = exp.categoria || getCurrentTranslation("exp-categoria-default");

      return `
        <div class="exp-card">
          <div class="exp-card-img">
            <img src="${imagen}" alt="${exp.nombre}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'">
            <div class="exp-card-cat">${categoria}</div>
          </div>
          <div class="exp-card-body">
            <h3 class="exp-card-title">${exp.nombre}</h3>
            <p class="exp-card-desc">${exp.descripcion || ""}</p>
            <button class="btn-outline" data-field="exp-solicitar">Solicitar información</button>
          </div>
        </div>
      `;
    }).join("");

    console.log("✅ Experiencias cargadas exitosamente");

  } catch (error) {
    console.error("❌ Error cargando experiencias:", error);
    container.innerHTML = `
      <div class="error-state">
        <p>Error cargando experiencias. Por favor, recarga la página.</p>
      </div>
    `;
  }
}

// Helper para obtener traducción actual
function getCurrentTranslation(key) {
  const lang = getCurrentLang();
  return translations[lang]?.[key] || translations['es']?.[key] || key;
}