# 🌐 Vista Previa Local - Configuración del Servidor

Para que funcione la vista previa en tiempo real desde el panel admin, necesitas levantar un servidor local para el sitio web.

## 📋 Opciones para levantar servidor:

### **Opción 1: Python (más fácil)**
```bash
# Navegar al directorio del proyecto web
cd /c/Users/Ususario/OneDrive/Documentos/proyectos/la-maleta-web

# Levantar servidor con Python 3
python -m http.server 5173

# O con Python 2 (si no tienes Python 3)
python -m SimpleHTTPServer 5173
```

### **Opción 2: Node.js Live Server**
```bash
# Instalar live-server globalmente (solo una vez)
npm install -g live-server

# Navegar al directorio del proyecto web
cd /c/Users/Ususario/OneDrive/Documentos/proyectos/la-maleta-web

# Levantar servidor
live-server --port=5173
```

### **Opción 3: Vite (si está configurado)**
```bash
# Si el proyecto tiene Vite configurado
cd /c/Users/Ususario/OneDrive/Documentos/proyectos/la-maleta-web
npm run dev
```

### **Opción 4: PHP (si tienes XAMPP/WAMP)**
```bash
cd /c/Users/Ususario/OneDrive/Documentos/proyectos/la-maleta-web
php -S localhost:5173
```

## ✅ **Verificar que funcione:**

1. **Abrir navegador** → `http://localhost:5173`
2. **Verificar** que se vea el sitio web de La Maleta
3. **Abrir el admin** → La vista previa debería funcionar

## 🔧 **Cambiar puerto (opcional):**

Si el puerto 5173 está ocupado, puedes usar otro puerto y actualizar el archivo `.env` del admin:

```env
VITE_WEB_URL_LOCAL=http://localhost:YOUR_PORT
```

## 💡 **Recomendación:**

**Para desarrollo normal:** Usa Python SimpleHTTPServer (Opción 1)
**Para desarrollo avanzado:** Usa live-server (Opción 2) que auto-refresca

¡Una vez que tengas el servidor corriendo, la vista previa en el admin funcionará perfectamente! 🚀