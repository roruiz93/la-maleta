// ============================================================
//  componentes/ver-destino.js
//  Detalle de un destino — lee ?id= y muestra toda su info
// ============================================================
import { getDestino, listenSettings, saveConsulta } from "../firebase.js";
import { initShared, buildWhatsApp } from "./_shared.js";
import { sanitize, validateContactForm, checkRateLimit } from "../security.js";

window.addEventListener("DOMContentLoaded", async () => {
  initShared();

  const id = new URLSearchParams(location.search).get("id");
  if (!id) { location.href = "./destinos.html"; return; }

  // Mostrar spinner mientras carga
  document.getElementById("vd-wrap").innerHTML = `
    <div class="loading" style="padding:120px 0">
      <div class="spinner"></div>Cargando destino...
    </div>`;

  const d = await getDestino(id);
  if (!d || d.activo === false) { location.href = "./destinos.html"; return; }

  // Título de pestaña + breadcrumb
  document.title = `${d.nombre} — Viajes La Maleta`;
  const bc = document.getElementById("bc-destino");
  if (bc) bc.textContent = d.nombre;

  // Esperar settings para tener el número de WA correcto en la página
  listenSettings(s => {
    const num = s.whatsapp || "5491100000000";
    const msg = `Hola, quiero información sobre el viaje a ${d.nombre}`;
    buildWhatsApp(num, `Hola, quiero información sobre un viaje`);
    renderDestino(d, num, msg);
  });
});

// ─── Render completo del destino ─────────────────────────
function renderDestino(d, waNum, waMsg) {
  const wrap = document.getElementById("vd-wrap");
  if (!wrap) return;

  const waUrl      = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  const galeria    = Array.isArray(d.galeria)     ? d.galeria     : [];
  const incluye    = Array.isArray(d.incluye)     ? d.incluye     : [];
  const itinerario = Array.isArray(d.itinerario)  ? d.itinerario  : [];
  const precio     = (d.precio || 0).toLocaleString("es-AR");

  wrap.innerHTML = `
    <!-- Hero con imagen del destino -->
    <div class="vd-hero">
      <img src="${d.imagen || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85"}"
           alt="${d.nombre}">
      <div class="vd-hero-ov"></div>
      <div class="vd-hero-info">
        ${d.categoria ? `<span class="vd-tag">${d.categoria}</span>` : ""}
        <h1>${d.nombre}</h1>
        <div class="vd-meta">
          ${d.duracion   ? `<span>📅 ${d.duracion}</span>`   : ""}
          ${d.dificultad ? `<span>⚡ ${d.dificultad}</span>` : ""}
          ${d.precio     ? `<span>💲 desde $${precio}</span>` : ""}
        </div>
      </div>
    </div>

    <!-- Layout: contenido + sidebar -->
    <div class="vd-layout">

      <!-- ── Columna principal ── -->
      <div class="vd-main">

        <div class="vd-section">
          <h2>Sobre este destino</h2>
          <p>${d.descripcion || d.descripcionCorta || ""}</p>
        </div>

        ${incluye.length ? `
        <div class="vd-section">
          <h2>¿Qué incluye?</h2>
          <ul class="vd-includes">
            ${incluye.map(i => `<li>${i}</li>`).join("")}
          </ul>
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

        ${galeria.length ? `
        <div class="vd-section">
          <h2>Galería de fotos</h2>
          <div class="vd-galeria">
            ${galeria.map((src, i) => `
              <img src="${src}" alt="Foto ${i + 1}" loading="lazy"
                   onclick="abrirFoto('${src}','${d.nombre}')">`).join("")}
          </div>
        </div>` : ""}

        <!-- Formulario de consulta -->
        <div class="vd-section" id="form-consulta">
          <h2>¿Te interesa este destino?</h2>
          <p style="color:var(--text-l);margin-bottom:24px">
            Completá el formulario y te contactamos a la brevedad.
          </p>
          <div class="form-box">
            <!-- Honeypot anti-bot (invisible) -->
            <input type="text" id="hp-field" name="website" tabindex="-1" autocomplete="off"
                   style="position:absolute;left:-9999px;opacity:0;height:0;pointer-events:none">
            <div class="form-row">
              <div class="form-field">
                <label>Nombre *</label>
                <input type="text" id="vd-nombre" placeholder="Tu nombre" maxlength="100">
              </div>
              <div class="form-field">
                <label>Email *</label>
                <input type="email" id="vd-email" placeholder="tu@email.com">
              </div>
            </div>
            <div class="form-field">
              <label>Teléfono <span style="font-weight:400;text-transform:none">(opcional)</span></label>
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

      </div><!-- /vd-main -->

      <!-- ── Sidebar ── -->
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

    </div><!-- /vd-layout -->`;

  // Lightbox para galería
  window.abrirFoto = function(src, alt) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `
      <div class="lb-bg" onclick="this.parentElement.remove()"></div>
      <img src="${src}" alt="${alt}">
      <button class="lb-x" onclick="this.parentElement.remove()">×</button>`;
    document.body.appendChild(lb);
  };
}

// ─── Envío del formulario ─────────────────────────────────
window.enviarConsulta = async function(destino, destinoId) {
  const hp = document.getElementById("hp-field");
  if (hp?.value) return; // bot detectado

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
