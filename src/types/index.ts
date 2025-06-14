
// Tipos principales para la aplicación CaucaConecta

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'citizen' | 'leader' | 'admin';
  region: string;
  municipio?: string;
  verificado: boolean;
  creadoEn: Date;
  ultimoAcceso: Date;
}

export interface Incident {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'attack' | 'displacement' | 'threat' | 'natural_disaster' | 'other';
  estado: 'active' | 'resolved' | 'investigating' | 'pending';
  ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
    municipio: string;
    vereda?: string;
  };
  reportadoPor: string;
  reportadoEn: Date;
  severidad: 'low' | 'medium' | 'high' | 'critical';
  personasAfectadas?: number;
  imagenes?: string[];
  verificado: boolean;
  verificadoPor?: string;
  contactoEmergencia?: string;
}

export interface EmergencyRequest {
  id: string;
  usuarioId: string;
  tipoEmergencia: 'medical' | 'security' | 'natural_disaster' | 'violence' | 'other';
  descripcion: string;
  ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
    municipio: string;
  };
  estado: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  prioridad: 'low' | 'medium' | 'high' | 'critical';
  creadoEn: Date;
  actualizadoEn: Date;
  contacto: string;
  personasAfectadas: number;
}

export interface ResourceRequest {
  id: string;
  usuarioId: string;
  tipoRecurso: 'food' | 'water' | 'medicine' | 'shelter' | 'clothing' | 'transportation' | 'other';
  descripcion: string;
  cantidad: string;
  urgencia: 'low' | 'medium' | 'high' | 'critical';
  ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
    municipio: string;
  };
  estado: 'pending' | 'approved' | 'in_delivery' | 'delivered' | 'cancelled';
  creadoEn: Date;
  fechaLimite?: Date;
  contacto: string;
  beneficiarios: number;
}

export interface SafeZoneRequest {
  id: string;
  usuarioId: string;
  tipoSolicitud: 'temporary_shelter' | 'permanent_relocation' | 'safe_transport' | 'protection';
  motivo: string;
  personasAfectadas: number;
  edadMenores?: number;
  edadAdultos?: number;
  edadMayores?: number;
  ubicacionActual: {
    latitud: number;
    longitud: number;
    direccion: string;
    municipio: string;
  };
  ubicacionDeseada?: string;
  estado: 'pending' | 'evaluating' | 'approved' | 'relocated' | 'denied';
  creadoEn: Date;
  contacto: string;
  urgencia: 'low' | 'medium' | 'high' | 'critical';
}

export interface CommunityNetwork {
  id: string;
  liderId: string;
  miembros: string[];
  region: string;
  municipio: string;
  nombre: string;
  descripcion: string;
  creadoEn: Date;
  activa: boolean;
  tipoRed: 'security' | 'support' | 'emergency' | 'development';
}

export interface Municipality {
  name: string;
  coords: [number, number];
  region?: string;
}

// Enums y constantes
export const INCIDENT_TYPES = {
  attack: 'Ataque armado',
  displacement: 'Desplazamiento forzado',
  threat: 'Amenaza',
  natural_disaster: 'Desastre natural',
  other: 'Otro'
} as const;

export const SEVERITY_LEVELS = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto',
  critical: 'Crítico'
} as const;

export const USER_ROLES = {
  citizen: 'Ciudadano',
  leader: 'Líder Comunitario',
  admin: 'Administrador'
} as const;
