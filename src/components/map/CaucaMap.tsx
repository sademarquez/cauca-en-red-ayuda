
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Users, Navigation, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident, UserLocation, User } from '@/types';
import { getCoordsForRegion } from '@/utils/municipiosCoords';

interface CaucaMapProps {
  incidents: Incident[];
  userLocation?: UserLocation;
  onIncidentClick: (incident: Incident) => void;
  onLocationUpdate: (location: UserLocation) => void;
  user?: User;
}

const CaucaMap: React.FC<CaucaMapProps> = ({
  incidents,
  userLocation,
  onIncidentClick,
  onLocationUpdate,
  user
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Límites precisos del departamento del Cauca
  const caucaBounds = {
    north: 3.7,   // Norte del Cauca
    south: 1.5,   // Sur del Cauca
    east: -75.7,  // Este del Cauca
    west: -77.8   // Oeste del Cauca (incluye zona costera)
  };

  // Centro exacto del departamento del Cauca
  const caucaCenter = { lat: 2.6, lng: -76.75 };

  const getIncidentIcon = (type: Incident['type']) => {
    switch (type) {
      case 'attack': return '🚨';
      case 'displacement': return '🏠';
      case 'threat': return '⚠️';
      case 'natural_disaster': return '🌊';
      default: return '📍';
    }
  };

  const getIncidentColor = (type: Incident['type'], severity: Incident['severity']) => {
    const baseColors = {
      'attack': severity === 'critical' ? 'from-red-600 to-red-400' : 'from-red-500 to-red-300',
      'displacement': severity === 'critical' ? 'from-orange-600 to-orange-400' : 'from-orange-500 to-orange-300',
      'threat': severity === 'critical' ? 'from-yellow-600 to-yellow-400' : 'from-yellow-500 to-yellow-300',
      'natural_disaster': severity === 'critical' ? 'from-blue-600 to-blue-400' : 'from-blue-500 to-blue-300',
      'other': severity === 'critical' ? 'from-gray-600 to-gray-400' : 'from-gray-500 to-gray-300'
    };

    return baseColors[type];
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          onLocationUpdate(newLocation);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  };

  // Función para convertir coordenadas a posición en el mapa del Cauca
  const latLngToPosition = (lat: number, lng: number) => {
    const x = ((lng - caucaBounds.west) / (caucaBounds.east - caucaBounds.west)) * 100;
    const y = ((caucaBounds.north - lat) / (caucaBounds.north - caucaBounds.south)) * 100;
    
    return { 
      x: Math.max(2, Math.min(98, x)), 
      y: Math.max(2, Math.min(98, y)) 
    };
  };

  // URL del mapa centrado específicamente en el Cauca con bordes marcados
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${caucaBounds.west},${caucaBounds.south},${caucaBounds.east},${caucaBounds.north}&layer=mapnik&marker=${caucaCenter.lat},${caucaCenter.lng}`;

  // Filtrar incidentes dentro del territorio del Cauca
  const getCaucaIncidents = () => {
    return incidents.filter(incident => {
      const { lat, lng } = incident.location;
      return lat >= caucaBounds.south && lat <= caucaBounds.north && 
             lng >= caucaBounds.west && lng <= caucaBounds.east;
    });
  };

  // Filtrar por proximidad al usuario si está en el Cauca
  const getRelevantIncidents = () => {
    const caucaIncidents = getCaucaIncidents();
    
    if (!user?.region) return caucaIncidents;
    
    const userCoords = getCoordsForRegion(user.region);
    return caucaIncidents.filter(incident => {
      const distance = Math.sqrt(
        Math.pow(incident.location.lat - userCoords.lat, 2) + 
        Math.pow(incident.location.lng - userCoords.lng, 2)
      );
      return distance < 0.5; // Radio de proximidad reducido
    });
  };

  const relevantIncidents = getRelevantIncidents();

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 overflow-hidden">
      {/* Mapa fijo del Cauca - NO INTERACTIVO */}
      <div ref={mapRef} className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border-4 border-green-600/50">
        <iframe
          ref={iframeRef}
          src={mapUrl}
          className="w-full h-full border-0 pointer-events-none"
          style={{ 
            filter: 'sepia(0.1) saturate(1.3) contrast(1.2) brightness(0.95)',
            minHeight: '400px'
          }}
          title="Mapa del Departamento del Cauca - Solo Visualización"
        />
        
        {/* Overlay con bordes del Cauca muy marcados */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Borde del departamento del Cauca */}
          <div className="absolute inset-2 border-4 border-green-700 rounded-xl shadow-inner bg-gradient-to-br from-transparent via-green-100/10 to-transparent"></div>
          <div className="absolute inset-4 border-2 border-green-600 rounded-lg shadow-inner bg-gradient-to-br from-transparent via-green-50/20 to-transparent"></div>
          
          {/* Marcadores de incidentes para el Cauca */}
          {relevantIncidents.map((incident) => {
            const position = latLngToPosition(incident.location.lat, incident.location.lng);
            const gradientClass = getIncidentColor(incident.type, incident.severity);
            
            return (
              <div
                key={incident.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 hover:z-30 pointer-events-auto group"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => {
                  setSelectedIncident(incident);
                  onIncidentClick(incident);
                }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-all duration-300 animate-pulse group-hover:animate-none relative`}>
                  <span className="text-white text-2xl">{getIncidentIcon(incident.type)}</span>
                  {/* Ondas de alerta crítica */}
                  {incident.severity === 'critical' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40"></div>
                      <div className="absolute -inset-3 rounded-full bg-red-300 animate-ping opacity-20 animation-delay-300"></div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Marcador de usuario si está en el Cauca */}
          {userLocation && 
           userLocation.lat >= caucaBounds.south && userLocation.lat <= caucaBounds.north &&
           userLocation.lng >= caucaBounds.west && userLocation.lng <= caucaBounds.east && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
              style={{
                left: `${latLngToPosition(userLocation.lat, userLocation.lng).x}%`,
                top: `${latLngToPosition(userLocation.lat, userLocation.lng).y}%`
              }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full border-4 border-white shadow-xl relative">
                <div className="absolute -inset-4 bg-blue-200 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -inset-2 bg-blue-300 rounded-full animate-ping opacity-40 animation-delay-150"></div>
              </div>
            </div>
          )}

          {/* Etiqueta del municipio del usuario */}
          {user?.region && (
            <div 
              className="absolute text-green-800 font-bold text-lg bg-gradient-to-r from-green-100 to-white px-6 py-3 rounded-full shadow-xl border-3 border-green-400 backdrop-blur-sm"
              style={{
                left: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).x}%`,
                top: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).y - 18}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              🏠 {user.region} - Cauca
            </div>
          )}
        </div>
      </div>

      {/* Control de ubicación únicamente */}
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="lg"
          className="bg-white/95 text-gray-700 hover:bg-white shadow-xl border-2 border-green-300 backdrop-blur-sm rounded-2xl h-16 w-16 p-0"
        >
          <Navigation className={`h-8 w-8 ${isLocating ? 'animate-spin' : ''} text-green-600`} />
        </Button>
      </div>

      {/* Panel de información del incidente seleccionado */}
      {selectedIncident && (
        <Card className="absolute bottom-6 left-6 right-6 max-w-2xl mx-auto shadow-2xl border-0 bg-white/98 backdrop-blur-md z-50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getIncidentColor(selectedIncident.type, selectedIncident.severity)} flex items-center justify-center text-white text-3xl shadow-lg`}>
                  {getIncidentIcon(selectedIncident.type)}
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-gray-800 mb-2">{selectedIncident.title}</h3>
                  <p className="text-lg text-gray-500">
                    📍 Departamento del Cauca
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(selectedIncident.reportedAt).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-4 h-auto rounded-full"
              >
                ✕
              </Button>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              {selectedIncident.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge 
                  variant={selectedIncident.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-lg font-semibold px-6 py-3"
                >
                  {selectedIncident.severity === 'critical' ? '🚨 CRÍTICO' : 
                   selectedIncident.severity === 'high' ? '⚠️ ALTO' :
                   selectedIncident.severity === 'medium' ? '📢 MEDIO' : '📝 BAJO'}
                </Badge>
                
                {selectedIncident.verified && (
                  <Badge variant="outline" className="text-lg text-green-600 border-green-400 bg-green-50 px-6 py-3">
                    ✓ VERIFICADO
                  </Badge>
                )}
              </div>
              
              {selectedIncident.affectedPeople && (
                <div className="text-lg text-gray-600 flex items-center space-x-3">
                  <Users className="h-6 w-6" />
                  <span className="font-semibold">{selectedIncident.affectedPeople} personas afectadas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de estado de emergencias del Cauca */}
      <div className="absolute top-6 left-6 bg-white/98 rounded-3xl p-6 shadow-2xl border-2 border-green-200 backdrop-blur-md z-50 min-w-80">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-green-800 mb-2">🏛️ Departamento del Cauca</h2>
          <p className="text-sm text-gray-600">Sistema de Alertas en Tiempo Real</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between bg-red-50 p-4 rounded-2xl border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-2xl text-red-700">{relevantIncidents.length}</p>
                <p className="text-sm text-red-600 font-semibold">Alertas Activas</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-2xl border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-700 text-lg">EN VIVO</p>
                <p className="text-sm text-blue-600 font-semibold">Monitoreo Activo</p>
              </div>
            </div>
          </div>
          
          {user?.region && (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-2xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-700 text-lg">{user.region}</p>
                  <p className="text-sm text-green-600 font-semibold">Tu Municipio</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador especial para líderes con acceso a actualización */}
      {user?.role === 'leader' && user?.region && (
        <div className="absolute bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full shadow-2xl z-50 flex items-center space-x-4">
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="font-bold text-lg">LÍDER - {user.region}, Cauca</span>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Título identificativo del mapa */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-800 to-green-600 text-white px-6 py-2 rounded-full shadow-xl z-40">
        <p className="font-bold text-sm">🗺️ MAPA OFICIAL DEL CAUCA - SOLO VISUALIZACIÓN</p>
      </div>
    </div>
  );
};

export default CaucaMap;
