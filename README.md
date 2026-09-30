# La Maleta — Web

Sitio público de **Viajes La Maleta**: home, destinos, blog, información y contacto. El contenido se administra desde el panel [la-maleta-admin](../la-maleta-admin).

## Stack

- **[Vite 5](https://vitejs.dev/)** — build tool y dev server, multi-página (`index.html`, `destinos.html`, `blog.html`, `ver-destino.html`, `informacion.html`, `nosotros.html`, `contacto.html`)
- **JavaScript vanilla** (ESM) — sin framework de UI; componentes propios en `src/componentes/`
- **[Firebase 10](https://firebase.google.com/)** (Firestore para leer destinos/posts, Storage para imágenes) — mismo proyecto que `la-maleta-admin` (`la-maleta-e038c`)
- **i18n propio** (`src/i18n.js` + `src/locales/*.json`) para ES / EN / CA — son diccionarios estáticos, no se llama a ninguna API externa de traducción en el sitio público (la traducción automática ocurre solo del lado admin, al guardar contenido)
- **vite-plugin-html**
- **Terser** — minificación en el build

## Deploy

- **Firebase Hosting** (proyecto `la-maleta-e038c`) — ver `firebase.json`, con `firestore.rules` y `storage.rules`
- **Vercel** — ver `vercel.json` (headers de seguridad: CSP, HSTS, X-Frame-Options, etc.)

## Variables de entorno

Copiar `.env.example` a `.env` y completar con los valores de Firebase Console:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Scripts

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción (dist/)
npm run preview   # preview del build
```

## Servidor local para la vista previa desde el admin

El panel admin puede mostrar una vista previa en vivo de este sitio. Para eso hace falta levantarlo en `http://localhost:5173`; ver `SERVER-SETUP.md` para las opciones (Vite, `simple-server.js`, live-server, Python, etc.).

## Estructura

```
src/
  web.js / web-compat.js        # lógica principal del sitio
  componentes/                  # componentes por sección (destinos, contacto, nosotros, etc.)
  firebase.js / firebase-config.js
  i18n.js / i18n-compat.js
  locales/                      # es.json, en.json, ca.json
  security.js
```
