import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Clock, CheckCircle, HelpCircle, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import useGrievanceStore from '../../stores/grievanceStore';
import useAuthStore from '../../stores/authStore';

const GrievanceListPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { grievances, fetchUserGrievances, isLoading } = useGrievanceStore();
  
  useEffect(() => {
    if (user) {
      fetchUserGrievances(user.id);
    }
  }, [user, fetchUserGrievances]);
  
  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Pending':
        return { icon: <Clock className="text-yellow-500" size={20} />, color: 'bg-yellow-100 text-yellow-800' };
      case 'In Progress':
        return { icon: <HelpCircle className="text-blue-500" size={20} />, color: 'bg-blue-100 text-blue-800' };
      case 'Resolved':
        return { icon: <CheckCircle className="text-green-500" size={20} />, color: 'bg-green-100 text-green-800' };
      case 'Closed':
        return { icon: <AlertCircle className="text-gray-500" size={20} />, color: 'bg-gray-100 text-gray-800' };
      default:
        return { icon: <Clock className="text-gray-500" size={20} />, color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('grievance.myGrievances')}</h1>
        <Link
          to="/grievances/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus size={18} className="mr-1" />
          {t('grievance.newGrievance')}
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
        </div>
      ) : grievances.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('grievance.noGrievances')}</h2>
          <p className="text-gray-500 mb-6">You haven't filed any grievances yet.</p>
          <Link
            to="/grievances/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block"
          >
            {t('grievance.newGrievance')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {grievances.map((grievance) => {
            const { icon, color } = getStatusDetails(grievance.status);
            
            return (
              <Link
                key={grievance.id}
                to={`/grievances/${grievance.id}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
                          {grievance.status}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {format(new Date(grievance.created_at), 'MMM d, yyyy')}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {grievance.issue_type}
                        </span>
                      </div>
                      <p className="text-gray-800 line-clamp-2">{grievance.description}</p>
                      <p className="text-gray-500 text-sm mt-2">Grievance ID: {grievance.id.slice(0, 8)}</p>
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

export default GrievanceListPage;