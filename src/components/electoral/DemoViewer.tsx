
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RefreshCw, Eye, Users, MessageSquare, TrendingUp } from 'lucide-react';

interface DemoViewerProps {
  onClose: () => void;
}

export const DemoViewer: React.FC<DemoViewerProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [demoData, setDemoData] = useState({
    activeVoters: 1247,
    messagesProcessed: 856,
    aiResponses: 623,
    conversionRate: 15.8,
    realTimeEvents: []
  });

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDemoData(prev => ({
        ...prev,
        activeVoters: prev.activeVoters + Math.floor(Math.random() * 5),
        messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 3),
        aiResponses: prev.aiResponses + Math.floor(Math.random() * 2),
        conversionRate: prev.conversionRate + (Math.random() - 0.5) * 0.1,
        realTimeEvents: [
          ...prev.realTimeEvents.slice(-4),
          {
            id: Date.now(),
            type: ['message', 'conversion', 'analysis'][Math.floor(Math.random() * 3)],
            description: [
              'Nuevo votante registrado en Comuna 5',
              'Mensaje personalizado enviado via WhatsApp',
              'Análisis de sentiment completado',
              'Conversión exitosa detectada',
              'Workflow n8n ejecutado'
            ][Math.floor(Math.random() * 5)],
            timestamp: new Date()
          }
        ]
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Demo en Tiempo Real</h2>
                <p className="text-green-100">Plataforma Electoral Automatizada</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
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
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Estado en Tiempo Real */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Votantes Activos</p>
                    <p className="text-2xl font-bold text-blue-800">{demoData.activeVoters.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Mensajes IA</p>
                    <p className="text-2xl font-bold text-green-800">{demoData.messagesProcessed.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Respuestas Auto</p>
                    <p className="text-2xl font-bold text-purple-800">{demoData.aiResponses.toLocaleString()}</p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Conversión</p>
                    <p className="text-2xl font-bold text-orange-800">{demoData.conversionRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simulación de Funcionalidades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Automatización IA en Vivo</span>
                </CardTitle>
                <CardDescription>
                  Gemini AI generando mensajes personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-blue-600">Gemini AI</Badge>
                      <span className="text-sm text-gray-500">Generando...</span>
                    </div>
                    <p className="text-sm">"Hola María, veo que eres profesora en el barrio Popular. Nuestra propuesta de educación digital..."</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-green-600">WhatsApp</Badge>
                      <span className="text-sm text-gray-500">Enviado</span>
                    </div>
                    <p className="text-sm">Mensaje personalizado enviado a +57 300 123 4567</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-purple-600">n8n</Badge>
                      <span className="text-sm text-gray-500">Procesando</span>
                    </div>
                    <p className="text-sm">Workflow de seguimiento activado automáticamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Eventos en Tiempo Real</span>
                </CardTitle>
                <CardDescription>
                  Actividad de la plataforma en vivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {demoData.realTimeEvents.map((event, index) => (
                    <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'message' ? 'bg-blue-500' :
                        event.type === 'conversion' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm">{event.description}</p>
                        <p className="text-xs text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funcionalidades Demo */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Funcionalidades Demostradas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🤖 IA Conversacional</h4>
                <p className="text-sm text-gray-600">Gemini AI genera respuestas personalizadas basadas en el perfil del votante</p>
              </div>
              <div className="p-4 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📱 Comunicación P2P</h4>
                <p className="text-sm text-gray-600">WhatsApp Business API para mensajería masiva personalizada</p>
              </div>
              <div className="p-4 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">⚡ Automatización Total</h4>
                <p className="text-sm text-gray-600">n8n workflows para procesos 100% automatizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoViewer;
