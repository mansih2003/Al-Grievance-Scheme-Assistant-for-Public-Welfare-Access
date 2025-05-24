import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AlertCircle, Send } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import useGrievanceStore from '../../stores/grievanceStore';
import useSchemeStore from '../../stores/schemeStore';
import useApplicationStore from '../../stores/applicationStore';

const GrievanceFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { submitNewGrievance, isLoading } = useGrievanceStore();
  const { schemes } = useSchemeStore();
  const { applications } = useApplicationStore();
  
  const [documents, setDocuments] = useState<File[]>([]);
  
  // Get application ID from URL query parameter if it exists
  const params = new URLSearchParams(location.search);
  const applicationId = params.get('application');
  
  useEffect(() => {
    // If there's an application ID in the URL, we could fetch more details here
  }, [applicationId]);
  
  const validationSchema = Yup.object().shape({
    issue_type: Yup.string().required('Issue type is required'),
    description: Yup.string().required('Description is required').min(10, 'Description is too short'),
    scheme_id: Yup.string().nullable(),
    application_id: Yup.string().nullable(),
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files);
      setDocuments([...documents, ...newDocuments]);
    }
  };
  
  const handleSubmit = async (values: any) => {
    if (!user) return;
    
    const grievanceData = {
      user_id: user.id,
      issue_type: values.issue_type,
      description: values.description,
      scheme_id: values.scheme_id || null,
      application_id: values.application_id || null,
      status: 'Pending',
    };
    
    const success = await submitNewGrievance(grievanceData, documents);
    
    if (success) {
      navigate('/grievances');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('grievance.newGrievance')}</h1>
        <p className="text-gray-600">Tell us about your issue and we'll help resolve it</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <Formik
          initialValues={{
            issue_type: '',
            description: '',
            scheme_id: applicationId ? applications.find(a => a.id === applicationId)?.scheme_id : '',
            application_id: applicationId || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="issue_type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('grievance.issueType')} <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="issue_type"
                  id="issue_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Select Issue Type</option>
                  <option value="Application Processing Delay">{t('grievance.applicationDelay')}</option>
                  <option value="Technical Issue">{t('grievance.technicalIssue')}</option>
                  <option value="Information Discrepancy">{t('grievance.infoDiscrepancy')}</option>
                  <option value="Other">{t('grievance.other')}</option>
                </Field>
                <ErrorMessage name="issue_type" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="scheme_id" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('grievance.relatedScheme')}
                </label>
                <Field
                  as="select"
                  name="scheme_id"
                  id="scheme_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Select Scheme (if applicable)</option>
                  {schemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.title}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="scheme_id" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="application_id" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('grievance.relatedApplication')}
                </label>
                <Field
                  as="select"
                  name="application_id"
                  id="application_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="">Select Application (if applicable)</option>
                  {applications.map((application) => (
                    <option key={application.id} value={application.id}>
                      Application ID: {application.id.slice(0, 8)} - {application.status}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="application_id" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('grievance.description')} <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  rows={4}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Please provide details about your issue..."
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('grievance.attachments')}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="documents"
                    onChange={handleFileChange}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <label
                    htmlFor="documents"
                    className="bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
                  >
                    Choose Files
                  </label>
                  
                  <span className="text-sm text-gray-500">
                    {documents.length > 0
                      ? `${documents.length} ${documents.length === 1 ? 'file' : 'files'} selected`
                      : 'No files selected'}
                  </span>
                </div>
                
                {documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Selected files:</p>
                    <ul className="text-sm text-gray-500">
                      {documents.map((doc, index) => (
                        <li key={index}>{doc.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your grievance will be reviewed by our team, and you will receive updates on the status.
                      Please ensure all information is accurate and complete.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/grievances')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {t('common.cancel')}
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center disabled:bg-blue-300"
                >
                  {isSubmitting || isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {t('grievance.submit')}
                      <Send size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GrievanceFormPage;