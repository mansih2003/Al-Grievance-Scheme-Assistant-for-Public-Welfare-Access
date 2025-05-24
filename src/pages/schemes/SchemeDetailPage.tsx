import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink, FileText, CheckCircle, Info, Download } from 'lucide-react';
import useSchemeStore from '../../stores/schemeStore';
import useAuthStore from '../../stores/authStore';

const SchemeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { fetchSchemeById, currentScheme, isLoading, error } = useSchemeStore();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (id) {
      fetchSchemeById(id);
    }
  }, [id, fetchSchemeById]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  if (error || !currentScheme) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-red-500 mb-4">{error || 'Scheme not found'}</p>
        <Link
          to="/schemes"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to Schemes
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Scheme header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentScheme.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {currentScheme.ministry}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {currentScheme.category}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Link
                to={`/schemes/${currentScheme.id}/apply`}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                <FileText size={18} className="mr-2" />
                {t('schemes.apply')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                {t('nav.login')} to Apply
              </Link>
            )}
            
            {currentScheme.official_website && (
              <a
                href={currentScheme.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <ExternalLink size={18} className="mr-2" />
                {t('schemes.viewWebsite')}
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Scheme details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t('schemes.details')}</h2>
            <p className="text-gray-700 whitespace-pre-line">{currentScheme.description}</p>
          </div>
          
          {/* Benefits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t('schemes.benefits')}</h2>
            <p className="text-gray-700 whitespace-pre-line">{currentScheme.benefits}</p>
          </div>
          
          {/* Documents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t('schemes.requiredDocuments')}</h2>
            <ul className="space-y-2">
              {currentScheme.required_documents.map((doc, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eligibility */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">{t('schemes.eligibilityCriteria')}</h2>
            <p className="text-gray-700 whitespace-pre-line mb-4">{currentScheme.eligibility_criteria}</p>
            
            <div className="space-y-4">
              {currentScheme.income_limit && (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Info className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Income Limit</p>
                    <p className="font-medium">₹{currentScheme.income_limit.toLocaleString()}/year</p>
                  </div>
                </div>
              )}
              
              {(currentScheme.age_min || currentScheme.age_max) && (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Info className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age Requirement</p>
                    <p className="font-medium">
                      {currentScheme.age_min && currentScheme.age_max
                        ? `${currentScheme.age_min} to ${currentScheme.age_max} years`
                        : currentScheme.age_min
                        ? `Minimum ${currentScheme.age_min} years`
                        : `Maximum ${currentScheme.age_max} years`}
                    </p>
                  </div>
                </div>
              )}
              
              {currentScheme.gender_specific && (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Info className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender Specific</p>
                    <p className="font-medium">{currentScheme.gender_specific}</p>
                  </div>
                </div>
              )}
              
              {currentScheme.caste_categories && currentScheme.caste_categories.length > 0 && (
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Info className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Caste Categories</p>
                    <p className="font-medium">{currentScheme.caste_categories.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Apply Now CTA */}
          <div className="bg-orange-50 rounded-xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-2 text-orange-800">Apply for this Scheme</h3>
            <p className="text-gray-700 mb-4">
              Complete the application process online and track your status in real-time.
            </p>
            
            {isAuthenticated ? (
              <Link
                to={`/schemes/${currentScheme.id}/apply`}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <FileText size={18} className="mr-2" />
                {t('schemes.apply')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {t('nav.login')} to Apply
              </Link>
            )}
          </div>
          
          {/* Download Information */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Download Information</h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download size={18} className="text-blue-600 mr-2" />
                <span className="text-gray-700">Scheme Guidelines</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download size={18} className="text-blue-600 mr-2" />
                <span className="text-gray-700">Application Form (PDF)</span>
              </a>
              <a
                href="#"
                className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Download size={18} className="text-blue-600 mr-2" />
                <span className="text-gray-700">Required Documents List</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailPage;