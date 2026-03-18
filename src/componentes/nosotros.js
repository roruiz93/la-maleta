// ============================================================
//  componentes/nosotros.js
//  Página Sobre Nosotros — textos editables desde admin
// ============================================================
import { listenContent } from "../firebase.js";
import { initShared, applyContent } from "./_shared.js";

window.addEventListener("DOMContentLoaded", () => {
  initShared();
  listenContent(applyContent);
});
