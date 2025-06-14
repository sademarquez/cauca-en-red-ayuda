
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'leader';
  region: string;
  isVerified: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'attack' | 'displacement' | 'threat' | 'natural_disaster' | 'other';
  status: 'active' | 'resolved' | 'investigating';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  reportedBy: string; // User ID
  reportedAt: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPeople?: number;
  images?: string[];
  verified: boolean;
  verifiedBy?: string; // Leader ID
}

export interface CommunityNetwork {
  id: string;
  leaderId: string;
  members: string[]; // Array of User IDs
  region: string;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'warning' | 'info';
  region?: string;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string; // Leader ID
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}
