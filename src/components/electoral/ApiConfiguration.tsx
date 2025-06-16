
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Key, Bot, MessageSquare, Workflow, Eye, EyeOff } from 'lucide-react';
import { ApiConfig } from '@/types/electoral';

interface ApiConfigurationProps {
  onConfigSave: (config: ApiConfig) => void;
}

export const ApiConfiguration: React.FC<ApiConfigurationProps> = ({ onConfigSave }) => {
  const [config, setConfig] = useState<ApiConfig>({
    geminiApiKey: '',
    sellerChatApiKey: '',
    n8nWebhookUrl: ''
  });
  const [showKeys, setShowKeys] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onConfigSave(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-purple-600" />
          <span>Configuración de APIs</span>
        </CardTitle>
        <CardDescription>
          Configura las claves de API para activar la automatización completa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <strong>Acceso Gratuito:</strong> Las claves se proporcionarán al final del desarrollo. 
            Por ahora puedes usar el sistema en modo demo.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Claves de API</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="gemini" className="flex items-center space-x-2 mb-2">
                <Bot className="h-4 w-4 text-blue-600" />
                <span>Gemini AI API Key</span>
                <Badge variant="outline" className="text-blue-600">Requerida</Badge>
              </Label>
              <Input
                id="gemini"
                type={showKeys ? 'text' : 'password'}
                value={config.geminiApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                placeholder="AIzaSyC-..."
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                {config.geminiApiKey ? `Configurada: ${maskKey(config.geminiApiKey)}` : 'Se proporcionará al finalizar el desarrollo'}
              </p>
            </div>

            <div>
              <Label htmlFor="sellerchat" className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                <span>SellerChat API Key</span>
                <Badge variant="outline" className="text-green-600">WhatsApp</Badge>
              </Label>
              <Input
                id="sellerchat"
                type={showKeys ? 'text' : 'password'}
                value={config.sellerChatApiKey}
                onChange={(e) => setConfig(prev => ({ ...prev, sellerChatApiKey: e.target.value }))}
                placeholder="sc_..."
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                {config.sellerChatApiKey ? `Configurada: ${maskKey(config.sellerChatApiKey)}` : 'Se proporcionará al finalizar el desarrollo'}
              </p>
            </div>

            <div>
              <Label htmlFor="n8n" className="flex items-center space-x-2 mb-2">
                <Workflow className="h-4 w-4 text-purple-600" />
                <span>n8n Webhook URL</span>
                <Badge variant="outline" className="text-purple-600">Automatización</Badge>
              </Label>
              <Input
                id="n8n"
                type="url"
                value={config.n8nWebhookUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, n8nWebhookUrl: e.target.value }))}
                placeholder="https://your-n8n.com/webhook/..."
                disabled
              />
              <p className="text-sm text-gray-500 mt-1">
                {config.n8nWebhookUrl ? 'Configurada' : 'Se proporcionará al finalizar el desarrollo'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Estado del Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Gemini AI</span>
              <Badge variant="outline" className="text-yellow-600">Demo</Badge>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">WhatsApp</span>
              <Badge variant="outline" className="text-yellow-600">Demo</Badge>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">n8n</span>
              <Badge variant="outline" className="text-yellow-600">Demo</Badge>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled
        >
          {saved ? '✓ Configuración Guardada' : 'Guardar Configuración (Disponible al Final)'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiConfiguration;
