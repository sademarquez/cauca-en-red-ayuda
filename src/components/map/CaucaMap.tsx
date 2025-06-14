
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
  const [mapCenter, setMapCenter] = useState({ lat: 2.4448, lng: -76.6147 });
  const [mapZoom, setMapZoom] = useState(9);

  // Efecto para enfocar en el municipio del usuario al cargar
  useEffect(() => {
    if (user?.region) {
      const coords = getCoordsForRegion(user.region);
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setMapZoom(coords.zoom);
      console.log(`Enfocando mapa en ${user.region}:`, coords);
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
          
          // Verificar si está en el Cauca y centrar apropiadamente
          if (newLocation.lat >= 1.0 && newLocation.lat <= 3.5 && 
              newLocation.lng >= -78.0 && newLocation.lng <= -75.5) {
            setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
            setMapZoom(12);
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
      setMapZoom(coords.zoom);
    } else {
      // Centrar en todo el Cauca
      setMapCenter({ lat: 2.4448, lng: -76.6147 });
      setMapZoom(9);
    }
  };

  // Función para convertir coordenadas lat/lng a posición en el contenedor del mapa
  const latLngToPosition = (lat: number, lng: number) => {
    // Límites precisos del departamento del Cauca
    const bounds = {
      north: 3.2,
      south: 1.2,
      east: -75.8,
      west: -77.8
    };
    
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    
    return { 
      x: Math.max(2, Math.min(98, x)), 
      y: Math.max(2, Math.min(98, y)) 
    };
  };

  // URL del mapa embebido centrado específicamente en el Cauca
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-77.8,1.2,-75.8,3.2&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

  // Filtrar incidentes por proximidad al usuario si está en una región específica
  const getRelevantIncidents = () => {
    if (!user?.region) return incidents;
    
    const userCoords = getCoordsForRegion(user.region);
    return incidents.filter(incident => {
      const distance = Math.sqrt(
        Math.pow(incident.location.lat - userCoords.lat, 2) + 
        Math.pow(incident.location.lng - userCoords.lng, 2)
      );
      return distance < 0.5; // Radio de aproximadamente 50km
    });
  };

  const relevantIncidents = getRelevantIncidents();

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-cauca-azul-50 via-white to-cauca-verde-50 overflow-hidden">
      {/* Mapa base del Cauca con mejor styling */}
      <div ref={mapRef} className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        {/* Iframe con mapa real de OpenStreetMap */}
        <iframe
          ref={iframeRef}
          src={mapUrl}
          className="w-full h-full border-0"
          style={{ 
            filter: 'sepia(0.1) saturate(1.1) contrast(1.05) brightness(1.02)',
            minHeight: '400px'
          }}
          title="Mapa del Departamento del Cauca"
        />
        
        {/* Overlay mejorado para marcadores */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Marcadores de incidentes con mejor diseño */}
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
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-xl shadow-2xl border-4 border-white hover:scale-125 transition-all duration-300 animate-pulse group-hover:animate-none`}>
                  {getIncidentIcon(incident.type)}
                </div>
                {/* Ripple effect */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientClass} opacity-30 animate-ping`}></div>
              </div>
            );
          })}

          {/* Marcador de ubicación del usuario mejorado */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
              style={{
                left: `${latLngToPosition(userLocation.lat, userLocation.lng).x}%`,
                top: `${latLngToPosition(userLocation.lat, userLocation.lng).y}%`
              }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-400 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-green-200 rounded-full animate-ping opacity-60"></div>
              <div className="absolute -top-2 -left-2 w-10 h-10 bg-green-300 rounded-full animate-ping opacity-40 animation-delay-150"></div>
            </div>
          )}

          {/* Etiqueta especial para la región del usuario */}
          {user?.region && (
            <div 
              className="absolute text-cauca-azul-800 font-bold text-sm bg-gradient-to-r from-cauca-azul-100 to-white px-4 py-2 rounded-full shadow-xl border-2 border-cauca-azul-300 backdrop-blur-sm"
              style={{
                left: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).x}%`,
                top: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).y - 12}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              🏠 {user.region}
            </div>
          )}
        </div>
      </div>

      {/* Controles del mapa mejorados */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3 z-50 pointer-events-auto">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="sm"
          className="bg-white/95 text-cauca-gris-700 hover:bg-white shadow-xl border border-cauca-gris-200 backdrop-blur-sm rounded-xl h-12 w-12 p-0"
        >
          <Navigation className={`h-5 w-5 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button
          onClick={handleRecenterToRegion}
          size="sm"
          className="bg-gradient-to-r from-cauca-azul-500 to-cauca-azul-600 text-white hover:from-cauca-azul-600 hover:to-cauca-azul-700 shadow-xl rounded-xl h-12 w-12 p-0"
          title={user?.region ? `Volver a ${user.region}` : 'Ver todo el Cauca'}
        >
          {user?.region ? '🏠' : <Eye className="h-5 w-5" />}
        </Button>
      </div>

      {/* Información del incidente seleccionado mejorada */}
      {selectedIncident && (
        <Card className="absolute bottom-6 left-6 right-6 max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-md z-50 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getIncidentColor(selectedIncident.type, selectedIncident.severity)} flex items-center justify-center text-white text-xl shadow-lg`}>
                  {getIncidentIcon(selectedIncident.type)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-cauca-gris-800">{selectedIncident.title}</h3>
                  <p className="text-xs text-cauca-gris-500">
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
                className="text-cauca-gris-400 hover:text-cauca-gris-600 hover:bg-cauca-gris-100 p-2 h-auto rounded-full"
              >
                ✕
              </Button>
            </div>
            
            <p className="text-sm text-cauca-gris-600 mb-4 leading-relaxed">
              {selectedIncident.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={selectedIncident.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-xs font-semibold px-3 py-1"
                >
                  {selectedIncident.severity === 'critical' ? 'Crítico' : 
                   selectedIncident.severity === 'high' ? 'Alto' :
                   selectedIncident.severity === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
                
                {selectedIncident.verified && (
                  <Badge variant="outline" className="text-xs text-cauca-verde-600 border-cauca-verde-300 bg-cauca-verde-50">
                    ✓ Verificado
                  </Badge>
                )}
              </div>
              
              {selectedIncident.affectedPeople && (
                <div className="text-xs text-cauca-gris-500 flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{selectedIncident.affectedPeople} personas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de estadísticas mejorado */}
      <div className="absolute top-6 left-6 bg-white/95 rounded-2xl p-4 shadow-xl border border-cauca-gris-100 backdrop-blur-md z-50">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-cauca-gris-800">{relevantIncidents.length}</p>
              <p className="text-xs text-cauca-gris-500">Alertas activas</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cauca-azul-500 to-cauca-azul-400 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-cauca-azul-700">Red Activa</p>
              <p className="text-xs text-cauca-gris-500">Conectado</p>
            </div>
          </div>
          
          {user?.region && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cauca-verde-500 to-cauca-verde-400 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-cauca-verde-700 text-xs">{user.region}</p>
                <p className="text-xs text-cauca-gris-500">Tu región</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Indicador de región activa para líderes */}
      {user?.role === 'leader' && user?.region && (
        <div className="absolute bottom-6 right-6 bg-gradient-to-r from-cauca-azul-600 to-cauca-azul-700 text-white px-4 py-2 rounded-full shadow-xl z-50 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold">Líder de {user.region}</span>
        </div>
      )}
    </div>
  );
};

export default CaucaMap;
