
# CaucaConecta - Red de Apoyo y Seguridad

PWA para víctimas del conflicto y ciudadanos del Cauca. Reporta incidentes, conecta con líderes comunitarios y construye redes de apoyo.

## 🚀 Exportación y Despliegue Libre

### ✅ Proyecto Listo para Exportar
Este proyecto está completamente preparado para ser exportado a GitHub y desplegado en cualquier plataforma sin restricciones:

- ✅ **Sin archivos bloqueados**: Todos los componentes están implementados
- ✅ **Sin dependencias privadas**: Solo usa librerías open source
- ✅ **Configuración completa**: Netlify, Vite y PWA configurados
- ✅ **TypeScript completo**: Tipos definidos para toda la aplicación
- ✅ **Componentes modulares**: Arquitectura escalable y mantenible

### 📁 Estructura del Proyecto (Completa)

```
src/
├── components/
│   ├── auth/
│   │   └── LoginForm.tsx          # ✅ Implementado
│   ├── incidents/
│   │   └── ReportIncident.tsx     # ✅ Implementado
│   ├── layout/
│   │   └── Header.tsx             # ✅ Implementado
│   ├── map/
│   │   └── CaucaMap.tsx           # ✅ Implementado
│   ├── victims/
│   │   ├── EmergencyRequest.tsx   # ✅ Implementado
│   │   ├── ResourceRequest.tsx    # ✅ Implementado
│   │   └── SafeZoneRequest.tsx    # ✅ Implementado
│   └── ui/                        # ✅ Shadcn/ui completo
├── hooks/
├── lib/
├── pages/
│   ├── Index.tsx                  # ✅ Implementado
│   └── NotFound.tsx               # ✅ Implementado
├── types/
│   └── index.ts                   # ✅ Implementado
└── utils/
```

## 🔄 Pasos para Exportar a GitHub

### Desde Lovable:
1. **Conectar GitHub**: Botón "GitHub" en la esquina superior derecha
2. **Autorizar**: Permite acceso a tu cuenta de GitHub
3. **Crear repositorio**: Se crea automáticamente con todo el código

### Manual:
1. **Descargar código**: Desde Dev Mode en Lovable
2. **Crear repo**: `git init` en tu proyecto local
3. **Subir**: `git add .`, `git commit`, `git push`

## 🌐 Despliegue en Netlify

### Automático (Recomendado):
1. Ve a [netlify.com](https://netlify.com) → "Import from Git"
2. Conecta tu repositorio de GitHub
3. Netlify detecta automáticamente la configuración
4. Variables de entorno → Copia las del `.env.example`
5. Deploy automático

### Configuración incluida:
- ✅ `netlify.toml` configurado
- ✅ Redirects para SPA
- ✅ Headers de seguridad
- ✅ Build optimizado

## 🔑 Variables de Entorno (Opcionales)

```env
# Firebase (Para base de datos real)
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google Maps (Para mapa real)
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_key

# Mapbox (Alternativa)
VITE_MAPBOX_TOKEN=tu_mapbox_token
```

**Nota**: La aplicación funciona perfectamente **SIN** estas variables. Solo son necesarias para funcionalidades avanzadas.

## ⚡ Funciona Sin Configuración Adicional

- 🗺️ **Mapa**: Mapa básico del Cauca (sin API keys)
- 📱 **PWA**: Instalable y funcional offline
- 🎨 **UI**: Interfaz completa con Tailwind + Shadcn
- 📊 **Datos**: Sistema de datos simulado para demostración
- 🔐 **Auth**: Sistema de autenticación básico

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## 📦 Dependencias (Solo Open Source)

- **React 18** - Framework principal
- **Vite** - Build tool
- **TypeScript** - Tipado
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI
- **React Router** - Navegación
- **TanStack Query** - Gestión de estado
- **Lucide React** - Iconos
- **Recharts** - Gráficos

## 🔒 Sin Restricciones

- ✅ **Código abierto**: Todas las dependencias son open source
- ✅ **Sin licencias**: No hay restricciones de uso comercial
- ✅ **Personalizable**: Código fuente completamente modificable
- ✅ **Escalable**: Arquitectura preparada para crecer

## 🎯 Características Implementadas

### 🚨 Reportes de Emergencia
- Formulario completo de reportes
- Categorización de incidentes
- Niveles de severidad
- Geolocalización automática

### 🗺️ Mapa Interactivo
- Visualización del departamento del Cauca
- Zoom automático por ubicación
- Marcadores de incidentes
- Información en tiempo real

### 👥 Apoyo a Víctimas
- Solicitudes de emergencia
- Pedidos de recursos
- Solicitudes de refugio
- Sistema de prioridades

### 📱 PWA Features
- Instalable en móviles
- Funciona offline
- Notificaciones (con configuración)
- Diseño responsive

## 🔮 Extensiones Futuras

Con Firebase configurado puedes agregar:
- Autenticación real
- Base de datos en tiempo real
- Notificaciones push
- Almacenamiento de imágenes
- Geolocalización avanzada

## 📄 Licencia

MIT License - Uso libre comercial y personal.

---

**¿Listo para exportar?** 🚀 
Este proyecto no tiene dependencias bloqueadas y funciona inmediatamente después del despliegue.
```
