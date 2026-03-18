// ============================================================
//  componentes/contacto.js
//  Página de contacto con formulario protegido
// ============================================================
import { saveConsulta, listenSettings, listenContent } from "../firebase.js";
import { initShared, applyContent } from "./_shared.js";
import { sanitize, validateContactForm, checkRateLimit } from "../security.js";

window.addEventListener("DOMContentLoaded", () => {
  initShared();
  listenContent(applyContent);

  // Pre-llenar asunto desde query param (ej: llega desde ver-destino)
  const params  = new URLSearchParams(location.search);
  const destino = params.get("destino") || "";
  if (destino) {
    const msgEl = document.getElementById("c-msg");
    if (msgEl) msgEl.value = `Hola, me interesa el viaje a ${decodeURIComponent(destino)}. ¿Podría darme más información?`;
  }

  // Datos de contacto desde Firebase
  listenSettings(s => {
    if (s.whatsapp) {
      const waEl = document.getElementById("c-wa-link");
      if (waEl) {
        const msg = s.whatsappMsg || "Hola, quiero información sobre un viaje";
        waEl.href = `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(msg)}`;
      }
    }
  });
});

// ─── Envío del formulario ─────────────────────────────────
window.enviarContacto = async function() {
  // Honeypot
  const hp = document.getElementById("hp-c");
  if (hp?.value) return;

  // Rate limit
  const limit = checkRateLimit("contacto", 3, 60000);
  if (limit.blocked) { mostrarErr(limit.message); return; }

  const nombre  = sanitize(document.getElementById("c-nombre").value.trim());
  const email   = sanitize(document.getElementById("c-email").value.trim());
  const tel     = sanitize(document.getElementById("c-tel").value.trim());
  const asunto  = sanitize(document.getElementById("c-asunto").value.trim());
  const msg     = sanitize(document.getElementById("c-msg").value.trim());

  const errors = validateContactForm({ nombre, email, tel, mensaje: msg || asunto || "consulta" });
  if (errors.length) { mostrarErr(errors[0]); return; }

  const btn = document.getElementById("c-submit");
  btn.disabled = true; btn.textContent = "Enviando...";
  document.getElementById("c-err").classList.remove("show");

  try {
    await saveConsulta({ nombre, email, tel, asunto, mensaje: msg, origen: "contacto" });
    document.getElementById("c-ok").classList.add("show");
    btn.textContent = "Enviado ✓";
    // Limpiar campos
    ["c-nombre","c-email","c-tel","c-asunto","c-msg"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
  } catch(e) {
    mostrarErr("Hubo un error. Intentá de nuevo o escribinos por WhatsApp.");
    btn.disabled = false; btn.textContent = "Enviar mensaje";
  }
};

function mostrarErr(msg) {
  const el = document.getElementById("c-err");
  if (!el) return;
  el.textContent = "❌ " + msg;
  el.classList.add("show");
}
