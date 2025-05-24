import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Home, FileText, User, AlertCircle, MessageSquare, List, LogOut } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { signOut } from '../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, clearAuth } = useAuthStore();
  
  const handleLogout = async () => {
    await signOut();
    clearAuth();
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors rounded-lg ${
      isActive ? 'bg-green-100 text-green-700 font-medium' : ''
    }`;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 h-screen w-64 bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform 
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:translate-x-0 z-30`}
      >
        <div className="h-full flex flex-col pt-16">
          <div className="p-4 border-b">
            <button 
              className="md:hidden absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">{t('app.name')}</h2>
            <p className="text-sm text-gray-600">{t('app.tagline')}</p>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className={navLinkClass} onClick={toggleSidebar}>
                  <Home size={20} className="mr-3" />
                  <span>{t('nav.home')}</span>
                </NavLink>
              </li>
              
              <li>
                <NavLink to="/schemes" className={navLinkClass} onClick={toggleSidebar}>
                  <List size={20} className="mr-3" />
                  <span>{t('nav.schemes')}</span>
                </NavLink>
              </li>
              
              {isAuthenticated && (
                <>
                  <li>
                    <NavLink to="/applications" className={navLinkClass} onClick={toggleSidebar}>
                      <FileText size={20} className="mr-3" />
                      <span>{t('nav.applications')}</span>
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink to="/grievances" className={navLinkClass} onClick={toggleSidebar}>
                      <AlertCircle size={20} className="mr-3" />
                      <span>{t('nav.grievances')}</span>
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink to="/profile" className={navLinkClass} onClick={toggleSidebar}>
                      <User size={20} className="mr-3" />
                      <span>{t('nav.profile')}</span>
                    </NavLink>
                  </li>
                </>
              )}
              
              <li>
                <NavLink to="/assistant" className={navLinkClass} onClick={toggleSidebar}>
                  <MessageSquare size={20} className="mr-3" />
                  <span>{t('nav.chatbot')}</span>
                </NavLink>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span>{t('nav.logout')}</span>
              </button>
            ) : (
              <NavLink 
                to="/login" 
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                onClick={toggleSidebar}
              >
                <User size={20} className="mr-3" />
                <span>{t('nav.login')}</span>
              </NavLink>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;