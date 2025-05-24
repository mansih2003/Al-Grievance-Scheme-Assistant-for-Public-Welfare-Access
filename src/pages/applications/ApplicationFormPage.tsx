import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import useSchemeStore from '../../stores/schemeStore';
import useAuthStore from '../../stores/authStore';
import useApplicationStore from '../../stores/applicationStore';

const ApplicationFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { fetchSchemeById, currentScheme, isLoading: schemeLoading } = useSchemeStore();
  const { user, profile } = useAuthStore();
  const { submitNewApplication, isLoading: applicationLoading } = useApplicationStore();
  
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<File[]>([]);
  
  useEffect(() => {
    if (id) {
      fetchSchemeById(id);
    }
  }, [id, fetchSchemeById]);
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().required('Age is required').positive('Age must be positive'),
    gender: Yup.string().required('Gender is required'),
    address: Yup.string().required('Address is required'),
    district: Yup.string().required('District is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string().required('PIN code is required').matches(/^\d{6}$/, 'PIN code must be 6 digits'),
    phone: Yup.string().required('Phone number is required').matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    income: Yup.number().required('Annual income is required').min(0, 'Income cannot be negative'),
    aadhaar: Yup.string().required('Aadhaar number is required').matches(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
    declaration: Yup.boolean().oneOf([true], 'You must accept the declaration'),
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Add a type identifier to the file object for tracking
      const documentWithType = Object.defineProperty(file, 'documentType', {
        value: documentType,
        writable: true,
      });
      
      setDocuments([...documents.filter(doc => (doc as any).documentType !== documentType), documentWithType]);
    }
  };
  
  const handleSubmit = async (values: any) => {
    if (!id || !user) return;
    
    const applicationData = {
      user_id: user.id,
      scheme_id: id,
      status: 'Pending',
      submitted_data: values,
    };
    
    const success = await submitNewApplication(applicationData, documents);
    
    if (success) {
      navigate('/applications');
    }
  };
  
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  if (schemeLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  if (!currentScheme) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-red-500 mb-4">Scheme not found</p>
        <button
          onClick={() => navigate('/schemes')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Back to Schemes
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('application.title')}</h1>
        <p className="text-gray-600">Applying for: {currentScheme.title}</p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-center w-10">{t('application.personalDetails')}</div>
          <div className="text-center w-10">{t('application.documents')}</div>
          <div className="text-center w-10">{t('application.review')}</div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <Formik
          initialValues={{
            name: profile?.name || '',
            age: profile?.age || '',
            gender: profile?.gender || '',
            address: '',
            district: profile?.district || '',
            state: profile?.state || '',
            pincode: '',
            phone: '',
            email: user?.email || '',
            income: profile?.annual_income || '',
            aadhaar: '',
            declaration: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, values }) => (
            <Form className="space-y-6">
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{t('application.personalDetails')}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <Field
                        type="number"
                        name="age"
                        id="age"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="age" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        id="gender"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
                        Annual Income (₹)
                      </label>
                      <Field
                        type="number"
                        name="income"
                        id="income"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="income" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Field
                        as="textarea"
                        name="address"
                        id="address"
                        rows={2}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="address" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <Field
                        type="text"
                        name="district"
                        id="district"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="district" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <Field
                        type="text"
                        name="state"
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code
                      </label>
                      <Field
                        type="text"
                        name="pincode"
                        id="pincode"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="pincode" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhaar Number
                      </label>
                      <Field
                        type="text"
                        name="aadhaar"
                        id="aadhaar"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="aadhaar" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Document Upload */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{t('application.documents')}</h2>
                  <p className="text-gray-600 mb-4">
                    Please upload the following documents as required for this scheme.
                  </p>
                  
                  <div className="space-y-4">
                    {currentScheme.required_documents.map((doc, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {doc} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="file"
                            id={`doc-${index}`}
                            onChange={(e) => handleFileChange(e, doc)}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <label
                            htmlFor={`doc-${index}`}
                            className="bg-gray-50 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
                          >
                            {t('application.uploadDocument')}
                          </label>
                          
                          <span className="text-sm text-gray-500">
                            {documents.find((d) => (d as any).documentType === doc)
                              ? `File selected: ${documents.find((d) => (d as any).documentType === doc)?.name}`
                              : 'No file selected'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please ensure all documents are clear, readable, and in the correct format (PDF, JPG, or PNG).
                          Maximum file size is 2MB per document.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Review and Submit */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{t('application.review')}</h2>
                  <p className="text-gray-600 mb-4">
                    Please review your application details before submission.
                  </p>
                  
                  <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-lg border-b pb-2">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{values.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{values.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium">{values.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Annual Income</p>
                        <p className="font-medium">₹{values.income}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{values.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-medium">{values.district}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">State</p>
                        <p className="font-medium">{values.state}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">PIN Code</p>
                        <p className="font-medium">{values.pincode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{values.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{values.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Aadhaar Number</p>
                        <p className="font-medium">{values.aadhaar}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-lg border-b pb-2">Uploaded Documents</h3>
                    
                    <ul className="mt-2 space-y-1">
                      {currentScheme.required_documents.map((doc, index) => {
                        const uploaded = documents.some((d) => (d as any).documentType === doc);
                        return (
                          <li key={index} className="flex items-start py-1">
                            {uploaded ? (
                              <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                            ) : (
                              <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                            )}
                            <span className={uploaded ? 'text-gray-700' : 'text-red-600'}>
                              {doc}: {uploaded ? 'Uploaded' : 'Not uploaded'}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="declaration"
                        id="declaration"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="declaration" className="ml-2 block text-sm text-gray-700">
                        I hereby declare that all the information provided is true and correct to the best of my knowledge.
                        I understand that providing false information may result in the rejection of my application and potential legal action.
                      </label>
                    </div>
                    <ErrorMessage name="declaration" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="flex justify-between pt-4 border-t">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    {t('common.back')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate(`/schemes/${id}`)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    {t('common.cancel')}
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    {t('common.next')}
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid || applicationLoading || documents.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center disabled:bg-green-300"
                  >
                    {applicationLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {t('application.submit')}
                        <CheckCircle size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ApplicationFormPage;