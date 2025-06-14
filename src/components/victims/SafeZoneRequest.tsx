
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, MapPin, Users, Clock } from 'lucide-react';

interface SafeZoneRequestProps {
  onSubmit: (request: any) => void;
  user: any;
}

const SafeZoneRequest: React.FC<SafeZoneRequestProps> = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    reasonType: 'violence' as 'violence' | 'disaster' | 'conflict' | 'other',
    peopleCount: '',
    hasVulnerable: false,
    vulnerableDetails: '',
    currentLocation: '',
    duration: 'temporary' as 'temporary' | 'extended' | 'permanent',
    description: '',
    contactPhone: ''
  });

  const reasonTypes = [
    { value: 'violence', label: 'Violencia o amenazas', description: 'Amenazas directas, violencia armada' },
    { value: 'disaster', label: 'Desastre natural', description: 'Inundación, deslizamiento, terremoto' },
    { value: 'conflict', label: 'Conflicto armado', description: 'Combates, presencia de grupos armados' },
    { value: 'other', label: 'Otra situación peligrosa', description: 'Otra situación que requiere refugio' }
  ];

  const durationOptions = [
    { value: 'temporary', label: 'Temporal (1-3 días)', description: 'Hasta que pase el peligro inmediato' },
    { value: 'extended', label: 'Extendida (1-4 semanas)', description: 'Mientras se resuelve la situación' },
    { value: 'permanent', label: 'Permanente (reubicación)', description: 'Cambio de residencia definitivo' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId: user.id,
      type: 'safe_zone_request',
      status: 'urgent',
      priority: formData.reasonType === 'violence' ? 'critical' : 'high'
    };

    onSubmit(request);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-yellow-200">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-green-50 border-b border-yellow-200">
        <CardTitle className="flex items-center space-x-2 text-yellow-800">
          <Shield className="h-6 w-6" />
          <span>Solicitar Zona Segura / Refugio</span>
        </CardTitle>
        <CardDescription className="text-yellow-700">
          Si tu vida está en peligro y necesitas un lugar seguro, completa esta solicitud urgente
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Razón de la solicitud */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Por qué necesitas un refugio seguro? *</Label>
            <RadioGroup
              value={formData.reasonType}
              onValueChange={(value: any) => setFormData({...formData, reasonType: value})}
            >
              {reasonTypes.map((reason) => (
                <div key={reason.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
                  <Label htmlFor={reason.value} className="flex-1 cursor-pointer">
                    <div className="font-medium">{reason.label}</div>
                    <div className="text-sm text-gray-600">{reason.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Número de personas */}
          <div className="space-y-2">
            <Label htmlFor="peopleCount">¿Cuántas personas necesitan refugio? *</Label>
            <Input
              id="peopleCount"
              type="number"
              min="1"
              required
              placeholder="Número total de personas"
              value={formData.peopleCount}
              onChange={(e) => setFormData({...formData, peopleCount: e.target.value})}
            />
          </div>

          {/* Personas vulnerables */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasVulnerable"
                checked={formData.hasVulnerable}
                onChange={(e) => setFormData({...formData, hasVulnerable: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="hasVulnerable" className="cursor-pointer">
                Hay personas vulnerables en el grupo (niños, adultos mayores, personas con discapacidad, embarazadas)
              </Label>
            </div>
            
            {formData.hasVulnerable && (
              <div className="space-y-2">
                <Label htmlFor="vulnerableDetails">Detalles de las personas vulnerables *</Label>
                <Textarea
                  id="vulnerableDetails"
                  placeholder="Ej: 2 niños (3 y 7 años), 1 adulto mayor de 75 años con problemas de movilidad..."
                  value={formData.vulnerableDetails}
                  onChange={(e) => setFormData({...formData, vulnerableDetails: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* Ubicación actual */}
          <div className="space-y-2">
            <Label htmlFor="currentLocation">¿Dónde te encuentras actualmente? *</Label>
            <Textarea
              id="currentLocation"
              required
              placeholder="Describe tu ubicación actual, dirección, puntos de referencia..."
              className="min-h-16"
              value={formData.currentLocation}
              onChange={(e) => setFormData({...formData, currentLocation: e.target.value})}
            />
          </div>

          {/* Duración estimada */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Por cuánto tiempo necesitas el refugio? *</Label>
            <RadioGroup
              value={formData.duration}
              onValueChange={(value: any) => setFormData({...formData, duration: value})}
            >
              {durationOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Descripción de la situación */}
          <div className="space-y-2">
            <Label htmlFor="description">Describe tu situación actual en detalle *</Label>
            <Textarea
              id="description"
              required
              placeholder="Explica qué está pasando, qué peligros enfrentas, por qué no puedes quedarte donde estás..."
              className="min-h-24"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Teléfono de contacto */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Teléfono de contacto *</Label>
            <Input
              id="contactPhone"
              type="tel"
              required
              placeholder="Número de teléfono donde te pueden contactar"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
            />
          </div>

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3"
            size="lg"
          >
            <Shield className="h-5 w-5 mr-2" />
            Solicitar Refugio Urgente
          </Button>

          {/* Advertencia de emergencia */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              <strong>EMERGENCIA INMEDIATA:</strong> Si estás en peligro inminente:
              <br />• Policía: 123
              <br />• Línea Nacional contra la Violencia: 155
              <br />• Defensoría del Pueblo: 018000-914814
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SafeZoneRequest;
