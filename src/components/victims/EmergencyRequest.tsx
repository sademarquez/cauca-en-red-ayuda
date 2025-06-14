
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Siren, Users, Home, Heart, Utensils, Phone } from 'lucide-react';

interface EmergencyRequestProps {
  onSubmit: (request: any) => void;
  user: any;
}

const EmergencyRequest: React.FC<EmergencyRequestProps> = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    urgency: 'high' as 'critical' | 'high' | 'medium',
    requestType: 'medical' as 'medical' | 'shelter' | 'food' | 'evacuation' | 'protection' | 'other',
    peopleAffected: '',
    description: '',
    contactMethod: 'phone' as 'phone' | 'whatsapp' | 'sms',
    hasMinors: false,
    hasElderly: false,
    hasDisabilities: false
  });

  const urgencyLevels = [
    { value: 'critical', label: 'CRÍTICO - Peligro inmediato', color: 'bg-red-600 text-white' },
    { value: 'high', label: 'ALTO - Necesita ayuda pronto', color: 'bg-orange-500 text-white' },
    { value: 'medium', label: 'MEDIO - Puede esperar', color: 'bg-yellow-500 text-white' }
  ];

  const requestTypes = [
    { value: 'medical', label: 'Asistencia Médica', icon: Heart, description: 'Heridos, enfermos, medicamentos' },
    { value: 'evacuation', label: 'Evacuación', icon: Users, description: 'Necesito salir del área peligrosa' },
    { value: 'shelter', label: 'Refugio/Alojamiento', icon: Home, description: 'Lugar seguro para dormir' },
    { value: 'food', label: 'Comida y Agua', icon: Utensils, description: 'Alimentos y agua potable' },
    { value: 'protection', label: 'Protección', icon: Siren, description: 'Amenazas, violencia, inseguridad' },
    { value: 'other', label: 'Otro', icon: Phone, description: 'Otra necesidad urgente' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId: user.id,
      status: 'pending',
      location: user.lastKnownLocation || null
    };

    onSubmit(request);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-red-200">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200">
        <CardTitle className="flex items-center space-x-2 text-red-700">
          <Siren className="h-6 w-6 animate-pulse" />
          <span>Solicitud de Ayuda de Emergencia</span>
        </CardTitle>
        <CardDescription className="text-red-600">
          Completa este formulario para solicitar ayuda inmediata. Tu solicitud será enviada a líderes y organizaciones de apoyo.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nivel de urgencia */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Qué tan urgente es tu situación? *</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value: any) => setFormData({...formData, urgency: value})}
            >
              {urgencyLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <Badge className={level.color}>
                      {level.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Tipo de ayuda */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Qué tipo de ayuda necesitas? *</Label>
            <RadioGroup
              value={formData.requestType}
              onValueChange={(value: any) => setFormData({...formData, requestType: value})}
            >
              <div className="grid grid-cols-1 gap-3">
                {requestTypes.map((type) => (
                  <div key={type.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50">
                    <RadioGroupItem value={type.value} id={type.value} />
                    <type.icon className="h-5 w-5 text-blue-600" />
                    <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Personas afectadas */}
          <div className="space-y-2">
            <Label htmlFor="peopleAffected">¿Cuántas personas necesitan ayuda? *</Label>
            <Input
              id="peopleAffected"
              type="number"
              min="1"
              required
              placeholder="Número de personas"
              value={formData.peopleAffected}
              onChange={(e) => setFormData({...formData, peopleAffected: e.target.value})}
            />
          </div>

          {/* Grupos vulnerables */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">¿Hay personas en situación vulnerable?</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasMinors}
                  onChange={(e) => setFormData({...formData, hasMinors: e.target.checked})}
                  className="rounded"
                />
                <span>Hay niños menores de 12 años</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasElderly}
                  onChange={(e) => setFormData({...formData, hasElderly: e.target.checked})}
                  className="rounded"
                />
                <span>Hay adultos mayores (65+ años)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasDisabilities}
                  onChange={(e) => setFormData({...formData, hasDisabilities: e.target.checked})}
                  className="rounded"
                />
                <span>Hay personas con discapacidad</span>
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Describe tu situación en detalle *</Label>
            <Textarea
              id="description"
              required
              placeholder="Explica qué está pasando, dónde estás, qué ayuda específica necesitas..."
              className="min-h-24"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Método de contacto */}
          <div className="space-y-3">
            <Label>¿Cómo prefieres que te contacten? *</Label>
            <RadioGroup
              value={formData.contactMethod}
              onValueChange={(value: any) => setFormData({...formData, contactMethod: value})}
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone">Llamada telefónica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms" />
                  <Label htmlFor="sms">Mensaje SMS</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Botón de envío */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3"
              size="lg"
            >
              <Siren className="h-5 w-5 mr-2" />
              Enviar Solicitud de Ayuda
            </Button>
          </div>

          {/* Nota importante */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              <strong>IMPORTANTE:</strong> Si estás en peligro inmediato, llama también a:
              <br />• Policía: 123
              <br />• Bomberos: 119  
              <br />• Cruz Roja: 132
              <br />• Defensa Civil: 144
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmergencyRequest;
