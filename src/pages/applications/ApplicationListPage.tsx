import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import useApplicationStore from '../../stores/applicationStore';
import useAuthStore from '../../stores/authStore';
import { format } from 'date-fns';

const ApplicationListPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { applications, fetchUserApplications, isLoading } = useApplicationStore();
  
  useEffect(() => {
    if (user) {
      fetchUserApplications(user.id);
    }
  }, [user, fetchUserApplications]);
  
  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Pending':
        return { icon: <Clock className="text-yellow-500" size={20} />, color: 'bg-yellow-100 text-yellow-800' };
      case 'Approved':
        return { icon: <CheckCircle className="text-green-500" size={20} />, color: 'bg-green-100 text-green-800' };
      case 'Rejected':
        return { icon: <XCircle className="text-red-500" size={20} />, color: 'bg-red-100 text-red-800' };
      case 'Query':
        return { icon: <AlertCircle className="text-blue-500" size={20} />, color: 'bg-blue-100 text-blue-800' };
      default:
        return { icon: <Clock className="text-gray-500" size={20} />, color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('application.trackApplications')}</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('application.noApplications')}</h2>
          <p className="text-gray-500 mb-6">You haven't applied for any welfare schemes yet.</p>
          <Link
            to="/schemes"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
          >
            Browse Schemes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const { icon, color } = getStatusDetails(application.status);
            // @ts-ignore - scheme is actually part of the data due to the join in the query
            const scheme = application.schemes;
            
            return (
              <Link
                key={application.id}
                to={`/applications/${application.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
                          {application.status}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          {format(new Date(application.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {scheme?.title || 'Unknown Scheme'}
                      </h2>
                      <p className="text-gray-500 mt-1">Application ID: {application.id.slice(0, 8)}</p>
                    </div>
                    <div className="flex items-center">
                      {icon}
                      <ChevronRight className="text-gray-400 ml-2" size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationListPage;