
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import LoginForm from '@/components/auth/LoginForm';
import CaucaMap from '@/components/map/CaucaMap';
import ReportIncident from '@/components/incidents/ReportIncident';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { MapPin, AlertTriangle, Users, Plus, Home, Settings, LogOut } from 'lucide-react';
import { Incident, UserLocation, User } from '@/types';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const [isReportSheetOpen, setIsReportSheetOpen] = useState(false);

  // Datos de ejemplo para demostración
  const sampleIncidents: Incident[] = [
    {
      id: '1',
      title: 'Bloqueo de vía principal',
      description: 'Manifestación pacífica bloqueando la vía Popayán-Cali a la altura del peaje',
      type: 'other',
      status: 'active',
      location: { lat: 2.4448, lng: -76.6147 },
      reportedBy: 'user-1',
      reportedAt: new Date('2024-06-14T10:30:00'),
      severity: 'medium',
      verified: true,
      verifiedBy: 'leader-1'
    },
    {
      id: '2',
      title: 'Deslizamiento en zona rural',
      description: 'Deslizamiento de tierra afecta acceso a veredas en la zona alta de Timbío',
      type: 'natural_disaster',
      status: 'active',
      location: { lat: 2.3444, lng: -76.6847 },
      reportedBy: 'user-2',
      reportedAt: new Date('2024-06-14T08:15:00'),
      severity: 'high',
      affectedPeople: 15,
      verified: false
    },
    {
      id: '3',
      title: 'Amenaza a líder comunitario',
      description: 'Líder social recibe amenazas por WhatsApp en el norte del Cauca',
      type: 'threat',
      status: 'investigating',
      location: { lat: 2.8448, lng: -76.4147 },
      reportedBy: 'user-3',
      reportedAt: new Date('2024-06-13T22:45:00'),
      severity: 'critical',
      verified: true,
      verifiedBy: 'leader-2'
    }
  ];

  useEffect(() => {
    // Cargar incidentes de ejemplo al iniciar
    setIncidents(sampleIncidents);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    toast({
      title: "¡Bienvenido a CaucaConecta!",
      description: `Hola ${userData.name}, ya puedes usar todas las funciones de la aplicación.`,
    });

    // Si el usuario es un líder, mostrar mensaje especial
    if (userData.role === 'leader') {
      setTimeout(() => {
        toast({
          title: "Cuenta de Líder Detectada",
          description: "Tu cuenta será verificada en las próximas 24 horas para activar funciones de coordinación.",
        });
      }, 2000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserLocation(undefined);
    setIsMenuOpen(false);
    toast({
      title: "Sesión cerrada",
      description: "Has salido de CaucaConecta. ¡Vuelve pronto!",
    });
  };

  const handleLocationUpdate = (location: UserLocation) => {
    setUserLocation(location);
    toast({
      title: "Ubicación actualizada",
      description: "Tu ubicación ha sido capturada correctamente.",
    });
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          };
          handleLocationUpdate(location);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          toast({
            title: "Error de ubicación",
            description: "No se pudo obtener tu ubicación. Puedes ingresarla manualmente.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleIncidentSubmit = async (incident: Omit<Incident, 'id' | 'reportedAt' | 'verified' | 'verifiedBy'>) => {
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      reportedAt: new Date(),
      verified: false
    };

    setIncidents(prev => [newIncident, ...prev]);
    setIsReportSheetOpen(false);
    
    toast({
      title: "Incidente reportado",
      description: "Tu reporte ha sido enviado. Los líderes comunitarios serán notificados.",
    });

    // Simular notificación a líderes
    setTimeout(() => {
      toast({
        title: "Reporte en revisión",
        description: "Un líder comunitario está revisando tu reporte para verificación.",
      });
    }, 3000);
  };

  const handleIncidentClick = (incident: Incident) => {
    console.log('Incidente seleccionado:', incident);
  };

  // Si no hay usuario logueado, mostrar login
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        user={user}
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setActiveTab('profile')}
        notificationCount={3}
      />

      {/* Menú lateral */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full cauca-gradient flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span>CaucaConecta</span>
            </SheetTitle>
            <SheetDescription>
              Red de apoyo y seguridad para el Cauca
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('map');
                setIsMenuOpen(false);
              }}
            >
              <Home className="h-4 w-4 mr-3" />
              Mapa Principal
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('incidents');
                setIsMenuOpen(false);
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-3" />
              Mis Reportes
            </Button>

            {user.role === 'leader' && (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab('network');
                  setIsMenuOpen(false);
                }}
              >
                <Users className="h-4 w-4 mr-3" />
                Mi Red
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('profile');
                setIsMenuOpen(false);
              }}
            >
              <Settings className="h-4 w-4 mr-3" />
              Perfil
            </Button>

            <div className="border-t pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Información del usuario en el menú */}
          <div className="absolute bottom-4 left-4 right-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cauca-verde-100 flex items-center justify-center">
                    <span className="text-cauca-verde-600 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.region}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.role === 'leader' ? 'Líder' : 'Ciudadano'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <main className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          {/* Mapa principal */}
          <TabsContent value="map" className="h-full m-0">
            <div className="relative h-full">
              <CaucaMap
                incidents={incidents}
                userLocation={userLocation}
                onIncidentClick={handleIncidentClick}
                onLocationUpdate={handleLocationUpdate}
              />
              
              {/* Botón flotante para reportar */}
              <Sheet open={isReportSheetOpen} onOpenChange={setIsReportSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="lg"
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-cauca-esperanza-500 hover:bg-cauca-esperanza-600 shadow-lg z-50"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
                  <div className="container mx-auto py-6">
                    <ReportIncident
                      userLocation={userLocation}
                      onSubmit={handleIncidentSubmit}
                      onLocationRequest={handleLocationRequest}
                      user={user}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </TabsContent>

          {/* Lista de incidentes */}
          <TabsContent value="incidents" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold cauca-text-gradient">Reportes Recientes</h2>
              
              {incidents.map((incident) => (
                <Card key={incident.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {incident.type === 'attack' ? '🚨' :
                           incident.type === 'displacement' ? '🏠' :
                           incident.type === 'threat' ? '⚠️' :
                           incident.type === 'natural_disaster' ? '🌊' : '📍'}
                        </span>
                        <h3 className="font-semibold">{incident.title}</h3>
                      </div>
                      <Badge 
                        variant={incident.severity === 'critical' ? 'destructive' : 'secondary'}
                      >
                        {incident.severity === 'critical' ? 'Crítico' : 
                         incident.severity === 'high' ? 'Alto' :
                         incident.severity === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{incident.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                      {incident.verified && (
                        <Badge variant="outline" className="text-cauca-verde-600">
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Red del líder */}
          {user.role === 'leader' && (
            <TabsContent value="network" className="h-full m-0 p-4 overflow-y-auto">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold cauca-text-gradient">Mi Red Comunitaria</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Red en Construcción</CardTitle>
                    <CardDescription>
                      Esta funcionalidad estará disponible una vez que tu cuenta de líder sea verificada.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Pronto podrás gestionar tu red de contactos y coordinar respuestas a emergencias.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Perfil */}
          <TabsContent value="profile" className="h-full m-0 p-4 overflow-y-auto">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold cauca-text-gradient">Mi Perfil</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nombre</Label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Región</Label>
                    <p className="text-gray-900">{user.region}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tipo de cuenta</Label>
                    <Badge variant="outline">
                      {user.role === 'leader' ? 'Líder Comunitario' : 'Ciudadano'}
                    </Badge>
                  </div>
                  
                  {user.email && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Email</Label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Teléfono</Label>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cauca-verde-600">
                        {incidents.filter(i => i.reportedBy === user.id).length}
                      </p>
                      <p className="text-sm text-gray-600">Reportes realizados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-cauca-azul-600">24h</p>
                      <p className="text-sm text-gray-600">Tiempo en la red</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
