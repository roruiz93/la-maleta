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
window.saveConsulta = async function(data) {
  const id = `consulta_${Date.now()}`;
  await db.collection("consultas").doc(id).set({
    ...data,
    leida: false,
    fecha: new Date().toISOString()
  });
  return id;
};

})();