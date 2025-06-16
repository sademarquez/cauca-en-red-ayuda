
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Target, TrendingUp, MessageSquare, BarChart3, Settings, Play, Crown } from 'lucide-react';
import { ElectoralMetrics, Voter, Campaign } from '@/types/electoral';

interface ElectoralDashboardProps {
  onDemoClick: () => void;
  onVisitorsClick: () => void;
}

export const ElectoralDashboard: React.FC<ElectoralDashboardProps> = ({
  onDemoClick,
  onVisitorsClick
}) => {
  const [metrics, setMetrics] = useState<ElectoralMetrics>({
    totalVoters: 15420,
    probabilidadVotoPromedio: 0.73,
    coberturaTerritorial: 85,
    tasaConversion: 12.4,
    sentimentScore: 0.65,
    engagementRate: 8.7
  });

  const [activeCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      candidateId: '1',
      nombre: 'Campaña Digital Zona Norte',
      tipo: 'digital',
      audienciaObjetivo: { edad: '25-45', estrato: '3-4' },
      mensajePrincipal: 'Transformación y progreso para todos',
      estado: 'activa',
      fechaInicio: new Date('2024-06-01'),
      fechaFin: new Date('2024-10-27'),
      presupuesto: 50000000,
      roi: 15.2,
      createdAt: new Date('2024-06-01')
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
      {/* Header de Comando Central */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Mesa Redonda Electoral
              </h1>
              <p className="text-xl text-gray-600">Base de Operaciones - Comando Central</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={onDemoClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Demo en Vivo
            </Button>
            <Button 
              onClick={onVisitorsClick}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Embudo de Visitantes
            </Button>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Votantes</p>
                  <p className="text-2xl font-bold">{metrics.totalVoters.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Prob. Voto</p>
                  <p className="text-2xl font-bold">{(metrics.probabilidadVotoPromedio * 100).toFixed(1)}%</p>
                </div>
                <Target className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Cobertura</p>
                  <p className="text-2xl font-bold">{metrics.coberturaTerritorial}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Conversión</p>
                  <p className="text-2xl font-bold">{metrics.tasaConversion}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Sentiment</p>
                  <p className="text-2xl font-bold">{(metrics.sentimentScore * 100).toFixed(0)}%</p>
                </div>
                <MessageSquare className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Engagement</p>
                  <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
                </div>
                <Users className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panel de Control Principal */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="voters">Base Electoral</TabsTrigger>
          <TabsTrigger value="automation">Automatización</TabsTrigger>
          <TabsTrigger value="analytics">Analytics IA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span>Estado de la Mesa Redonda</span>
                </CardTitle>
                <CardDescription>
                  Comando central de operaciones electorales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Campañas Activas</span>
                    <Badge className="bg-green-100 text-green-800">
                      {activeCampaigns.filter(c => c.estado === 'activa').length} en vivo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automatización IA</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      Gemini AI Activo
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Comunicación P2P</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      WhatsApp + SMS
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Workflows n8n</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      12 Activos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jerarquía Organizacional</CardTitle>
                <CardDescription>
                  Estructura descendente del partido político
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <span className="font-semibold">Comando Central</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg ml-4">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Líderes Regionales</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg ml-8">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span>Equipos Territoriales</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg ml-12">
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <span>Base Electoral</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campañas Automatizadas</CardTitle>
              <CardDescription>
                Gestión inteligente con IA y comunicación multicanal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Sistema en Construcción
                </h3>
                <p className="text-gray-600 mb-6">
                  La mesa redonda electoral está siendo preparada para el comando total
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Gemini AI</h4>
                    <p className="text-sm text-blue-600">Generación automática de mensajes</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">WhatsApp API</h4>
                    <p className="text-sm text-green-600">Comunicación P2P masiva</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800">n8n Workflows</h4>
                    <p className="text-sm text-purple-600">Automatización total</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Base de Datos Electoral</CardTitle>
              <CardDescription>
                Gestión inteligente de votantes con IA predictiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Base Electoral en Preparación
                </h3>
                <p className="text-gray-600">
                  Sistema de captura y análisis de votantes con Gemini AI
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automatización n8n</CardTitle>
              <CardDescription>
                Workflows inteligentes para campaña 100% automatizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Workflows en Configuración
                </h3>
                <p className="text-gray-600">
                  Preparando automatización total con n8n + Gemini AI
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics con IA</CardTitle>
              <CardDescription>
                Análisis predictivo y optimización con Gemini AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Analytics Predictivos
                </h3>
                <p className="text-gray-600">
                  Sistema de análisis en tiempo real con Gemini AI
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectoralDashboard;
