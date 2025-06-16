
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, ArrowRight, Target, MessageSquare, Phone, Mail } from 'lucide-react';

interface VisitorsFunnelProps {
  onClose: () => void;
}

export const VisitorsFunnel: React.FC<VisitorsFunnelProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [visitorData, setVisitorData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    barrio: '',
    comuna: '',
    edad: '',
    profesion: '',
    intereses: ''
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    console.log('Visitante registrado:', visitorData);
    // Aquí se integraría con Gemini AI y n8n
    alert('¡Bienvenido a la revolución electoral! Tu perfil ha sido procesado por nuestra IA.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Embudo de Captura Electoral</h2>
                <p className="text-purple-100">Únete a la transformación política</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Indicador de Progreso */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <ArrowRight className={`h-4 w-4 mx-2 ${
                      currentStep > step ? 'text-purple-600' : 'text-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Información Personal</span>
                </CardTitle>
                <CardDescription>
                  Ayúdanos a conocerte mejor para personalizar tu experiencia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={visitorData.nombre}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, nombre: e.target.value }))}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={visitorData.apellido}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, apellido: e.target.value }))}
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={visitorData.telefono}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={visitorData.email}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 2: Información Territorial */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span>Ubicación y Perfil</span>
                </CardTitle>
                <CardDescription>
                  Tu ubicación nos ayuda a conectarte con propuestas locales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="barrio">Barrio</Label>
                    <Input
                      id="barrio"
                      value={visitorData.barrio}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, barrio: e.target.value }))}
                      placeholder="Tu barrio"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comuna">Comuna</Label>
                    <Select onValueChange={(value) => setVisitorData(prev => ({ ...prev, comuna: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu comuna" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Comuna 1</SelectItem>
                        <SelectItem value="2">Comuna 2</SelectItem>
                        <SelectItem value="3">Comuna 3</SelectItem>
                        <SelectItem value="4">Comuna 4</SelectItem>
                        <SelectItem value="5">Comuna 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      type="number"
                      value={visitorData.edad}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, edad: e.target.value }))}
                      placeholder="Tu edad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profesion">Profesión</Label>
                    <Input
                      id="profesion"
                      value={visitorData.profesion}
                      onChange={(e) => setVisitorData(prev => ({ ...prev, profesion: e.target.value }))}
                      placeholder="Tu profesión"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Atrás
                  </Button>
                  <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Intereses Políticos */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span>Tus Intereses Políticos</span>
                </CardTitle>
                <CardDescription>
                  Cuéntanos qué temas te interesan más para personalizar nuestras propuestas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="intereses">¿Qué temas políticos te interesan más?</Label>
                  <Textarea
                    id="intereses"
                    value={visitorData.intereses}
                    onChange={(e) => setVisitorData(prev => ({ ...prev, intereses: e.target.value }))}
                    placeholder="Educación, salud, empleo, seguridad, medio ambiente..."
                    rows={3}
                  />
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">🤖 Lo que sucederá después:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-600">Gemini AI</Badge>
                      <span className="text-sm">Analizará tu perfil para crear mensajes personalizados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">WhatsApp</Badge>
                      <span className="text-sm">Recibirás propuestas relevantes en tu WhatsApp</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-600">n8n</Badge>
                      <span className="text-sm">Sistema automatizado te mantendrá informado</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Atrás
                  </Button>
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Users className="h-4 w-4 mr-2" />
                    Unirse a la Revolución
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorsFunnel;
