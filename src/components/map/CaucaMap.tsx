
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
      'other': 'bg-cauca-morado-500'
    };

    const severityOpacity = {
      'low': 'opacity-60',
      'medium': 'opacity-75',
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

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-cauca-morado-100 to-cauca-violeta-100">
      {/* Mapa simulado del Cauca */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden rounded-lg">
        {/* Fondo del mapa con relieve simulado y enfoque en región del usuario */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cauca-morado-200 via-cauca-violeta-200 to-cauca-tierra-200 transition-all duration-1000"
          style={{
            transform: `scale(${mapZoom / 8}) translate(${(2.4448 - mapCenter.lat) * 100}px, ${(mapCenter.lng + 76.6147) * 100}px)`
          }}
        >
          {/* Simulación de montañas y ríos con enfoque en región del usuario */}
          <div className="absolute top-1/4 left-1/3 w-32 h-20 bg-cauca-tierra-400 rounded-full opacity-60"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-16 bg-cauca-tierra-500 rounded-full opacity-70"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-32 bg-cauca-azul-400 rounded-full opacity-80"></div>
          <div className="absolute top-3/4 right-1/3 w-28 h-12 bg-cauca-morado-400 rounded-full opacity-50"></div>
          
          {/* Marcador especial para la región del usuario */}
          {user?.region && (
            <div className="absolute animate-pulse bg-cauca-esperanza-400 rounded-full opacity-30 w-16 h-16" 
                 style={{
                   left: `${((getCoordsForRegion(user.region).lng + 77) * 100)}%`,
                   top: `${((3 - getCoordsForRegion(user.region).lat) * 100)}%`,
                   transform: 'translate(-50%, -50%)'
                 }}
            />
          )}
        </div>

        {/* Marcadores de incidentes */}
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer animate-pulse-gentle z-20"
            style={{
              left: `${((incident.location.lng + 77) * 100)}%`,
              top: `${((3 - incident.location.lat) * 100)}%`
            }}
            onClick={() => {
              setSelectedIncident(incident);
              onIncidentClick(incident);
            }}
          >
            <div className={`w-8 h-8 rounded-full ${getIncidentColor(incident.type, incident.severity)} flex items-center justify-center text-white text-sm shadow-lg border-2 border-white hover:scale-110 transition-transform`}>
              {getIncidentIcon(incident.type)}
            </div>
          </div>
        ))}

        {/* Marcador de ubicación del usuario */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${((userLocation.lng + 77) * 100)}%`,
              top: `${((3 - userLocation.lat) * 100)}%`
            }}
          >
            <div className="w-4 h-4 bg-cauca-esperanza-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-cauca-esperanza-200 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        {/* Etiquetas de regiones con enfoque en la región del usuario */}
        <div className="absolute top-6 left-6 text-cauca-morado-800 font-semibold text-sm bg-white/80 px-2 py-1 rounded">
          {user?.region || 'Popayán'}
        </div>
        <div className="absolute bottom-6 right-6 text-cauca-azul-800 font-semibold text-sm bg-white/80 px-2 py-1 rounded">
          Costa Pacífica
        </div>
        <div className="absolute top-1/2 right-6 text-cauca-tierra-800 font-semibold text-sm bg-white/80 px-2 py-1 rounded">
          Cordillera
        </div>
      </div>

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="sm"
          className="bg-white/90 text-cauca-morado-700 hover:bg-white shadow-lg"
        >
          <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
        
        {user?.region && (
          <Button
            onClick={handleRecenterToUser}
            size="sm"
            className="bg-cauca-morado-500 text-white hover:bg-cauca-morado-600 shadow-lg"
            title={`Volver a ${user.region}`}
          >
            🏠
          </Button>
        )}
      </div>

      {/* Información del incidente seleccionado */}
      {selectedIncident && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto shadow-xl border-cauca-morado-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getIncidentIcon(selectedIncident.type)}</span>
                <h3 className="font-semibold text-sm">{selectedIncident.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedIncident(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
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
                <Badge variant="outline" className="text-xs text-cauca-morado-600">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estadísticas rápidas */}
      <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg border border-cauca-morado-200">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="font-medium">{incidents.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-cauca-morado-500" />
            <span className="font-medium">Red Activa</span>
          </div>
          {user?.region && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-cauca-esperanza-500" />
              <span className="font-medium text-xs">{user.region}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaucaMap;
