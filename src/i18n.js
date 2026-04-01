// ============================================================
//  i18n.js — Sistema de traducciones inline (sin imports)
//  Compatible con cualquier servidor HTTP
// ============================================================

// Traducciones embebidas directamente
const es = {
  "nav1": "Destinos", "nav2": "Experiencias", "nav3": "Nosotros", "nav4": "Blog", "nav5": "Contacto",
  "nav-cta": "Solicitá información", "hero-h1": "Organizamos los viajes<br>que siempre soñaste",
  "hero-sub": "Descubrí destinos únicos con un trato cercano y personalizado",
  "hero-btn1": "Ver Destinos", "hero-btn2": "Sobre Nosotros", "dest-title": "Destinos Destacados",
  "d1-name": "Noruega", "d1-desc": "7 Días, desde $1200", "d1-btn": "Ver más",
  "d2-name": "Japón", "d2-desc": "7 Días, desde $1200", "d2-btn": "Ver más",
  "d3-name": "Maldivas", "d3-desc": "7 Días, desde $1200", "d3-btn": "Ver más",
  "d4-name": "Patagonia", "d4-desc": "7 Días, desde $1200", "d4-btn": "Ver más",
  "ver-todos": "Ver Todos los Viajes  ›", "pq-title": "¿Por Qué Elegirnos?",
  "pq1": "Atención Personalizada", "pq2": "Viajes a tu Medida", "pq3": "Seguridad y Confianza",
  "pq4": "20 Años de Experiencia", "test-title": "Testimonios de Nuestros Viajeros",
  "t1-name": "Laura Gómez", "t1-text": "\"Un viaje increíble, superado todas nuestras expectativas!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"Una experiencia inolvidable, atención de primera!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"Sin duda volveremos a viajar con ustedes, todo perfecto.\"",
  "cta-h": "Solicitá información sobre tu próximo viaje",
  "cta-p": "¿Listo para tu próxima aventura? Contactanos y te ayudaremos a planear el viaje perfecto.",
  "cta-btn": "Solicitá información", "logo": "La Maleta", "footer-slogan": "Viajes que te cambian la vida",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-addr": "Buenos Aires, Argentina", "f-hours": "Lun–Vie 9:00–18:00"
};

const ca = {
  "nav1": "Destinacions", "nav2": "Experiències", "nav3": "Nosaltres", "nav4": "Blog", "nav5": "Contacte",
  "nav-cta": "Sol·licita informació", "hero-h1": "Organitzem els viatges<br>que sempre has somniat",
  "hero-sub": "Descobreix destinacions úniques amb un tracte proper i personalitzat",
  "hero-btn1": "Veure Destinacions", "hero-btn2": "Sobre Nosaltres", "dest-title": "Destinacions Destacades",
  "d1-name": "Noruega", "d1-desc": "7 Dies, des de $1200", "d1-btn": "Veure més",
  "d2-name": "Japó", "d2-desc": "7 Dies, des de $1200", "d2-btn": "Veure més",
  "d3-name": "Maldives", "d3-desc": "7 Dies, des de $1200", "d3-btn": "Veure més",
  "d4-name": "Patagònia", "d4-desc": "7 Dies, des de $1200", "d4-btn": "Veure més",
  "ver-todos": "Veure Tots els Viatjes  ›", "pq-title": "Per Què Triar-nos?",
  "pq1": "Atenció Personalitzada", "pq2": "Viatges a la teva Mida", "pq3": "Seguretat i Confiança",
  "pq4": "20 Anys d'Experiència", "test-title": "Testimonis dels Nostres Viatgers",
  "t1-name": "Laura Gómez", "t1-text": "\"Un viatge increïble, ha superat totes les nostres expectatives!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"Una experiència inoblidable, atenció de primera!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"Sens dubte tornarem a viatjar amb vosaltres, tot perfecte.\"",
  "cta-h": "Sol·licita informació sobre el teu proper viatge",
  "cta-p": "Preparat per la teva propera aventura? Contacta'ns i t'ajudarem a planificar el viatge perfecte.",
  "cta-btn": "Sol·licita informació", "logo": "La Maleta", "footer-slogan": "Viatges que et canvien la vida",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-addr": "Buenos Aires, Argentina", "f-hours": "Dil–Div 9:00–18:00"
};

const en = {
  "nav1": "Destinations", "nav2": "Experiences", "nav3": "About", "nav4": "Blog", "nav5": "Contact",
  "nav-cta": "Request information", "hero-h1": "We organize the trips<br>you've always dreamed of",
  "hero-sub": "Discover unique destinations with close and personalized service",
  "hero-btn1": "View Destinations", "hero-btn2": "About Us", "dest-title": "Featured Destinations",
  "d1-name": "Norway", "d1-desc": "7 Days, from $1200", "d1-btn": "View more",
  "d2-name": "Japan", "d2-desc": "7 Days, from $1200", "d2-btn": "View more",
  "d3-name": "Maldives", "d3-desc": "7 Days, from $1200", "d3-btn": "View more",
  "d4-name": "Patagonia", "d4-desc": "7 Days, from $1200", "d4-btn": "View more",
  "ver-todos": "See All Trips  ›", "pq-title": "Why Choose Us?",
  "pq1": "Personalized Attention", "pq2": "Trips Tailored for You", "pq3": "Safety and Trust",
  "pq4": "20 Years of Experience", "test-title": "Testimonials from Our Travelers",
  "t1-name": "Laura Gómez", "t1-text": "\"An incredible trip, exceeded all our expectations!\"",
  "t2-name": "Jorge Martin", "t2-text": "\"An unforgettable experience, first-class service!\"",
  "t3-name": "Carmen Ruiz", "t3-text": "\"We will definitely travel with you again, everything perfect.\"",
  "cta-h": "Request information about your next trip",
  "cta-p": "Ready for your next adventure? Contact us and we'll help you plan the perfect trip.",
  "cta-btn": "Request information", "logo": "La Maleta", "footer-slogan": "Trips that change your life",
  "f-tel": "+1 (442) 456-7825", "f-email": "info@lamaleta.com", "f-addr": "Buenos Aires, Argentina", "f-hours": "Mon–Fri 9:00–18:00"
};

// Language metadata for switcher
export const langMeta = {
  es: { label: 'Español',  flag: '🇪🇸', code: 'es' },
  ca: { label: 'Català',   flag: '🏴', code: 'ca' },
  en: { label: 'English',  flag: '🇬🇧', code: 'en' }
};

// Translations object
export const translations = { en, es, ca };

// Helper function to get current language
export function getCurrentLang() {
  return localStorage.getItem('web_lang') || 'es';
}

// Helper function to set language
export function setCurrentLang(lang) {
  localStorage.setItem('web_lang', lang);
  document.documentElement.lang = lang;
}

// Helper function to get translation
export function t(key, lang = null) {
  const currentLang = lang || getCurrentLang();
  return translations[currentLang]?.[key] || translations['es']?.[key] || key;
}