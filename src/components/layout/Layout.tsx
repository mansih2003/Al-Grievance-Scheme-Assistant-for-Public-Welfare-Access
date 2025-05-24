import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import { LANGUAGES } from '../../lib/i18n';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      // Force a reload to ensure all translations are updated
      window.location.reload();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      changeLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="h-full sticky top-16">
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
        
        {/* Mobile sidebar */}
        <div className="md:hidden">
          {sidebarOpen && (
            <div className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black opacity-50" onClick={toggleSidebar}></div>
              <div className="absolute left-0 top-0 h-full w-64 z-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              </div>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto mb-8">
            <div className="mb-6 flex justify-end">
              <select
                className="bg-white border border-gray-300 rounded p-1 text-sm"
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                {Object.entries(LANGUAGES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            
            <Outlet />
          </div>
        </main>
      </div>
      
      <MobileNav isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Footer />
    </div>
  );
};

export default Layout;