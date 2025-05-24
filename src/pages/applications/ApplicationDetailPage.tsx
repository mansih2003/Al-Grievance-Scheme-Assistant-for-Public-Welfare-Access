import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import useApplicationStore from '../../stores/applicationStore';
import useAuthStore from '../../stores/authStore';

const ApplicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { applications, isLoading } = useApplicationStore();
  const [application, setApplication] = useState<any>(null);
  
  useEffect(() => {
    if (id && applications.length > 0) {
      const app = applications.find(a => a.id === id);
      if (app) {
        setApplication(app);
      }
    }
  }, [id, applications]);
  
  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Pending':
        return { 
          icon: <Clock className="text-yellow-500" size={24} />, 
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Your application is currently under review. We will update you once there is a change in status.'
        };
      case 'Approved':
        return { 
          icon: <CheckCircle className="text-green-500" size={24} />, 
          color: 'bg-green-100 text-green-800',
          description: 'Your application has been approved. You will receive further instructions soon.'
        };
      case 'Rejected':
        return { 
          icon: <XCircle className="text-red-500" size={24} />, 
          color: 'bg-red-100 text-red-800',
          description: 'Your application was rejected. Please review the reason provided below.'
        };
      case 'Query':
        return { 
          icon: <AlertCircle className="text-blue-500" size={24} />, 
          color: 'bg-blue-100 text-blue-800',
          description: 'Additional information is required for your application. Please review the details below.'
        };
      default:
        return { 
          icon: <Clock className="text-gray-500" size={24} />, 
          color: 'bg-gray-100 text-gray-800',
          description: 'Application status is pending update.'
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
  
  if (!application) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-red-500 mb-4">Application not found</p>
        <button
          onClick={() => navigate('/applications')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }
  
  // @ts-ignore - scheme is actually part of the data due to the join in the query
  const scheme = application.schemes;
  const { icon, color, description } = getStatusDetails(application.status);
  const submittedData = application.submitted_data || {};
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/applications')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{t('application.status')}</h1>
      </div>
      
      {/* Application header */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {scheme?.title || 'Unknown Scheme'}
            </h2>
            <div className="flex items-center mb-4">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>
                {application.status}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                Submitted on {format(new Date(application.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
            <p className="text-gray-600">{description}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
            {icon}
            <p className="text-sm font-medium text-gray-700 mt-1">Current Status</p>
          </div>
        </div>
      </div>
      
      {/* Application details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application ID and details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Application Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="font-medium">{application.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted On</p>
                  <p className="font-medium">{format(new Date(application.created_at), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheme</p>
                  <p className="font-medium">{scheme?.title || 'Unknown Scheme'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{application.status}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Personal details */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{submittedData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{submittedData.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{submittedData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Annual Income</p>
                <p className="font-medium">₹{submittedData.income}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{submittedData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">District</p>
                <p className="font-medium">{submittedData.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">State</p>
                <p className="font-medium">{submittedData.state}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PIN Code</p>
                <p className="font-medium">{submittedData.pincode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{submittedData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{submittedData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhaar Number</p>
                <p className="font-medium">{submittedData.aadhaar}</p>
              </div>
            </div>
          </div>
          
          {/* Documents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Uploaded Documents</h3>
            <div className="space-y-3">
              {application.document_ids.map((docId: string, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="text-blue-600 mr-3" size={20} />
                  <span className="text-gray-700 flex-1 truncate">Document {index + 1}</span>
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
          
          {/* Rejection reason (if rejected) */}
          {application.status === 'Rejected' && application.rejection_reason && (
            <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-100">
              <h3 className="text-lg font-semibold mb-4 text-red-800">{t('application.rejectionReason')}</h3>
              <p className="text-gray-700">{application.rejection_reason}</p>
              <div className="mt-4">
                <Link
                  to={`/schemes/${application.scheme_id}/apply`}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center"
                >
                  {t('application.reapply')}
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Need Help */}
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Need Help?</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions or need assistance with your application, our AI assistant can help you.
            </p>
            <Link
              to="/assistant"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors block text-center"
            >
              Chat with Assistant
            </Link>
          </div>
          
          {/* File Grievance */}
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Have an Issue?</h3>
            <p className="text-gray-700 mb-4">
              If you're facing any issues with your application or need to report a problem, you can file a grievance.
            </p>
            <Link
              to={`/grievances/new?application=${application.id}`}
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors block text-center"
            >
              File a Grievance
            </Link>
          </div>
          
          {/* Download */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Application Documents</h3>
            <div className="space-y-3">
              <button
                className="flex items-center w-full p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-left"
              >
                <Download className="text-blue-600 mr-3" size={20} />
                <span className="text-gray-700">Download Receipt</span>
              </button>
              
              <button
                className="flex items-center w-full p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-left"
              >
                <ExternalLink className="text-blue-600 mr-3" size={20} />
                <span className="text-gray-700">Check Status Online</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;