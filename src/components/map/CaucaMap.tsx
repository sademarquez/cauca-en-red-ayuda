
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Users, Navigation } from 'lucide-react';
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
  const [mapZoom, setMapZoom] = useState(8);

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
      'attack': 'bg-red-500',
      'displacement': 'bg-orange-500',
      'threat': 'bg-yellow-500',
      'natural_disaster': 'bg-blue-500',
      'other': 'bg-gray-500'
    };

    const severityOpacity = {
      'low': 'opacity-70',
      'medium': 'opacity-80',
      'high': 'opacity-90',
      'critical': 'opacity-100'
    };

    return `${baseColors[type]} ${severityOpacity[severity]}`;
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
          setMapCenter({ lat: newLocation.lat, lng: newLocation.lng });
          setMapZoom(14);
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

  const handleRecenterToUser = () => {
    if (user?.region) {
      const coords = getCoordsForRegion(user.region);
      setMapCenter({ lat: coords.lat, lng: coords.lng });
      setMapZoom(coords.zoom);
    }
  };

  // Función para convertir coordenadas lat/lng a posición en el contenedor del mapa
  const latLngToPosition = (lat: number, lng: number) => {
    // Basado en los límites aproximados del Cauca
    const bounds = {
      north: 3.5,
      south: 1.0,
      east: -75.5,
      west: -78.0
    };
    
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  // URL del mapa embebido centrado en el Cauca
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-78.0,1.0,-75.5,3.5&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Mapa base del Cauca usando OpenStreetMap embebido */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden rounded-lg">
        {/* Iframe con mapa real de OpenStreetMap */}
        <iframe
          ref={iframeRef}
          src={mapUrl}
          className="w-full h-full border-0 rounded-lg"
          style={{ filter: 'sepia(0.1) saturate(0.9)' }}
          title="Mapa del Cauca"
        />
        
        {/* Overlay para marcadores */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Marcadores de incidentes */}
          {incidents.map((incident) => {
            const position = latLngToPosition(incident.location.lat, incident.location.lng);
            return (
              <div
                key={incident.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 hover:z-30 pointer-events-auto"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`
                }}
                onClick={() => {
                  setSelectedIncident(incident);
                  onIncidentClick(incident);
                }}
              >
                <div className={`w-10 h-10 rounded-full ${getIncidentColor(incident.type, incident.severity)} flex items-center justify-center text-white text-lg shadow-xl border-3 border-white hover:scale-125 transition-all duration-200 animate-pulse`}>
                  {getIncidentIcon(incident.type)}
                </div>
              </div>
            );
          })}

          {/* Marcador de ubicación del usuario */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
              style={{
                left: `${latLngToPosition(userLocation.lat, userLocation.lng).x}%`,
                top: `${latLngToPosition(userLocation.lat, userLocation.lng).y}%`
              }}
            >
              <div className="w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              <div className="absolute -top-3 -left-3 w-11 h-11 bg-green-200 rounded-full animate-ping opacity-75"></div>
            </div>
          )}

          {/* Etiqueta especial para la región del usuario */}
          {user?.region && (
            <div 
              className="absolute text-blue-800 font-bold text-sm bg-blue-100 px-3 py-1 rounded-full shadow-lg border-2 border-blue-300"
              style={{
                left: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).x}%`,
                top: `${latLngToPosition(getCoordsForRegion(user.region).lat, getCoordsForRegion(user.region).lng).y - 8}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              🏠 {user.region}
            </div>
          )}
        </div>
      </div>

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50 pointer-events-auto">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="sm"
          className="bg-white/95 text-gray-700 hover:bg-white shadow-lg border border-gray-200"
        >
          <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
        
        {user?.region && (
          <Button
            onClick={handleRecenterToUser}
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
            title={`Volver a ${user.region}`}
          >
            🏠
          </Button>
        )}
      </div>

      {/* Información del incidente seleccionado */}
      {selectedIncident && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto shadow-xl border-gray-200 bg-white/95 backdrop-blur-sm z-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getIncidentIcon(selectedIncident.type)}</span>
                <h3 className="font-semibold text-sm text-gray-800">{selectedIncident.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIncident(null)}
                className="text-gray-500 hover:text-gray-700 p-1 h-auto"
              >
                ✕
              </Button>
            </div>
            
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {selectedIncident.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={selectedIncident.severity === 'critical' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {selectedIncident.severity === 'critical' ? 'Crítico' : 
                   selectedIncident.severity === 'high' ? 'Alto' :
                   selectedIncident.severity === 'medium' ? 'Medio' : 'Bajo'}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(selectedIncident.reportedAt).toLocaleDateString()}
                </span>
              </div>
              
              {selectedIncident.verified && (
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas rápidas */}
      <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 shadow-lg border border-gray-200 backdrop-blur-sm z-50">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="font-medium text-gray-800">{incidents.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-gray-700">Red Activa</span>
          </div>
          {user?.region && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="font-medium text-xs text-green-700">{user.region}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaucaMap;
