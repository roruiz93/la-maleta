// Firebase compatible functions - sin imports ES6
(function() {

// Initialize Firebase
firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();

// ─────────────────────────────
// CONTENT
// ─────────────────────────────
window.saveContent = async function(contentObj) {
  await db.collection("site").doc("content").set({
    ...contentObj,
    updatedAt: new Date().toISOString()
  });
};

window.loadContent = async function() {
  const snap = await db.collection("site").doc("content").get();
  return snap.exists ? snap.data() : null;
};

window.listenContent = function(callback) {
  return db.collection("site").doc("content").onSnapshot(snap => {
    if (snap.exists) callback(snap.data());
  });
};

// Imágenes editables desde el admin (site/images): { "e1-img": url, ... }
// Se aplican a los <img data-img="..."> de la página.
window.listenImages = function(callback) {
  return db.collection("site").doc("images").onSnapshot(snap => {
    if (snap.exists) callback(snap.data());
  });
};

window.applySiteImages = function(images) {
  document.querySelectorAll("img[data-img]").forEach(el => {
    const url = images[el.dataset.img];
    if (typeof url === "string" && url) el.src = url;
  });
};

// ─────────────────────────────
// COLORS
// ─────────────────────────────
window.saveColors = async function(colorsObj) {
  await db.collection("site").doc("colors").set({
    ...colorsObj,
    updatedAt: new Date().toISOString()
  });
};

window.listenColors = function(callback) {
  return db.collection("site").doc("colors").onSnapshot(snap => {
    if (snap.exists) callback(snap.data());
  });
};

// ─────────────────────────────
// SETTINGS
// ─────────────────────────────
window.getSettings = async function() {
  const snap = await db.collection("site").doc("settings").get();
  return snap.exists ? snap.data() : {};
};

window.saveSettings = async function(data) {
  await db.collection("site").doc("settings").set(
    { ...data, updatedAt: new Date().toISOString() },
    { merge: true }
  );
};

window.listenSettings = function(callback) {
  return db.collection("site").doc("settings").onSnapshot(
    snap => { if (snap.exists) callback(snap.data()); },
    error => { console.error("ERROR SETTINGS:", error); }
  );
};

// ─────────────────────────────
// DESTINOS
// ─────────────────────────────
window.getDestinos = async function() {
  const snap = await db.collection("destinos").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a,b) => (a.orden||0) - (b.orden||0));
};

window.getDestino = async function(id) {
  const snap = await db.collection("destinos").doc(id).get();
  return snap.exists ? { id: snap.id, ...snap.data() } : null;
};

window.listenDestinos = function(callback) {
  return db.collection("destinos").onSnapshot(
    snap => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a,b) => (a.orden||0) - (b.orden||0));
      callback(items);
    },
    error => { console.error("ERROR DESTINOS:", error); }
  );
};

// ─────────────────────────────
// EXPERIENCIAS
// ─────────────────────────────
window.getExperiencias = async function() {
  const snap = await db.collection("experiencias").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

window.listenExperiencias = function(callback) {
  return db.collection("experiencias").onSnapshot(snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ─────────────────────────────
// BLOG
// ─────────────────────────────
window.getPosts = async function(soloPublicados = true) {
  const snap = await db.collection("posts").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(p => soloPublicados ? p.publicado : true)
    .sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
};

window.listenPosts = function(callback) {
  return db.collection("posts").onSnapshot(snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.publicado)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    callback(items);
  });
};

// ─────────────────────────────
// CONSULTAS
// ─────────────────────────────
// Solo en contacto.html (carga firebase-auth-compat). El visitante inicia una
// sesión anónima y la consulta se guarda en un lote con limites/{uid}: las
// reglas permiten 1 consulta cada 10 minutos por visitante.
window.saveConsulta = async function(data) {
  const auth = firebase.auth();
  // Esperar a que Auth recupere la sesión guardada antes de crear otra
  let user = await new Promise(ok => { const fin = auth.onAuthStateChanged(u => { fin(); ok(u); }); });
  if (!user) user = (await auth.signInAnonymously()).user;
  const id = `consulta_${Date.now()}`;
  const lote = db.batch();
  lote.set(db.collection("consultas").doc(id), {
    ...data,
    uid: user.uid,
    leida: false,
    fecha: new Date().toISOString()
  });
  lote.set(db.collection("limites").doc(user.uid), {
    ultimo: firebase.firestore.FieldValue.serverTimestamp(),
    consulta: id
  });
  await lote.commit();
  return id;
};

})();