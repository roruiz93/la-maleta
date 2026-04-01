// i18n compatible - sin imports ES6
(function() {

// Traducciones completas desde los archivos JSON originales
const es = {
  "nav1": "Destinos", "nav2": "Experiencias", "nav3": "Nosotros", "nav4": "Blog", "nav5": "Contacto",
  "nav-cta": "Solicitá información", "hero-h1": "Organizamos los viajes<br>que siempre soñaste",
  "hero-sub": "Descubrí destinos únicos con un trato cercano y personalizado", "hero-btn1": "Ver Destinos", "hero-btn2": "Sobre Nosotros",
  "dest-title": "Destinos Destacados", "d1-name": "Noruega", "d1-desc": "7 Días, desde $1200", "d1-btn": "Ver más",
  "d2-name": "Japón", "d2-desc": "7 Días, desde $1200", "d2-btn": "Ver más",
  "d3-name": "Maldivas", "d3-desc": "7 Días, desde $1200", "d3-btn": "Ver más",
  "d4-name": "Patagonia", "d4-desc": "7 Días, desde $1200", "d4-btn": "Ver más",
  "ver-todos": "Ver Todos los Viajes  ›", "pq-title": "¿Por Qué Elegirnos?",
  "pq1": "Atención Personalizada", "pq2": "Viajes a tu Medida", "pq3": "Seguridad y Confianza", "pq4": "20 Años de Experiencia",
  "test-title": "Testimonios de Nuestros Viajeros", "t1-name": "Laura Gómez", "t1-text": "\"Un viaje increíble, superado todas nuestras expectativas!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"Una experiencia inolvidable, atención de primera!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"Sin duda volveremos a viajar con ustedes, todo perfecto.\"",
  "cta-h": "Solicitá información sobre tu próximo viaje", "cta-p": "¿Listo para tu próxima aventura? Contactanos y te ayudaremos a planear el viaje perfecto.",
  "cta-btn": "Solicitá información", "exp-solicitar": "Solicitar información", "exp-categoria-default": "Experiencia",
  "exp-empty": "No hay experiencias disponibles todavía.<br>¡Volvé pronto!", "f-addr": "Buenos Aires, Argentina",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-hours": "Lun–Vie 9:00–18:00",
  "lang-label": "Idioma", "logo": "La Maleta", "footer-slogan": "Viajes que te cambian la vida",
  "breadcrumb-inicio": "Inicio", "breadcrumb-destinos": "Destinos", "breadcrumb-destino": "Destino", "breadcrumb-experiencias": "Experiencias",
  "loading-destino": "Cargando destino...", "loading-experiencias": "Cargando experiencias...",
  "contacto-info-h": "¿En qué podemos ayudarte?", "contacto-info-p": "Ya sea que estés buscando un destino específico, querés armar un viaje a medida o simplemente tenés dudas — estamos acá para ayudarte en cada paso.",
  "wa-btn-txt": "Escribinos por WhatsApp", "form-titulo": "Envianos tu consulta", "form-subtitulo": "Completá el formulario y te respondemos a la brevedad.",
  "form-nombre": "Nombre *", "form-nombre-placeholder": "Tu nombre", "form-email": "Email *", "form-email-placeholder": "tu@email.com",
  "form-telefono": "Teléfono (opcional)", "form-telefono-placeholder": "+54 9 11 0000-0000", "form-asunto": "Asunto", "form-asunto-placeholder": "¿En qué te podemos ayudar?",
  "form-mensaje": "Mensaje *", "form-mensaje-placeholder": "Contanos sobre el viaje que estás buscando...", "form-enviar": "Enviar mensaje",
  "form-success": "✅ ¡Gracias por tu mensaje! Te contactamos en las próximas 24 horas.", "exp-hero-tag": "Lo que ofrecemos",
  "exp-hero-h1": "Experiencias Únicas", "exp-hero-p": "Más que un viaje — momentos que recordarás toda la vida.",
  "breadcrumb-contacto": "Contacto", "breadcrumb-nosotros": "Nosotros", "contacto-tag": "Estamos para ayudarte", "contacto-h1": "Contactanos",
  "contacto-sub": "Respondemos en menos de 24 horas. Planifiquemos juntos tu próximo viaje.", "nos-hero-tag": "Quiénes somos", "nos-hero-h1": "Sobre Nosotros",
  "nos-hero-p": "Un equipo apasionado por los viajes, comprometido con tu experiencia.", "nos-titulo": "Viajamos para que vos viajes mejor",
  "nos-p1": "Somos una agencia boutique fundada con un solo propósito: diseñar viajes que se adapten a cada persona. Creemos que cada viajero es único, y por eso cada itinerario también lo es.",
  "nos-p2": "Trabajamos con proveedores locales en cada destino, asegurándonos de que tu experiencia sea auténtica, sostenible y memorable.",
  "nos-p3": "Más de 10 años organizando viajes nos enseñaron que los detalles hacen la diferencia. Desde el traslado del aeropuerto hasta la reserva de ese restaurant especial — nos ocupamos de todo.",
  "nos-btn": "Hablemos de tu próximo viaje", "stat1": "+500", "stat1-lbl": "Viajeros felices", "stat2": "+40", "stat2-lbl": "Destinos disponibles",
  "stat3": "10+", "stat3-lbl": "Años de experiencia", "stat4": "98%", "stat4-lbl": "Clientes satisfechos", "valores-titulo": "Nuestros valores",
  "val1-titulo": "Pasión por viajar", "val1-texto": "Cada destino que recomendamos lo vivimos primero.", "val2-titulo": "Confianza", "val2-texto": "Transparencia total en precios y condiciones.",
  "val3-titulo": "Atención personalizada", "val3-texto": "Un asesor dedicado para cada viajero.", "val4-titulo": "Turismo responsable", "val4-texto": "Viajamos respetando las comunidades y el medioambiente.",
  "equipo-titulo": "Nuestro equipo", "e1-nombre": "Ana García", "e1-rol": "Fundadora & Directora", "e2-nombre": "Carlos Méndez", "e2-rol": "Asesor de viajes",
  "e3-nombre": "Laura Torres", "e3-rol": "Especialista Europa", "e4-nombre": "Martín López", "e4-rol": "Especialista Asia & Oceanía",
  "nos-cta-h": "¿Listo para tu próxima aventura?", "nos-cta-p": "Contactanos y armamos el viaje perfecto para vos.", "nos-cta-btn": "Hablemos",
  "blog-hero-tag": "Blog", "blog-hero-h1": "Consejos e Inspiración para Viajeros", "blog-hero-p": "Historias, consejos y guías de viaje para tu próxima aventura.",
  "breadcrumb-blog": "Blog"
};

const ca = {
  "nav1": "Destinacions", "nav2": "Experiències", "nav3": "Nosaltres", "nav4": "Blog", "nav5": "Contacte",
  "nav-cta": "Sol·licita informació", "hero-h1": "Organitzem els viatges<br>que sempre has somiat",
  "hero-sub": "Descobreix destinacions úniques amb un tracte proper i personalitzat", "hero-btn1": "Veure Destinacions", "hero-btn2": "Sobre Nosaltres",
  "dest-title": "Destinacions Destacades", "d1-name": "Noruega", "d1-desc": "7 Dies, des de $1200", "d1-btn": "Veure més",
  "d2-name": "Japó", "d2-desc": "7 Dies, des de $1200", "d2-btn": "Veure més",
  "d3-name": "Maldives", "d3-desc": "7 Dies, des de $1200", "d3-btn": "Veure més",
  "d4-name": "Patagònia", "d4-desc": "7 Dies, des de $1200", "d4-btn": "Veure més",
  "ver-todos": "Veure Tots els Viatjes  ›", "pq-title": "Per Què Triar-nos?",
  "pq1": "Atenció Personalitzada", "pq2": "Viatges a la teva Mida", "pq3": "Seguretat i Confiança", "pq4": "20 Anys d'Experiència",
  "test-title": "Testimonis dels Nostres Viatgers", "t1-name": "Laura Gómez", "t1-text": "\"Un viatge increïble, ha superat totes les nostres expectatives!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"Una experiència inoblidable, atenció de primera!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"Sens dubte tornarem a viatjar amb vosaltres, tot perfecte.\"",
  "cta-h": "Sol·licita informació sobre el teu proper viatge", "cta-p": "Preparat per la teva propera aventura? Contacta'ns i t'ajudarem a planificar el viatge perfecte.",
  "cta-btn": "Sol·licita informació", "logo": "La Maleta", "footer-slogan": "Viatges que et canvien la vida",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-addr": "Buenos Aires, Argentina", "f-hours": "Dil–Div 9:00–18:00",
  "blog-hero-tag": "Blog", "blog-hero-h1": "Consells i Inspiració per a Viatgers", "blog-hero-p": "Històries, consells i guies de viatge per a la teva propera aventura.",
  "breadcrumb-blog": "Blog"
};

const en = {
  "nav1": "Destinations", "nav2": "Experiences", "nav3": "About", "nav4": "Blog", "nav5": "Contact",
  "nav-cta": "Request information", "hero-h1": "We organize the trips<br>you've always dreamed of",
  "hero-sub": "Discover unique destinations with close and personalized service", "hero-btn1": "View Destinations", "hero-btn2": "About Us",
  "dest-title": "Featured Destinations", "d1-name": "Norway", "d1-desc": "7 Days, from $1200", "d1-btn": "View more",
  "d2-name": "Japan", "d2-desc": "7 Days, from $1200", "d2-btn": "View more",
  "d3-name": "Maldives", "d3-desc": "7 Days, from $1200", "d3-btn": "View more",
  "d4-name": "Patagonia", "d4-desc": "7 Days, from $1200", "d4-btn": "View more",
  "ver-todos": "See All Trips  ›", "pq-title": "Why Choose Us?",
  "pq1": "Personalized Attention", "pq2": "Trips Tailored for You", "pq3": "Safety and Trust", "pq4": "20 Years of Experience",
  "test-title": "Testimonials from Our Travelers", "t1-name": "Laura Gómez", "t1-text": "\"An incredible trip, exceeded all our expectations!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"An unforgettable experience, first-class service!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"We will definitely travel with you again, everything perfect.\"",
  "cta-h": "Request information about your next trip", "cta-p": "Ready for your next adventure? Contact us and we'll help you plan the perfect trip.",
  "cta-btn": "Request information", "logo": "La Maleta", "footer-slogan": "Trips that change your life",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-addr": "Buenos Aires, Argentina", "f-hours": "Mon–Fri 9:00–18:00",
  "blog-hero-tag": "Blog", "blog-hero-h1": "Travel Tips and Inspiration", "blog-hero-p": "Stories, tips and travel guides for your next adventure.",
  "breadcrumb-blog": "Blog"
};

// Language metadata for switcher
window.langMeta = {
  es: { label: 'Español',  flag: '🇪🇸', code: 'es' },
  ca: { label: 'Català',   flag: '🏴', code: 'ca' },
  en: { label: 'English',  flag: '🇬🇧', code: 'en' }
};

// Translations object
window.translations = { en, es, ca };

// Helper function to get current language
window.getCurrentLang = function() {
  return localStorage.getItem('web_lang') || 'es';
};

// Helper function to set language
window.setCurrentLang = function(lang) {
  localStorage.setItem('web_lang', lang);
  document.documentElement.lang = lang;
};

// Helper function to get translation
window.t = function(key, lang) {
  const currentLang = lang || window.getCurrentLang();
  return window.translations[currentLang]?.[key] || window.translations['es']?.[key] || key;
};

})();