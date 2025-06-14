
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Heart } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    role: 'citizen' as 'citizen' | 'leader'
  });

  const regions = [
    'Popayán', 'Patía', 'Guapi', 'Timbiquí', 'López de Micay',
    'Santander de Quilichao', 'Puerto Tejada', 'Caldono',
    'Toribío', 'Jambaló', 'Silvia', 'Páez (Belalcázar)',
    'Inzá', 'Tierradentro', 'Bolívar', 'Mercaderes',
    'Florencia', 'Sotará', 'Rosas', 'La Sierra',
    'El Tambo', 'Timbío', 'Morales', 'Piendamó',
    'Cajibío', 'Argelia', 'Balboa', 'Almaguer',
    'San Sebastián', 'Santa Rosa', 'Sucre'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = {
      id: crypto.randomUUID(),
      name: formData.name || 'Usuario Anónimo',
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      region: formData.region,
      isVerified: false,
      createdAt: new Date(),
      isAnonymous
    };

    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cauca-verde-50 via-cauca-azul-50 to-cauca-tierra-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full cauca-gradient flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl cauca-text-gradient">CaucaConecta</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Bienvenido a tu red de apoyo y seguridad
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="quick" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="quick" 
                onClick={() => setIsAnonymous(true)}
                className="text-sm"
              >
                Acceso Rápido
              </TabsTrigger>
              <TabsTrigger 
                value="complete" 
                onClick={() => setIsAnonymous(false)}
                className="text-sm"
              >
                Registro Completo
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TabsContent value="quick" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre (opcional)</Label>
                  <Input
                    id="name"
                    placeholder="¿Cómo te gustaría que te llamemos?"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Región del Cauca *</Label>
                  <select
                    id="region"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cauca-verde-500 focus:border-transparent"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  >
                    <option value="">Selecciona tu región</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-cauca-azul-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-cauca-azul-700">
                    <Heart className="h-4 w-4" />
                    <span className="text-sm font-medium">Acceso Anónimo</span>
                  </div>
                  <p className="text-xs text-cauca-azul-600 mt-1">
                    Puedes usar la aplicación sin registrarte. Tu privacidad es importante.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="complete" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regionComplete">Región del Cauca *</Label>
                  <select
                    id="regionComplete"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cauca-verde-500 focus:border-transparent"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                  >
                    <option value="">Selecciona tu región</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <Label>Tipo de cuenta</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value: 'citizen' | 'leader') => setFormData({...formData, role: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="citizen" id="citizen" />
                      <Label htmlFor="citizen" className="text-sm">
                        Ciudadano - Reportar incidentes y recibir ayuda
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="leader" id="leader" />
                      <Label htmlFor="leader" className="text-sm">
                        Líder Comunitario - Gestionar redes y coordinar apoyo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full bg-cauca-verde-500 hover:bg-cauca-verde-600 text-white py-2 rounded-lg transition-colors"
              >
                {isAnonymous ? 'Acceder' : 'Crear Cuenta'}
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
