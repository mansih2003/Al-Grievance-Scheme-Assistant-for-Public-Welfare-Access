import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mb-4">{t('common.notFound')}</p>
      <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition-colors"
      >
        <Home size={18} className="mr-2" />
        {t('common.goHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;