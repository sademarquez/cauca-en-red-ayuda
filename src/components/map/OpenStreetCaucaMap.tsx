
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle, Users, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Incident, UserLocation, User } from '@/types';
import { getCoordsForRegion } from '@/utils/municipiosCoords';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OpenStreetCaucaMapProps {
  incidents: Incident[];
  userLocation?: UserLocation;
  onIncidentClick: (incident: Incident) => void;
  onLocationUpdate: (location: UserLocation) => void;
  user?: User;
}

const OpenStreetCaucaMap: React.FC<OpenStreetCaucaMapProps> = ({
  incidents,
  userLocation,
  onIncidentClick,
  onLocationUpdate,
  user
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Inicializar el mapa
  useEffect(() => {
    if (!mapRef.current) return;

    // Coordenadas del centro del Cauca
    const caucaCenter = user?.region ? 
      getCoordsForRegion(user.region) : 
      { lat: 2.4448, lng: -76.6147, zoom: 8 };

    // Crear el mapa de Leaflet
    leafletMapRef.current = L.map(mapRef.current, {
      center: [caucaCenter.lat, caucaCenter.lng],
      zoom: caucaCenter.zoom,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true
    });

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 6
    }).addTo(leafletMapRef.current);

    // Limpiar al desmontar
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [user?.region]);

  // Función para obtener el color del incidente
  const getIncidentColor = (type: Incident['type'], severity: Incident['severity']) => {
    const colors = {
      'attack': severity === 'critical' ? '#dc2626' : '#ef4444',
      'displacement': severity === 'critical' ? '#ea580c' : '#f97316',
      'threat': severity === 'critical' ? '#d97706' : '#f59e0b',
      'natural_disaster': severity === 'critical' ? '#2563eb' : '#3b82f6',
      'other': severity === 'critical' ? '#475569' : '#64748b'
    };
    return colors[type];
  };

  // Función para obtener el emoji del incidente
  const getIncidentIcon = (type: Incident['type']) => {
    const icons = {
      'attack': '🚨',
      'displacement': '🏠',
      'threat': '⚠️',
      'natural_disaster': '🌊',
      'other': '📍'
    };
    return icons[type];
  };

  // Actualizar marcadores de incidentes
  useEffect(() => {
    if (!leafletMapRef.current) return;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => {
      leafletMapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Añadir nuevos marcadores de incidentes
    incidents.forEach((incident) => {
      const color = getIncidentColor(incident.type, incident.severity);
      const emoji = getIncidentIcon(incident.type);
      
      // Crear icono personalizado con emoji
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 16px;
          ">
            ${emoji}
          </div>
        `,
        className: 'custom-incident-marker',
        iconSize: [35, 35],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([incident.location.lat, incident.location.lng], {
        icon: customIcon
      });

      // Popup con información del incidente
      const popupContent = `
        <div style="min-width: 200px;">
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="margin-right: 8px; font-size: 18px;">${emoji}</span>
            <strong>${incident.title}</strong>
          </div>
          <p style="margin: 4px 0; font-size: 14px; color: #666;">
            ${incident.description}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span style="
              background: ${incident.severity === 'critical' ? '#dc2626' : '#64748b'};
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 12px;
            ">
              ${incident.severity === 'critical' ? 'Crítico' : 
                incident.severity === 'high' ? 'Alto' :
                incident.severity === 'medium' ? 'Medio' : 'Bajo'}
            </span>
            ${incident.verified ? '<span style="color: #16a34a; font-size: 12px;">✓ Verificado</span>' : ''}
          </div>
          <div style="margin-top: 4px; font-size: 12px; color: #888;">
            ${new Date(incident.reportedAt).toLocaleDateString()}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        setSelectedIncident(incident);
        onIncidentClick(incident);
      });

      marker.addTo(leafletMapRef.current!);
      markersRef.current.push(marker);
    });
  }, [incidents, onIncidentClick]);

  // Marcador de ubicación del usuario
  useEffect(() => {
    if (!leafletMapRef.current || !userLocation) return;

    const userIcon = L.divIcon({
      html: `
        <div style="
          background-color: #22c55e;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'user-location-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon
    });

    userMarker.bindPopup('Tu ubicación actual');
    userMarker.addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(userMarker);
      }
    };
  }, [userLocation]);

  // Marcador especial para la región del usuario
  useEffect(() => {
    if (!leafletMapRef.current || !user?.region) return;

    const regionCoords = getCoordsForRegion(user.region);
    
    const regionIcon = L.divIcon({
      html: `
        <div style="
          background-color: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          white-space: nowrap;
        ">
          🏠 ${user.region}
        </div>
      `,
      className: 'region-marker',
      iconSize: [100, 30],
      iconAnchor: [50, 15]
    });

    const regionMarker = L.marker([regionCoords.lat, regionCoords.lng], {
      icon: regionIcon
    });

    regionMarker.bindPopup(`Tu región: ${user.region}`);
    regionMarker.addTo(leafletMapRef.current);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.removeLayer(regionMarker);
      }
    };
  }, [user?.region]);

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
          
          // Centrar el mapa en la nueva ubicación
          if (leafletMapRef.current) {
            leafletMapRef.current.setView([newLocation.lat, newLocation.lng], 14);
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

  const handleRecenterToUser = () => {
    if (user?.region && leafletMapRef.current) {
      const coords = getCoordsForRegion(user.region);
      leafletMapRef.current.setView([coords.lat, coords.lng], coords.zoom);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Contenedor del mapa */}
      <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />

      {/* Controles del mapa */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
        <Button
          onClick={handleGetLocation}
          disabled={isLocating}
          size="sm"
          className="bg-white/95 text-cauca-gris-700 hover:bg-white shadow-lg border border-cauca-gris-200"
        >
          <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
        </Button>
        
        {user?.region && (
          <Button
            onClick={handleRecenterToUser}
            size="sm"
            className="bg-cauca-azul-500 text-white hover:bg-cauca-azul-600 shadow-lg"
            title={`Volver a ${user.region}`}
          >
            🏠
          </Button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-3 shadow-lg border border-cauca-gris-200 backdrop-blur-sm z-[1000]">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-cauca-rojo-500" />
            <span className="font-medium text-cauca-gris-800">{incidents.length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-cauca-azul-500" />
            <span className="font-medium text-cauca-gris-700">Red Activa</span>
          </div>
          {user?.region && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-cauca-verde-500" />
              <span className="font-medium text-xs text-cauca-verde-700">{user.region}</span>
            </div>
          )}
        </div>
      </div>

      {/* Información del incidente seleccionado */}
      {selectedIncident && (
        <Card className="absolute bottom-4 left-4 right-4 max-w-sm mx-auto shadow-xl border-cauca-gris-200 bg-white/95 backdrop-blur-sm z-[1000]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getIncidentIcon(selectedIncident.type)}</span>
                <h3 className="font-semibold text-sm text-cauca-gris-800">{selectedIncident.title}</h3>
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
                <Badge variant="outline" className="text-xs text-cauca-azul-600 border-cauca-azul-300">
                  ✓ Verificado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OpenStreetCaucaMap;
