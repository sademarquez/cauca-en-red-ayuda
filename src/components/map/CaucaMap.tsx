
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
  const [mapCenter, setMapCenter] = useState({ lat: 2.8, lng: -76.8 });
  const [mapZoom, setMapZoom] = useState(9);

  // Límites específicos para Cauca, Valle y Nariño
  const regionBounds = {
    north: 4.8,  // Norte de Valle del Cauca
    south: 0.5,  // Sur de Nariño
    east: -75.0, // Este hacia interior
    west: -78.5  // Oeste hacia el Pacífico
  };

  // Efecto para enfocar automáticamente según el usuario
  useEffect(() => {
    if (user?.region) {
      const coords = getCoordsForRegion(user.region);
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setMapZoom(12);
      console.log(`Auto-enfoque en ${user.region}:`, coords);
    } else {
      // Vista general de la región sur-occidental
      setMapCenter({ lat: 2.8, lng: -76.8 });
      setMapZoom(8);
    }
  }, [user?.region]);

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
          
          // Auto-centrar si está en la región
          if (newLocation.lat >= regionBounds.south && newLocation.lat <= regionBounds.north && 
              newLocation.lng >= regionBounds.west && newLocation.lng <= regionBounds.east) {
            setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
            setMapZoom(13);
          }
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

  const handleRecenterToRegion = () => {
    if (user?.region) {
      const coords = getCoordsForRegion(user.region);
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setMapZoom(12);
    } else {
      // Vista de toda la región sur-occidental
      setMapCenter({ lat: 2.8, lng: -76.8 });
      setMapZoom(8);
    }
  };

  // Función mejorada para convertir coordenadas a posición en el mapa
  const latLngToPosition = (lat: number, lng: number) => {
    const x = ((lng - regionBounds.west) / (regionBounds.east - regionBounds.west)) * 100;
    const y = ((regionBounds.north - lat) / (regionBounds.north - regionBounds.south)) * 100;
    
    return { 
      x: Math.max(2, Math.min(98, x)), 
      y: Math.max(2, Math.min(98, y)) 
    };
  };

  // URL optimizada para la región sur-occidental de Colombia
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${regionBounds.west},${regionBounds.south},${regionBounds.east},${regionBounds.north}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

  // Filtrar incidentes automáticamente por proximidad
  const getRelevantIncidents = () => {
    if (!user?.region) return incidents;
    
    const userCoords = getCoordsForRegion(user.region);
    return incidents.filter(incident => {
      const distance = Math.sqrt(
        Math.pow(incident.location.lat - userCoords.lat, 2) + 
        Math.pow(incident.location.lng - userCoords.lng, 2)
      );
      return distance < 0.8; // Radio aumentado para mejor cobertura
    });
  };

  const relevantIncidents = getRelevantIncidents();

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Mapa base optimizado para comunicación */}
      <div ref={mapRef} className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
        <iframe
          ref={iframeRef}
          src={mapUrl}
          className="w-full h-full border-0"
          style={{ 
            filter: 'sepia(0.05) saturate(1.2) contrast(1.1) brightness(1.05)',
            minHeight: '400px'
          }}
          title="Mapa de Cauca, Valle y Nariño"
        />
        
        {/* Overlay para marcadores con mejor diseño */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Marcadores de incidentes mejorados */}
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
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-content shadow-2xl border-4 border-white hover:scale-110 transition-all duration-300 animate-pulse group-hover:animate-none relative`}>
                  <span className="text-white text-xl mx-auto">{getIncidentIcon(incident.type)}</span>
                  {/* Efecto de ondas para alertas críticas */}
                  {incident.severity === 'critical' && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40"></div>
                      <div className="absolute -inset-2 rounded-full bg-red-300 animate-ping opacity-20 animation-delay-300"></div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Marcador de usuario mejorado */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
              style={{
                left: `${latLngToPosition(userLocation.lat, userLocation.lng).x}%`,
                top: `${latLngToPosition(userLocation.lat, userLocation.lng).y}%`
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full border-4 border-white shadow-xl relative">
                <div className="absolute -inset-3 bg-green-200 rounded-full animate-ping opacity-60"></div>
                <div className="absolute -inset-1 bg-green-300 rounded-full animate-ping opacity-40 animation-delay-150"></div>
              </div>
            </div>
          )}

          {/* Etiqueta regional mejorada */}
          {user?.region && (
            <div 
              className="absolute text-blue-800 font-bold text-sm bg-gradient-to-r from-blue-100 to-white px-6 py-3 rounded-full shadow-xl border-2 border-blue-300 backdrop-blur-sm"
              style={{
                left: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).x}%`,
                top: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).y - 15}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              🏠 {user.region}
            </div>
          )}
        </div>
      </div>

      {/* Controles optimizados para comunicación */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3 z-50 pointer-events-auto">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="sm"
          className="bg-white/95 text-gray-700 hover:bg-white shadow-xl border border-gray-200 backdrop-blur-sm rounded-2xl h-14 w-14 p-0"
        >
          <Navigation className={`h-6 w-6 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          onClick={handleRecenterToRegion}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-xl rounded-2xl h-14 w-14 p-0"
          title={user?.region ? `Volver a ${user.region}` : 'Ver región completa'}
        >
          {user?.region ? '🏠' : <Eye className="h-6 w-6" />}
        </Button>
      </div>

      {/* Panel de información mejorado */}
      {selectedIncident && (
        <Card className="absolute bottom-6 left-6 right-6 max-w-lg mx-auto shadow-2xl border-0 bg-white/98 backdrop-blur-md z-50 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getIncidentColor(selectedIncident.type, selectedIncident.severity)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {getIncidentIcon(selectedIncident.type)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{selectedIncident.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedIncident.reportedAt).toLocaleDateString('es-CO', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 h-auto rounded-full"
              >
                ✕
              </Button>
            </div>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {selectedIncident.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={selectedIncident.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-sm font-semibold px-4 py-2"
                >
                  {selectedIncident.severity === 'critical' ? 'Crítico' : 
                   selectedIncident.severity === 'high' ? 'Alto' :
                   selectedIncident.severity === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
                
                {selectedIncident.verified && (
                  <Badge variant="outline" className="text-sm text-green-600 border-green-300 bg-green-50">
                    ✓ Verificado
                  </Badge>
                )}
              </div>
              
              {selectedIncident.affectedPeople && (
                <div className="text-sm text-gray-500 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{selectedIncident.affectedPeople} personas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de estadísticas de comunicación */}
      <div className="absolute top-6 left-6 bg-white/98 rounded-3xl p-5 shadow-xl border border-gray-100 backdrop-blur-md z-50">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-gray-800">{relevantIncidents.length}</p>
              <p className="text-xs text-gray-500">Alertas activas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-700">En Línea</p>
              <p className="text-xs text-gray-500">Comunicación</p>
            </div>
          </div>
          
          {user?.region && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-700 text-sm">{user.region}</p>
                <p className="text-xs text-gray-500">Tu zona</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador especial para líderes */}
      {user?.role === 'leader' && user?.region && (
        <div className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">Coordinando {user.region}</span>
        </div>
      )}
    </div>
  );
};

export default CaucaMap;
