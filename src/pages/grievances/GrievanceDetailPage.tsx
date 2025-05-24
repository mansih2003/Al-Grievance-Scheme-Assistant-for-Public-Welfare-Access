import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, HelpCircle, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import useGrievanceStore from '../../stores/grievanceStore';
import useSchemeStore from '../../stores/schemeStore';
import useApplicationStore from '../../stores/applicationStore';

const GrievanceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { grievances, isLoading } = useGrievanceStore();
  const { schemes } = useSchemeStore();
  const { applications } = useApplicationStore();
  
  const [grievance, setGrievance] = useState<any>(null);
  const [relatedScheme, setRelatedScheme] = useState<any>(null);
  const [relatedApplication, setRelatedApplication] = useState<any>(null);
  
  useEffect(() => {
    if (id && grievances.length > 0) {
      const g = grievances.find(g => g.id === id);
      
      if (g) {
        setGrievance(g);
        
        // Find related scheme
        if (g.scheme_id && schemes.length > 0) {
          const scheme = schemes.find(s => s.id === g.scheme_id);
          setRelatedScheme(scheme);
        }
        
        // Find related application
        if (g.application_id && applications.length > 0) {
          const application = applications.find(a => a.id === g.application_id);
          setRelatedApplication(application);
        }
      }
    }
  }, [id, grievances, schemes, applications]);
  
  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Pending':
        return { 
          icon: <Clock className="text-yellow-500" size={24} />, 
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Your grievance has been received. We will review it shortly.'
        };
      case 'In Progress':
        return { 
          icon: <HelpCircle className="text-blue-500" size={24} />, 
          color: 'bg-blue-100 text-blue-800',
          description: 'We are currently reviewing your grievance and working to resolve the issue.'
        };
      case 'Resolved':
        return { 
          icon: <CheckCircle className="text-green-500" size={24} />, 
          color: 'bg-green-100 text-green-800',
          description: 'Your grievance has been resolved. Please check the response below.'
        };
      case 'Closed':
        return { 
          icon: <AlertCircle className="text-gray-500" size={24} />, 
          color: 'bg-gray-100 text-gray-800',
          description: 'This grievance has been closed.'
        };
      default:
        return { 
          icon: <Clock className="text-gray-500" size={24} />, 
          color: 'bg-gray-100 text-gray-800',
          description: 'Grievance status is pending update.'
        };
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  if (!grievance) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-red-500 mb-4">Grievance not found</p>
        <button
          onClick={() => navigate('/grievances')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to Grievances
        </button>
      </div>
    );
  }
  
  const { icon, color, description } = getStatusDetails(grievance.status);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/grievances')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{t('grievance.status')}</h1>
      </div>
      
      {/* Grievance header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
                {grievance.status}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                ID: {grievance.id}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {grievance.issue_type}
            </h2>
            <div className="text-gray-500 text-sm mb-4">
              Submitted on {format(new Date(grievance.created_at), 'MMMM d, yyyy')}
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
            {icon}
            <p className="text-sm font-medium text-gray-700 mt-1">Current Status</p>
          </div>
        </div>
      </div>
      
      {/* Grievance details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Grievance Details</h3>
            <p className="text-gray-700 whitespace-pre-line">{grievance.description}</p>
          </div>
          
          {/* Related items */}
          {(relatedScheme || relatedApplication) && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Related Items</h3>
              <div className="space-y-4">
                {relatedScheme && (
                  <div>
                    <p className="text-sm text-gray-500">Related Scheme</p>
                    <Link to={`/schemes/${relatedScheme.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {relatedScheme.title}
                    </Link>
                  </div>
                )}
                
                {relatedApplication && (
                  <div>
                    <p className="text-sm text-gray-500">Related Application</p>
                    <Link to={`/applications/${relatedApplication.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Application ID: {relatedApplication.id.slice(0, 8)}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Attachments */}
          {grievance.document_ids && grievance.document_ids.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Attachments</h3>
              <div className="space-y-3">
                {grievance.document_ids.map((docId: string, index: number) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="text-blue-600 mr-3" size={20} />
                    <span className="text-gray-700 flex-1 truncate">Attachment {index + 1}</span>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Official response (if resolved) */}
          {grievance.status === 'Resolved' && grievance.response && (
            <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
              <h3 className="text-lg font-semibold mb-4 text-green-800">{t('grievance.response')}</h3>
              <p className="text-gray-700">{grievance.response}</p>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Need Help */}
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Need More Help?</h3>
            <p className="text-gray-700 mb-4">
              If you need further assistance or have additional questions, our AI assistant can help you.
            </p>
            <Link
              to="/assistant"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors block text-center"
            >
              Chat with Assistant
            </Link>
          </div>
          
          {/* Status timeline */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Status Timeline</h3>
            <div className="relative border-l border-gray-200 ml-3 pl-6 pb-2">
              <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-white"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                {format(new Date(grievance.created_at), 'MMM d, yyyy')}
              </time>
              <p className="text-sm font-medium text-gray-900">Grievance Submitted</p>
            </div>
            
            {/* Add more timeline events based on status changes (mock data for MVP) */}
            {grievance.status !== 'Pending' && (
              <div className="relative border-l border-gray-200 ml-3 pl-6 pb-2 mt-4">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-white"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                  {format(new Date(new Date(grievance.created_at).getTime() + 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                </time>
                <p className="text-sm font-medium text-gray-900">Under Review</p>
              </div>
            )}
            
            {(grievance.status === 'Resolved' || grievance.status === 'Closed') && (
              <div className="relative border-l border-gray-200 ml-3 pl-6 mt-4">
                <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-green-600 bg-white"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-500">
                  {format(new Date(new Date(grievance.created_at).getTime() + 3 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
                </time>
                <p className="text-sm font-medium text-gray-900">{grievance.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrievanceDetailPage;