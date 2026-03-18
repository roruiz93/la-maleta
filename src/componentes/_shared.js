// ============================================================
//  componentes/_shared.js
//  Helpers que usan TODAS las páginas internas
//  (colores, lang switcher, WhatsApp flotante, footer, nav activo)
// ============================================================
import { listenColors, listenSettings } from "../firebase.js";
import { langMeta } from "../i18n.js";

export function initShared() {
  // Año en footer
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Colores desde Firebase (con caché local)
  try {
    const saved = localStorage.getItem("lm_colors");
    if (saved) applyColors(JSON.parse(saved));
  } catch(e) {}
  listenColors(data => { applyColors(data); try { localStorage.setItem("lm_colors", JSON.stringify(data)); } catch(e) {} });

  // Settings: WhatsApp + footer
  listenSettings(s => {
    buildWhatsApp(s.whatsapp, s.whatsappMsg);
    const map = { "footer-tel": s.tel, "footer-email": s.email, "footer-addr": s.addr, "footer-hours": s.hours };
    Object.entries(map).forEach(([id, val]) => {
      if (!val) return;
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });
  });

  // Lang switcher
  const lang = localStorage.getItem("lm_lang") || "es";
  document.querySelectorAll(".lang-switcher").forEach(wrap => {
    wrap.innerHTML = Object.entries(langMeta).map(([code, m]) =>
      `<button class="lang-btn ${code === lang ? "active" : ""}" onclick="switchLang('${code}')">${m.flag} ${m.label}</button>`
    ).join("");
  });

  // Marcar nav activo
  const page = location.pathname.split("/").pop();
  document.querySelectorAll("nav a, .mobile-menu a").forEach(a => {
    const href = (a.getAttribute("href") || "").replace("./", "");
    if (href && href === page) a.classList.add("nav-active");
  });

  // Funciones globales
  window.switchLang = c => { localStorage.setItem("lm_lang", c); location.reload(); };
  window.toggleMenu = () => document.getElementById("mobile-menu")?.classList.toggle("open");
}

// ─── Aplicar colores CSS ──────────────────────────────────
export function applyColors(data) {
  if (!data) return;
  const map = { gold:"--gold", bg:"--bg", text:"--text", primary:"--primary", cardBg:"--card-bg" };
  Object.entries(map).forEach(([k, v]) => { if (data[k]) document.documentElement.style.setProperty(v, data[k]); });
}

// ─── WhatsApp flotante ────────────────────────────────────
export function buildWhatsApp(numero, mensaje) {
  const num = numero || "5491100000000";
  const msg = mensaje || "Hola, quiero información sobre un viaje";
  const url = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  let btn = document.getElementById("wa-float");
  if (!btn) {
    btn = document.createElement("a");
    btn.id = "wa-float"; btn.target = "_blank"; btn.rel = "noopener";
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span>WhatsApp</span>`;
    document.body.appendChild(btn);
  }
  btn.href = url;
}

// ─── Aplica data-field desde Firestore ────────────────────
export function applyContent(data) {
  const lang = localStorage.getItem("lm_lang") || "es";
  const c = data?.[lang] || {};
  document.querySelectorAll("[data-field]").forEach(el => {
    if (c[el.dataset.field] !== undefined) el.innerHTML = c[el.dataset.field];
  });
}
