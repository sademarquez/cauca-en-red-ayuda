
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, MapPin, Camera } from "lucide-react";
import { Incident, UserLocation, User } from '@/types';

interface ReportIncidentProps {
  userLocation?: UserLocation;
  onSubmit: (incident: Omit<Incident, 'id' | 'reportedAt' | 'verified' | 'verifiedBy'>) => Promise<void>;
  onLocationRequest: () => void;
  user: User;
}

export const ReportIncident: React.FC<ReportIncidentProps> = ({
  userLocation,
  onSubmit,
  onLocationRequest,
  user
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as Incident['type'] | '',
    location: userLocation ? `${userLocation.lat}, ${userLocation.lng}` : '',
    severity: '' as Incident['severity'] | '',
    affectedPeople: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.severity) return;
    
    setLoading(true);

    try {
      const incident: Omit<Incident, 'id' | 'reportedAt' | 'verified' | 'verifiedBy'> = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: 'active',
        location: {
          lat: userLocation?.lat || 2.4448,
          lng: userLocation?.lng || -76.6147,
          address: formData.location || user.region,
          municipality: user.region
        },
        reportedBy: user.id,
        severity: formData.severity,
        affectedPeople: formData.affectedPeople ? parseInt(formData.affectedPeople) : undefined
      };

      await onSubmit(incident);
      
      setLoading(false);
      setSuccess(true);
      // Resetear formulario
      setFormData({
        title: '',
        description: '',
        type: '',
        location: userLocation ? `${userLocation.lat}, ${userLocation.lng}` : '',
        severity: '',
        affectedPeople: ''
      });
    } catch (error) {
      setLoading(false);
      console.error('Error enviando reporte:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Reportar Incidente
        </CardTitle>
        <CardDescription>
          Reporta un incidente de seguridad o emergencia en tu comunidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              Reporte enviado exitosamente. Gracias por contribuir a la seguridad de la comunidad.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título del incidente</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Resumen breve del incidente"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de incidente</Label>
            <Select onValueChange={(value) => handleChange('type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de incidente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attack">Ataque armado</SelectItem>
                <SelectItem value="displacement">Desplazamiento forzado</SelectItem>
                <SelectItem value="threat">Amenaza</SelectItem>
                <SelectItem value="natural_disaster">Desastre natural</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Nivel de severidad</Label>
            <Select onValueChange={(value) => handleChange('severity', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel de severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Bajo</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Ubicación</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Municipio, vereda, barrio"
                required
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={onLocationRequest}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="affectedPeople">Personas afectadas (aproximado)</Label>
            <Input
              id="affectedPeople"
              type="number"
              value={formData.affectedPeople}
              onChange={(e) => handleChange('affectedPeople', e.target.value)}
              placeholder="Número de personas afectadas"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción detallada</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe los detalles del incidente..."
              required
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Enviando...' : 'Enviar Reporte'}
            </Button>
            <Button type="button" variant="outline" size="sm">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
