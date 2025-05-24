import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, FileText, User, AlertCircle, MessageSquare } from 'lucide-react';
import useAuthStore from '../../stores/authStore';

interface MobileNavProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const MobileNav = ({ isOpen, toggleSidebar }: MobileNavProps) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  
  // Hide the mobile navigation bar when the sidebar is open
  if (isOpen) {
    return null;
  }
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex flex-col items-center justify-center text-xs ${
      isActive ? 'text-green-600' : 'text-gray-500'
    }`;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-5 h-16">
        <NavLink to="/" className={navLinkClass}>
          <Home size={20} className="mb-1" />
          <span>{t('nav.home')}</span>
        </NavLink>
        
        <NavLink to="/schemes" className={navLinkClass}>
          <FileText size={20} className="mb-1" />
          <span>{t('nav.schemes')}</span>
        </NavLink>
        
        {isAuthenticated ? (
          <NavLink to="/applications" className={navLinkClass}>
            <AlertCircle size={20} className="mb-1" />
            <span>{t('nav.applications')}</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={navLinkClass}>
            <User size={20} className="mb-1" />
            <span>{t('nav.login')}</span>
          </NavLink>
        )}
        
        <NavLink to="/assistant" className={navLinkClass}>
          <MessageSquare size={20} className="mb-1" />
          <span>{t('nav.chatbot')}</span>
        </NavLink>
        
        {isAuthenticated && (
          <NavLink to="/profile" className={navLinkClass}>
            <User size={20} className="mb-1" />
            <span>{t('nav.profile')}</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default MobileNav;