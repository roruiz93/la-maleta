import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { firebaseConfig } from "./firebase-config";

// Init — solo Firestore, sin Auth (el web es solo lectura)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ─────────────────────────────
// CONTENT
// ─────────────────────────────
export async function saveContent(contentObj) {
  await setDoc(doc(db, "site", "content"), {
    ...contentObj,
    updatedAt: new Date().toISOString()
  });
}
export async function loadContent() {
  const snap = await getDoc(doc(db, "site", "content"));
  return snap.exists() ? snap.data() : null;
}
export function listenContent(callback) {
  return onSnapshot(doc(db, "site", "content"), snap => {
    if (snap.exists()) callback(snap.data());
  });
}

// ─────────────────────────────
// COLORS
// ─────────────────────────────
export async function saveColors(colorsObj) {
  await setDoc(doc(db, "site", "colors"), {
    ...colorsObj,
    updatedAt: new Date().toISOString()
  });
}
export function listenColors(callback) {
  return onSnapshot(doc(db, "site", "colors"), snap => {
    if (snap.exists()) callback(snap.data());
  });
}

// ─────────────────────────────
// SETTINGS
// ─────────────────────────────
export async function getSettings() {
  const snap = await getDoc(doc(db, "site", "settings"));
  return snap.exists() ? snap.data() : {};
}
export async function saveSettings(data) {
  await setDoc(
    doc(db, "site", "settings"),
    { ...data, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}
export function listenSettings(callback) {
  return onSnapshot(
    doc(db, "site", "settings"),
    snap => { if (snap.exists()) callback(snap.data()); },
    error => { console.error("ERROR SETTINGS:", error); }
  );
}

// ─────────────────────────────
// DESTINOS
// ─────────────────────────────
export async function getDestinos() {
  const snap = await getDocs(collection(db, "destinos"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a,b) => (a.orden||0) - (b.orden||0));
}
export async function getDestino(id) {
  const snap = await getDoc(doc(db, "destinos", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
export function listenDestinos(callback) {
  return onSnapshot(
    collection(db, "destinos"),
    snap => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        .sort((a,b) => (a.orden||0) - (b.orden||0));
      callback(items);
    },
    error => { console.error("ERROR DESTINOS:", error); }
  );
}

// ─────────────────────────────
// EXPERIENCIAS
// ─────────────────────────────
export async function getExperiencias() {
  const snap = await getDocs(collection(db, "experiencias"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export function listenExperiencias(callback) {
  return onSnapshot(collection(db, "experiencias"), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─────────────────────────────
// BLOG
// ─────────────────────────────
export async function getPosts(soloPublicados = true) {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(p => soloPublicados ? p.publicado : true)
    .sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
}
export function listenPosts(callback) {
  return onSnapshot(collection(db, "posts"), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.publicado));
  });
}

// ─────────────────────────────
// CONSULTAS
// ─────────────────────────────
export async function saveConsulta(data) {
  const id = `consulta_${Date.now()}`;
  await setDoc(doc(db, "consultas", id), {
    ...data,
    leida: false,
    fecha: new Date().toISOString()
  });
  return id;
}