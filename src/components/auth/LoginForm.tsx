
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, UserPlus } from "lucide-react";
import { User } from '@/types';

interface LoginFormProps {
  onLogin: (userData: User) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [role, setRole] = useState<'citizen' | 'leader'>('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Intentando autenticación:', { email, isLogin });
      
      // Simulación de autenticación exitosa
      setTimeout(() => {
        const userData: User = {
          id: crypto.randomUUID(),
          name: isLogin ? 'Usuario Caucano' : name,
          email,
          role,
          region: region || 'Popayán',
          verified: true,
          createdAt: new Date(),
          lastAccess: new Date()
        };
        
        setLoading(false);
        onLogin(userData);
      }, 1000);
    } catch (err) {
      setError('Error en la autenticación. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">CC</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            {isLogin ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            CaucaConecta
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Ingresa a tu cuenta' : 'Crea una cuenta nueva'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="region">Municipio</Label>
                  <Input
                    id="region"
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required={!isLogin}
                    placeholder="Ej: Popayán, Santander de Quilichao"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Tipo de cuenta</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'citizen' | 'leader')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="citizen">Ciudadano</option>
                    <option value="leader">Líder Comunitario</option>
                  </select>
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Tu contraseña"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" disabled={loading}>
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
