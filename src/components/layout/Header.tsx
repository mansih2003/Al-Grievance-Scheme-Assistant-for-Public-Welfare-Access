import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, User, Bell, HelpCircle } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md z-20">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button 
            className="mr-3 md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center">
            <HelpCircle size={28} className="mr-2" />
            <span className="font-bold text-xl hidden sm:inline">{t('app.name')}</span>
            <span className="font-bold text-xl sm:hidden">PWSA</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          {isAuthenticated ? (
            <>
              <button className="relative p-2 mr-2" aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <Link to="/profile" className="flex items-center p-2 bg-orange-700 rounded-full">
                <User size={18} />
                <span className="ml-1 hidden md:inline truncate max-w-[100px]">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            </>
          ) : (
            <Link to="/login" className="bg-white text-orange-600 font-medium px-4 py-1.5 rounded-full text-sm">
              {t('nav.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;