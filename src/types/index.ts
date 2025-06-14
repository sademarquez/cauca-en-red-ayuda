
// Tipos principales para la aplicación CaucaConecta

export interface User {
  id: string;
  name: string; // Cambio de 'nombre' a 'name' para consistencia
  email: string;
  phone?: string; // Cambio de 'telefono' a 'phone' para consistencia
  role: 'citizen' | 'leader' | 'admin'; // Cambio de 'rol' a 'role' para consistencia
  region: string;
  municipality?: string; // Cambio de 'municipio' a 'municipality' para consistencia
  verified: boolean; // Cambio de 'verificado' a 'verified' para consistencia
  createdAt: Date; // Cambio de 'creadoEn' a 'createdAt' para consistencia
  lastAccess: Date; // Cambio de 'ultimoAcceso' a 'lastAccess' para consistencia
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

export interface Incident {
  id: string;
  title: string; // Cambio de 'titulo' a 'title' para consistencia
  description: string; // Cambio de 'descripcion' a 'description' para consistencia
  type: 'attack' | 'displacement' | 'threat' | 'natural_disaster' | 'other'; // Cambio de 'tipo' a 'type'
  status: 'active' | 'resolved' | 'investigating' | 'pending'; // Cambio de 'estado' a 'status'
  location: { // Cambio de 'ubicacion' a 'location'
    lat: number; // Cambio de 'latitud' a 'lat'
    lng: number; // Cambio de 'longitud' a 'lng'
    address: string; // Cambio de 'direccion' a 'address'
    municipality: string; // Cambio de 'municipio' a 'municipality'
    village?: string; // Cambio de 'vereda' a 'village'
  };
  reportedBy: string; // Cambio de 'reportadoPor' a 'reportedBy'
  reportedAt: Date; // Cambio de 'reportadoEn' a 'reportedAt'
  severity: 'low' | 'medium' | 'high' | 'critical'; // Cambio de 'severidad' a 'severity'
  affectedPeople?: number; // Cambio de 'personasAfectadas' a 'affectedPeople'
  images?: string[]; // Cambio de 'imagenes' a 'images'
  verified: boolean; // Cambio de 'verificado' a 'verified'
  verifiedBy?: string; // Cambio de 'verificadoPor' a 'verifiedBy'
  emergencyContact?: string; // Cambio de 'contactoEmergencia' a 'emergencyContact'
}

export interface EmergencyRequest {
  id: string;
  userId: string; // Cambio de 'usuarioId' a 'userId'
  emergencyType: 'medical' | 'security' | 'natural_disaster' | 'violence' | 'other'; // Cambio de 'tipoEmergencia' a 'emergencyType'
  description: string; // Cambio de 'descripcion' a 'description'
  location: { // Cambio de 'ubicacion' a 'location'
    lat: number; // Cambio de 'latitud' a 'lat'
    lng: number; // Cambio de 'longitud' a 'lng'
    address: string; // Cambio de 'direccion' a 'address'
    municipality: string; // Cambio de 'municipio' a 'municipality'
  };
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled'; // Cambio de 'estado' a 'status'
  priority: 'low' | 'medium' | 'high' | 'critical'; // Cambio de 'prioridad' a 'priority'
  createdAt: Date; // Cambio de 'creadoEn' a 'createdAt'
  updatedAt: Date; // Cambio de 'actualizadoEn' a 'updatedAt'
  contact: string; // Cambio de 'contacto' a 'contact'
  affectedPeople: number; // Cambio de 'personasAfectadas' a 'affectedPeople'
}

export interface ResourceRequest {
  id: string;
  userId: string; // Cambio de 'usuarioId' a 'userId'
  resourceType: 'food' | 'water' | 'medicine' | 'shelter' | 'clothing' | 'transportation' | 'other'; // Cambio de 'tipoRecurso' a 'resourceType'
  description: string; // Cambio de 'descripcion' a 'description'
  quantity: string; // Cambio de 'cantidad' a 'quantity'
  urgency: 'low' | 'medium' | 'high' | 'critical'; // Cambio de 'urgencia' a 'urgency'
  location: { // Cambio de 'ubicacion' a 'location'
    lat: number; // Cambio de 'latitud' a 'lat'
    lng: number; // Cambio de 'longitud' a 'lng'
    address: string; // Cambio de 'direccion' a 'address'
    municipality: string; // Cambio de 'municipio' a 'municipality'
  };
  status: 'pending' | 'approved' | 'in_delivery' | 'delivered' | 'cancelled'; // Cambio de 'estado' a 'status'
  createdAt: Date; // Cambio de 'creadoEn' a 'createdAt'
  deadlineDate?: Date; // Cambio de 'fechaLimite' a 'deadlineDate'
  contact: string; // Cambio de 'contacto' a 'contact'
  beneficiaries: number; // Cambio de 'beneficiarios' a 'beneficiaries'
}

export interface SafeZoneRequest {
  id: string;
  userId: string; // Cambio de 'usuarioId' a 'userId'
  requestType: 'temporary_shelter' | 'permanent_relocation' | 'safe_transport' | 'protection'; // Cambio de 'tipoSolicitud' a 'requestType'
  reason: string; // Cambio de 'motivo' a 'reason'
  affectedPeople: number; // Cambio de 'personasAfectadas' a 'affectedPeople'
  minorsAge?: number; // Cambio de 'edadMenores' a 'minorsAge'
  adultsAge?: number; // Cambio de 'edadAdultos' a 'adultsAge'
  seniorsAge?: number; // Cambio de 'edadMayores' a 'seniorsAge'
  currentLocation: { // Cambio de 'ubicacionActual' a 'currentLocation'
    lat: number; // Cambio de 'latitud' a 'lat'
    lng: number; // Cambio de 'longitud' a 'lng'
    address: string; // Cambio de 'direccion' a 'address'
    municipality: string; // Cambio de 'municipio' a 'municipality'
  };
  desiredLocation?: string; // Cambio de 'ubicacionDeseada' a 'desiredLocation'
  status: 'pending' | 'evaluating' | 'approved' | 'relocated' | 'denied'; // Cambio de 'estado' a 'status'
  createdAt: Date; // Cambio de 'creadoEn' a 'createdAt'
  contact: string; // Cambio de 'contacto' a 'contact'
  urgency: 'low' | 'medium' | 'high' | 'critical'; // Cambio de 'urgencia' a 'urgency'
}

export interface CommunityNetwork {
  id: string;
  leaderId: string; // Cambio de 'liderId' a 'leaderId'
  members: string[]; // Cambio de 'miembros' a 'members'
  region: string;
  municipality: string; // Cambio de 'municipio' a 'municipality'
  name: string; // Cambio de 'nombre' a 'name'
  description: string; // Cambio de 'descripcion' a 'description'
  createdAt: Date; // Cambio de 'creadoEn' a 'createdAt'
  active: boolean; // Cambio de 'activa' a 'active'
  networkType: 'security' | 'support' | 'emergency' | 'development'; // Cambio de 'tipoRed' a 'networkType'
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
