
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Camera, Send, AlertTriangle } from 'lucide-react';
import { Incident, UserLocation } from '@/types';

interface ReportIncidentProps {
  userLocation?: UserLocation;
  onSubmit: (incident: Omit<Incident, 'id' | 'reportedAt' | 'verified' | 'verifiedBy'>) => void;
  onLocationRequest: () => void;
  user: any;
}

const ReportIncident: React.FC<ReportIncidentProps> = ({
  userLocation,
  onSubmit,
  onLocationRequest,
  user
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'other' as Incident['type'],
    severity: 'medium' as Incident['severity'],
    affectedPeople: '',
    location: userLocation || null,
    manualAddress: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const incidentTypes = [
    { value: 'attack', label: 'Ataque o Violencia', icon: '🚨' },
    { value: 'displacement', label: 'Desplazamiento', icon: '🏠' },
    { value: 'threat', label: 'Amenaza', icon: '⚠️' },
    { value: 'natural_disaster', label: 'Desastre Natural', icon: '🌊' },
    { value: 'other', label: 'Otro', icon: '📍' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Bajo', color: 'text-green-600' },
    { value: 'medium', label: 'Medio', color: 'text-yellow-600' },
    { value: 'high', label: 'Alto', color: 'text-orange-600' },
    { value: 'critical', label: 'Crítico', color: 'text-red-600' }
  ];

  useEffect(() => {
    if (userLocation) {
      setFormData(prev => ({ ...prev, location: userLocation }));
    }
  }, [userLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const incident: Omit<Incident, 'id' | 'reportedAt' | 'verified' | 'verifiedBy'> = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        severity: formData.severity,
        status: 'active',
        location: formData.location ? {
          lat: formData.location.lat,
          lng: formData.location.lng,
          address: formData.manualAddress || undefined
        } : {
          lat: 2.4448, // Centro del Cauca por defecto
          lng: -76.6147,
          address: formData.manualAddress
        },
        reportedBy: user.id,
        affectedPeople: formData.affectedPeople ? parseInt(formData.affectedPeople) : undefined
      };

      await onSubmit(incident);
      
      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        type: 'other',
        severity: 'medium',
        affectedPeople: '',
        location: userLocation || null,
        manualAddress: ''
      });

    } catch (error) {
      console.error('Error al reportar incidente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-cauca-verde-50 to-cauca-azul-50">
        <CardTitle className="flex items-center space-x-2 text-cauca-verde-700">
          <AlertTriangle className="h-5 w-5" />
          <span>Reportar Incidente</span>
        </CardTitle>
        <CardDescription>
          Ayúdanos a mantener segura nuestra comunidad reportando situaciones importantes
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título del incidente */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del incidente *</Label>
            <Input
              id="title"
              required
              placeholder="Describe brevemente lo que está sucediendo"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Tipo de incidente */}
          <div className="space-y-3">
            <Label>Tipo de incidente *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: Incident['type']) => setFormData({...formData, type: value})}
            >
              {incidentTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-lg">{type.icon}</span>
                    <span>{type.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Nivel de severidad */}
          <div className="space-y-3">
            <Label>Nivel de severidad *</Label>
            <RadioGroup
              value={formData.severity}
              onValueChange={(value: Incident['severity']) => setFormData({...formData, severity: value})}
            >
              <div className="grid grid-cols-2 gap-2">
                {severityLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value} className={`cursor-pointer ${level.color} font-medium`}>
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción detallada *</Label>
            <Textarea
              id="description"
              required
              placeholder="Proporciona todos los detalles importantes sobre lo que está ocurriendo..."
              className="min-h-24"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Personas afectadas */}
          <div className="space-y-2">
            <Label htmlFor="affectedPeople">Número de personas afectadas (opcional)</Label>
            <Input
              id="affectedPeople"
              type="number"
              min="1"
              placeholder="¿Cuántas personas están involucradas?"
              value={formData.affectedPeople}
              onChange={(e) => setFormData({...formData, affectedPeople: e.target.value})}
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-4">
            <Label>Ubicación del incidente</Label>
            
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onLocationRequest}
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>Usar mi ubicación actual</span>
              </Button>
              
              {formData.location && (
                <div className="text-sm text-cauca-verde-600 font-medium">
                  ✓ Ubicación capturada
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manualAddress">Dirección o descripción del lugar</Label>
              <Input
                id="manualAddress"
                placeholder="Ej: Calle 5 #23-45, Barrio El Centro, Popayán"
                value={formData.manualAddress}
                onChange={(e) => setFormData({...formData, manualAddress: e.target.value})}
              />
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-cauca-verde-500 hover:bg-cauca-verde-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Reporte
                </>
              )}
            </Button>
          </div>

          {/* Nota de privacidad */}
          <div className="bg-cauca-azul-50 p-4 rounded-lg">
            <p className="text-sm text-cauca-azul-700">
              <strong>Tu seguridad es lo más importante.</strong> Este reporte será compartido 
              con líderes comunitarios verificados para coordinar ayuda. Si estás en peligro 
              inmediato, contacta a las autoridades locales.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportIncident;
