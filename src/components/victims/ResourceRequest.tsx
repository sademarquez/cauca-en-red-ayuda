
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Package, Utensils, Shirt, Baby, Pill, Home } from 'lucide-react';

interface ResourceRequestProps {
  onSubmit: (request: any) => void;
  user: any;
}

const ResourceRequest: React.FC<ResourceRequestProps> = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    resources: [] as string[],
    peopleCount: '',
    duration: '',
    specificNeeds: '',
    deliveryAddress: '',
    contactInfo: ''
  });

  const availableResources = [
    { id: 'food', label: 'Alimentos no perecederos', icon: Utensils, description: 'Arroz, frijoles, enlatados, etc.' },
    { id: 'water', label: 'Agua potable', icon: Package, description: 'Botellas de agua, purificadores' },
    { id: 'clothing', label: 'Ropa y calzado', icon: Shirt, description: 'Ropa limpia y calzado' },
    { id: 'hygiene', label: 'Kit de higiene', icon: Package, description: 'Jabón, pasta dental, toallas' },
    { id: 'baby', label: 'Artículos para bebés', icon: Baby, description: 'Pañales, leche en polvo, biberones' },
    { id: 'medicine', label: 'Medicamentos básicos', icon: Pill, description: 'Analgésicos, antisépticos' },
    { id: 'shelter', label: 'Materiales de refugio', icon: Home, description: 'Lonas, cobijas, colchonetas' },
    { id: 'tools', label: 'Herramientas básicas', icon: Package, description: 'Linternas, pilas, herramientas' }
  ];

  const handleResourceChange = (resourceId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        resources: [...formData.resources, resourceId]
      });
    } else {
      setFormData({
        ...formData,
        resources: formData.resources.filter(id => id !== resourceId)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId: user.id,
      type: 'resource_request',
      status: 'pending'
    };

    onSubmit(request);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardTitle className="flex items-center space-x-2 text-blue-700">
          <Package className="h-5 w-5" />
          <span>Solicitar Recursos de Apoyo</span>
        </CardTitle>
        <CardDescription>
          Solicita recursos básicos que necesitas para ti y tu familia durante esta situación
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de recursos */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">¿Qué recursos necesitas? (Selecciona todos los que apliquen)</Label>
            <div className="grid grid-cols-1 gap-3">
              {availableResources.map((resource) => (
                <div key={resource.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={resource.id}
                    checked={formData.resources.includes(resource.id)}
                    onCheckedChange={(checked) => handleResourceChange(resource.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <resource.icon className="h-4 w-4 text-blue-600" />
                      <Label htmlFor={resource.id} className="font-medium cursor-pointer">
                        {resource.label}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Número de personas */}
          <div className="space-y-2">
            <Label htmlFor="peopleCount">¿Para cuántas personas son estos recursos? *</Label>
            <Input
              id="peopleCount"
              type="number"
              min="1"
              required
              placeholder="Número de personas"
              value={formData.peopleCount}
              onChange={(e) => setFormData({...formData, peopleCount: e.target.value})}
            />
          </div>

          {/* Duración estimada */}
          <div className="space-y-2">
            <Label htmlFor="duration">¿Por cuántos días necesitas estos recursos?</Label>
            <Input
              id="duration"
              placeholder="Ej: 3 días, 1 semana"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
          </div>

          {/* Necesidades específicas */}
          <div className="space-y-2">
            <Label htmlFor="specificNeeds">Necesidades específicas o comentarios adicionales</Label>
            <Textarea
              id="specificNeeds"
              placeholder="Ej: Tengo un bebé de 6 meses, necesito pañales talla M. Una persona es diabética..."
              className="min-h-20"
              value={formData.specificNeeds}
              onChange={(e) => setFormData({...formData, specificNeeds: e.target.value})}
            />
          </div>

          {/* Dirección de entrega */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Dirección donde puedes recibir los recursos *</Label>
            <Textarea
              id="deliveryAddress"
              required
              placeholder="Dirección completa, puntos de referencia, cómo llegar..."
              className="min-h-16"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
            />
          </div>

          {/* Información de contacto */}
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Información de contacto adicional</Label>
            <Input
              id="contactInfo"
              placeholder="Teléfono alternativo, WhatsApp, etc."
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
            />
          </div>

          {/* Recursos seleccionados */}
          {formData.resources.length > 0 && (
            <div className="space-y-2">
              <Label>Recursos solicitados:</Label>
              <div className="flex flex-wrap gap-2">
                {formData.resources.map(resourceId => {
                  const resource = availableResources.find(r => r.id === resourceId);
                  return (
                    <Badge key={resourceId} variant="secondary">
                      {resource?.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={formData.resources.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Enviar Solicitud de Recursos
          </Button>

          {/* Nota */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Tu solicitud será revisada por organizaciones de apoyo locales. 
              Te contactarán para confirmar la disponibilidad y coordinar la entrega.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResourceRequest;
