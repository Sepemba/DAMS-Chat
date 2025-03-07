import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, User as UserIcon, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateUserVisibility } from '../utils/storage';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleVisibility = () => {
    if (user) {
      updateUserVisibility(user.id, !user.isVisible);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">DAMS Chat</h1>
        
        {user && (
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/chat')}
              className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded-md"
            >
              <MessageSquare size={20} />
              <span>Chat</span>
            </button>
            
            <button 
              onClick={() => navigate('/feed')}
              className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded-md"
            >
              <Users size={20} />
              <span>Feed</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded-md"
            >
              <UserIcon size={20} />
              <span>Perfil</span>
            </button>

            <button
              onClick={toggleVisibility}
              className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded-md"
              title={user.isVisible ? 'Ficar invisível' : 'Ficar visível'}
            >
              {user.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-blue-700 p-2 rounded-md"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;