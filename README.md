# 🖥️ Frontend — Sistema Inteligente de Recomendación de Laptops

Interfaz de usuario moderna y reactiva construida con **React 19** y **Vite**, diseñada para guiar al usuario en la búsqueda, comparación y selección de equipos de cómputo adaptados a su perfil de uso y presupuesto.

---

## 🚀 Tecnologías

- **React 19** — Renderizado declarativo y concurrente.
- **Vite 8** — Entorno de desarrollo ultrarrápido y empaquetado optimizado.
- **Zustand** — Gestión de estado global ligera y escalable.
- **Axios** — Cliente HTTP con interceptores centralizados y timeouts configurados.
- **Vanilla CSS (Design System propio)** — Diseño dark glassmorphism, tipografías modernas, transiciones y microanimaciones sin dependencias externas pesadas.

---

## 📁 Estructura del Frontend

```text
frontend/
├── public/                 # Recursos públicos y favicon
├── src/
│   ├── assets/             # Imágenes y recursos estáticos
│   ├── components/         # Componentes reutilizables de UI
│   │   ├── WizardModal.jsx           # Modal interactivo en 3 pasos
│   │   ├── ComparadorModal.jsx       # Modal de comparación de especificaciones
│   │   ├── EquipoCard.jsx            # Tarjeta de producto con specs y precio
│   │   ├── LaptopCarousel.jsx        # Carrusel animado de equipos destacados
│   │   ├── StarRating.jsx            # Componente de calificación por estrellas
│   │   └── GeolocalizacionProvider.jsx # Contexto/selector de ubicación regional
│   ├── services/
│   │   ├── api.js                    # Instancia Axios con interceptores
│   │   └── equiposService.js         # Métodos de consumo del backend Django
│   ├── store/              # Stores globales de Zustand
│   ├── App.jsx             # Vista principal, hero, secciones y lógica de modales
│   ├── index.css           # Tokens de diseño, estilos globales y utilidades
│   └── main.jsx            # Punto de entrada de React
├── .env.example            # Plantilla de variables de entorno
├── package.json            # Scripts y dependencias
├── vercel.json             # Configuración de despliegue en Vercel
└── vite.config.js          # Configuración de Vite
```

---

## 🛠️ Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Contenido de `.env`:
```env
# Para desarrollo local conectando con Django en el puerto 8000:
VITE_API_URL=http://localhost:8000/api

# Para apuntar al backend desplegado en Render:
# VITE_API_URL=https://laptops-backend.onrender.com/api
```

---

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:5173`.
- `npm run build`: Genera el bundle de producción en el directorio `dist/`.
- `npm run preview`: Sirve localmente la versión compilada para pruebas previas al despliegue.
- `npm run lint`: Ejecuta el linter rápido con Oxlint.

---

## 🌐 Despliegue en Vercel

Este proyecto cuenta con `vercel.json` preconfigurado con:
- Rewrites automáticos hacia `index.html` para soporte de Single Page Application (SPA).
- Cabeceras de caché inmutable (`max-age=31536000`) para recursos estáticos dentro de `/assets/`.

Simplemente conecta el repositorio a Vercel y añade la variable de entorno `VITE_API_URL` apuntando a tu backend en producción.
