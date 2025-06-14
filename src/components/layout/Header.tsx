
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu, User, Shield } from "lucide-react";
import { User as UserType } from '@/types';

interface HeaderProps {
  user?: UserType;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMenuClick, 
  onProfileClick, 
  notificationCount = 0 
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CaucaConecta</h1>
              <p className="text-sm text-gray-600">Red de Apoyo y Seguridad</p>
            </div>
          </div>

          {/* Estado de conexión */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              En Línea
            </Badge>
            <span className="text-sm text-gray-600">
              {new Date().toLocaleDateString('es-CO')}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onProfileClick}>
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
