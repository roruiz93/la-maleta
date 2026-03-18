// ============================================================
//  security.js — Capa de seguridad del sitio web
//  XSS, spam, rate limiting, sanitización
// ============================================================

// ─── SANITIZACIÓN contra XSS ─────────────────────────────
// Elimina HTML y scripts maliciosos de cualquier input
export function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/=/g, "&#x3D;")
    .slice(0, 2000); // Límite de longitud
}

// Sanitiza un objeto completo (todos sus campos string)
export function sanitizeObject(obj) {
  const clean = {};
  for (const [key, val] of Object.entries(obj)) {
    clean[key] = typeof val === "string" ? sanitize(val) : val;
  }
  return clean;
}

// ─── VALIDACIÓN de emails ─────────────────────────────────
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ─── VALIDACIÓN de teléfono ───────────────────────────────
export function isValidPhone(phone) {
  if (!phone) return true; // opcional
  return /^[\d\s\+\-\(\)]{7,20}$/.test(phone);
}

// ─── RATE LIMITING (en memoria del navegador) ─────────────
// Evita que alguien envíe muchos formularios seguidos
const rateLimits = {};

export function checkRateLimit(action, maxAttempts = 3, windowMs = 60000) {
  const now = Date.now();
  const key = `rl_${action}`;

  if (!rateLimits[key]) {
    rateLimits[key] = { count: 0, resetAt: now + windowMs };
  }

  const limit = rateLimits[key];

  // Resetear si pasó la ventana de tiempo
  if (now > limit.resetAt) {
    limit.count = 0;
    limit.resetAt = now + windowMs;
  }

  limit.count++;

  if (limit.count > maxAttempts) {
    const remaining = Math.ceil((limit.resetAt - now) / 1000);
    return {
      blocked: true,
      message: `Demasiados intentos. Esperá ${remaining} segundos.`
    };
  }

  return { blocked: false };
}

// ─── HONEYPOT anti-bot ────────────────────────────────────
// Campo invisible que los bots llenan pero los humanos no
export function createHoneypot() {
  const field = document.createElement("div");
  field.style.cssText = "position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;overflow:hidden;";
  field.innerHTML = `<input type="text" name="website" id="hp-field" tabindex="-1" autocomplete="off">`;
  return field;
}

export function isBot() {
  const hp = document.getElementById("hp-field");
  return hp && hp.value.length > 0;
}

// ─── TIEMPO MÍNIMO antes de enviar ────────────────────────
// Los bots envían formularios en milisegundos; los humanos tardan más
let formOpenedAt = {};

export function markFormOpened(formId) {
  formOpenedAt[formId] = Date.now();
}

export function formFilledTooFast(formId, minMs = 3000) {
  const opened = formOpenedAt[formId];
  if (!opened) return false;
  return (Date.now() - opened) < minMs;
}

// ─── VALIDACIÓN completa de formulario de contacto ────────
export function validateContactForm(data) {
  const errors = [];

  if (!data.nombre || data.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }
  if (data.nombre && data.nombre.trim().length > 100) {
    errors.push("El nombre es demasiado largo");
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("El email no es válido");
  }
  if (data.tel && !isValidPhone(data.tel)) {
    errors.push("El teléfono no es válido");
  }
  if (data.mensaje && data.mensaje.length > 1000) {
    errors.push("El mensaje es demasiado largo (máximo 1000 caracteres)");
  }
  // Detectar links sospechosos en el mensaje (spam)
  const spamPatterns = [/https?:\/\//gi, /\bviagra\b/gi, /\bcasino\b/gi, /\bloan\b/gi];
  if (data.mensaje && spamPatterns.some(p => p.test(data.mensaje))) {
    errors.push("El mensaje contiene contenido no permitido");
  }

  return errors;
}

// ─── PROTECCIÓN contra clickjacking ──────────────────────
// Evita que la página sea embebida en un iframe de otro sitio
export function preventClickjacking() {
  if (window.self !== window.top) {
    // Si estamos dentro de un iframe de otro dominio, redirigir
    try {
      if (window.top.location.hostname !== window.location.hostname) {
        window.top.location = window.location;
      }
    } catch(e) {
      // Si no podemos acceder al top (cross-origin), ocultamos el body
      document.body.style.display = "none";
    }
  }
}

// ─── OFUSCAR datos sensibles en el DOM ───────────────────
// Evita que scrapers lean emails/teléfonos directamente del HTML
export function obfuscateEmail(email) {
  // Divide el email para que no sea legible directo en el código
  const [user, domain] = email.split("@");
  return `<span class="ob-email" data-u="${btoa(user)}" data-d="${btoa(domain)}"></span>`;
}

export function initObfuscated() {
  document.querySelectorAll(".ob-email").forEach(el => {
    try {
      const u = atob(el.dataset.u);
      const d = atob(el.dataset.d);
      el.textContent = `${u}@${d}`;
      el.addEventListener("click", () => {
        window.location.href = `mailto:${u}@${d}`;
      });
      el.style.cursor = "pointer";
    } catch(e) {}
  });
}

// ─── CONTENT SECURITY nonce (para scripts inline) ─────────
export function generateNonce() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return btoa(String.fromCharCode(...arr));
}

// ─── LOG de actividad sospechosa ──────────────────────────
// (Solo en desarrollo — en producción se desactiva con drop_console)
export function logSecurity(event, details) {
  console.warn(`[Security] ${event}:`, details);
}
