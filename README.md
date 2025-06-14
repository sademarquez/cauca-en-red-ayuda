
# CaucaConecta - Red de Apoyo y Seguridad

PWA para víctimas del conflicto y ciudadanos del Cauca. Reporta incidentes, conecta con líderes comunitarios y construye redes de apoyo.

## 🚀 Despliegue en Netlify

### Pasos para desplegar:

1. **Hacer fork o clonar el repositorio**
2. **Conectar con Netlify**:
   - Ve a [netlify.com](https://netlify.com)
   - Conecta tu repositorio de GitHub
   - Netlify detectará automáticamente la configuración

3. **Configurar variables de entorno en Netlify**:
   - Ve a Site settings → Environment variables
   - Agrega las variables del archivo `.env.example`

### Variables de entorno necesarias:

#### Firebase (Base de datos recomendada)
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### Google Maps (Para mapa real)
```
VITE_GOOGLE_MAPS_API_KEY=tu_google_maps_key
```

## 🔑 Claves y APIs necesarias

### 1. Firebase (Google)
- **Dónde obtenerla**: [Firebase Console](https://console.firebase.google.com/)
- **Pasos**:
  1. Crear proyecto en Firebase
  2. Ir a Project Settings → General
  3. Scroll hasta "Your apps" → Web App
  4. Copiar la configuración

### 2. Google Maps API
- **Dónde obtenerla**: [Google Cloud Console](https://console.cloud.google.com/)
- **Pasos**:
  1. Crear proyecto en Google Cloud
  2. Habilitar Maps JavaScript API
  3. Crear credenciales → API Key
  4. Restringir la key a tu dominio

### 3. Mapbox (Alternativa a Google Maps)
- **Dónde obtenerla**: [Mapbox](https://mapbox.com/)
- **Pasos**:
  1. Crear cuenta gratuita
  2. Ir a Account → Access tokens
  3. Usar el token público por defecto

## 📊 Base de datos con Firebase

### Configuración de Firestore:

```javascript
// Colección: usuarios
{
  id: "user_id",
  nombre: "string",
  email: "string",
  telefono: "string",
  rol: "citizen" | "leader",
  region: "string",
  verificado: boolean,
  creadoEn: timestamp,
  ultimoAcceso: timestamp
}

// Colección: incidentes
{
  id: "incident_id",
  titulo: "string",
  descripcion: "string",
  tipo: "attack" | "displacement" | "threat" | "natural_disaster" | "other",
  estado: "active" | "resolved" | "investigating",
  ubicacion: {
    latitud: number,
    longitud: number,
    direccion: "string"
  },
  reportadoPor: "user_id",
  reportadoEn: timestamp,
  severidad: "low" | "medium" | "high" | "critical",
  personasAfectadas: number,
  imagenes: ["url1", "url2"],
  verificado: boolean,
  verificadoPor: "user_id"
}

// Colección: redes_comunitarias
{
  id: "network_id",
  liderId: "user_id",
  miembros: ["user_id1", "user_id2"],
  region: "string",
  nombre: "string",
  descripcion: "string",
  creadoEn: timestamp,
  activa: boolean
}
```

### Reglas de seguridad de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer todos los perfiles
    match /usuarios/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Incidentes públicos
    match /incidentes/{incidentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.reportadoPor == request.auth.uid ||
         get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'leader');
    }
    
    // Redes comunitarias
    match /redes_comunitarias/{networkId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🛠️ Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

## 📁 Estructura del proyecto

```
src/
├── components/         # Componentes React
│   ├── auth/          # Autenticación
│   ├── incidents/     # Gestión de incidentes
│   ├── map/           # Componentes del mapa
│   └── ui/            # Componentes de UI
├── hooks/             # Custom hooks
├── lib/               # Utilidades y configuración
├── pages/             # Páginas principales
├── types/             # Definiciones de TypeScript
└── utils/             # Funciones auxiliares
```

## 🔐 Seguridad

- Todas las API keys deben configurarse como variables de entorno
- Firebase maneja la autenticación y autorización
- Las reglas de Firestore protegen los datos sensibles
- HTTPS habilitado por defecto en Netlify

## 📱 PWA Features

- Funciona offline
- Instalable en móviles
- Notificaciones push (con Firebase)
- Geolocalización para reportes precisos

## 🤝 Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.
