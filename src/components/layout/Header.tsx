
import React from 'react';
import { User, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  user?: any;
  onMenuClick: () => void;
  onProfileClick: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onMenuClick, 
  onProfileClick, 
  notificationCount = 0 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo y menú */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="text-cauca-verde-600 hover:text-cauca-verde-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full cauca-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">CC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg cauca-text-gradient">CaucaConecta</h1>
              <p className="text-xs text-gray-600">Red de Apoyo</p>
            </div>
          </div>
        </div>

        {/* Acciones del usuario */}
        <div className="flex items-center space-x-2">
          {/* Notificaciones */}
          <Button
            variant="ghost"
            size="sm"
            className="relative text-gray-600 hover:text-cauca-verde-600"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Perfil */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="flex items-center space-x-2 text-gray-700 hover:text-cauca-verde-600"
          >
            <div className="w-8 h-8 rounded-full bg-cauca-verde-100 flex items-center justify-center">
              <User className="h-4 w-4 text-cauca-verde-600" />
            </div>
            {user && (
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'leader' ? 'Líder' : 'Ciudadano'}
                </p>
              </div>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
