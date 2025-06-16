
// Tipos específicos para la plataforma electoral

export interface Voter {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  barrio: string;
  comuna: string;
  estrato: number;
  edad: number;
  genero: 'M' | 'F' | 'Otro';
  profesion: string;
  nivelEducativo: string;
  estadoCivil: string;
  intencionVoto: string;
  probabilidadVoto: number;
  ultimaInteraccion: Date;
  canalContacto: string;
  createdAt: Date;
}

export interface Candidate {
  id: string;
  nombre: string;
  cargo: string;
  partido: string;
  propuestas: Record<string, any>;
  biografia: string;
  fotoUrl: string;
  redesSociales: Record<string, string>;
  createdAt: Date;
}

export interface Campaign {
  id: string;
  candidateId: string;
  nombre: string;
  tipo: string;
  audienciaObjetivo: Record<string, any>;
  mensajePrincipal: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  fechaInicio: Date;
  fechaFin: Date;
  presupuesto: number;
  roi: number;
  createdAt: Date;
}

export interface ElectoralMetrics {
  totalVoters: number;
  probabilidadVotoPromedio: number;
  coberturaTerritorial: number;
  tasaConversion: number;
  sentimentScore: number;
  engagementRate: number;
}

export interface ApiConfig {
  geminiApiKey?: string;
  sellerChatApiKey?: string;
  n8nWebhookUrl?: string;
}
