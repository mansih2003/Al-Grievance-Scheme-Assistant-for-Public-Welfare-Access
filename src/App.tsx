import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from './stores/authStore';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/user/ProfilePage';
import SchemeListPage from './pages/schemes/SchemeListPage';
import SchemeDetailPage from './pages/schemes/SchemeDetailPage';
import ApplicationFormPage from './pages/applications/ApplicationFormPage';
import ApplicationListPage from './pages/applications/ApplicationListPage';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import GrievanceFormPage from './pages/grievances/GrievanceFormPage';
import GrievanceListPage from './pages/grievances/GrievanceListPage';
import GrievanceDetailPage from './pages/grievances/GrievanceDetailPage';
import ChatbotPage from './pages/chatbot/ChatbotPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { initialize, isLoading, isAuthenticated } = useAuthStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Initialize authentication
    initialize();
    
    // Set language based on browser or user preference
    // In a real app, this would check user preferences from database
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    i18n.changeLanguage(savedLanguage);
  }, [initialize, i18n]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
        } />
        
        {/* Routes within layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          <Route path="schemes" element={<SchemeListPage />} />
          <Route path="schemes/:id" element={<SchemeDetailPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            
            <Route path="applications" element={<ApplicationListPage />} />
            <Route path="applications/:id" element={<ApplicationDetailPage />} />
            <Route path="schemes/:id/apply" element={<ApplicationFormPage />} />
            
            <Route path="grievances" element={<GrievanceListPage />} />
            <Route path="grievances/new" element={<GrievanceFormPage />} />
            <Route path="grievances/:id" element={<GrievanceDetailPage />} />
          </Route>
          
          <Route path="assistant" element={<ChatbotPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;