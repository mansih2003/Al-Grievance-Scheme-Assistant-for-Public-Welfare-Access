import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User, Save, CheckCircle } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import { updateProfile } from '../../lib/supabase';

const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuthStore();
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    age: Yup.number().nullable().min(0, 'Age cannot be negative'),
    gender: Yup.string().nullable(),
    caste_category: Yup.string().nullable(),
    religion: Yup.string().nullable(),
    annual_income: Yup.number().nullable().min(0, 'Income cannot be negative'),
    state: Yup.string().nullable(),
    district: Yup.string().nullable(),
    city_village: Yup.string().nullable(),
    aadhaar: Yup.string().nullable().matches(/^\d{12}$/, 'Aadhaar number must be 12 digits'),
  });
  
  const handleSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    try {
      if (!user) return;
      
      const updates = {
        id: user.id,
        name: values.name,
        age: values.age,
        gender: values.gender,
        caste_category: values.caste_category,
        religion: values.religion,
        annual_income: values.annual_income,
        state: values.state,
        district: values.district,
        city_village: values.city_village,
        // Note: In a real app, you'd implement proper Aadhaar verification
        // For the MVP, we're just storing the number
      };
      
      const { data, error } = await updateProfile(user.id, updates);
      
      if (error) {
        throw error;
      }
      
      // Update the profile in the store
      setProfile({
        ...profile,
        ...updates,
      });
      
      setStatus({ success: true });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setStatus({ success: false, error: error.message });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
        <p className="text-gray-600">Complete your profile to get personalized scheme recommendations</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-6 flex items-center">
          <div className="bg-white p-3 rounded-full mr-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div className="text-white">
            <p className="text-sm opacity-80">Welcome</p>
            <p className="font-semibold text-xl">{profile?.name || user?.email}</p>
          </div>
        </div>
        
        <Formik
          initialValues={{
            name: profile?.name || '',
            age: profile?.age || '',
            gender: profile?.gender || '',
            caste_category: profile?.caste_category || '',
            religion: profile?.religion || '',
            annual_income: profile?.annual_income || '',
            state: profile?.state || '',
            district: profile?.district || '',
            city_village: profile?.city_village || '',
            aadhaar: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status }) => (
            <Form className="p-6">
              {status?.success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        {t('profile.updateSuccess')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {status?.error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {status.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('profile.personalInfo')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.name')}
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
                        {t('profile.age')}
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
                        {t('profile.gender')}
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        id="gender"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">{t('profile.male')}</option>
                        <option value="Female">{t('profile.female')}</option>
                        <option value="Other">{t('profile.other')}</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>
                
                {/* Socio-Economic Details */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('profile.socioEconomic')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="caste_category" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.casteCategory')}
                      </label>
                      <Field
                        as="select"
                        name="caste_category"
                        id="caste_category"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select Caste Category</option>
                        <option value="General">{t('profile.general')}</option>
                        <option value="SC">{t('profile.sc')}</option>
                        <option value="ST">{t('profile.st')}</option>
                        <option value="OBC">{t('profile.obc')}</option>
                        <option value="Minority">{t('profile.minority')}</option>
                      </Field>
                      <ErrorMessage name="caste_category" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.religion')}
                      </label>
                      <Field
                        type="text"
                        name="religion"
                        id="religion"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="religion" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="annual_income" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.annualIncome')}
                      </label>
                      <Field
                        type="number"
                        name="annual_income"
                        id="annual_income"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="annual_income" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('profile.location')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.state')}
                      </label>
                      <Field
                        as="select"
                        name="state"
                        id="state"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        <option value="">Select State/UT</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                      </Field>
                      <ErrorMessage name="state" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.district')}
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
                      <label htmlFor="city_village" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.cityVillage')}
                      </label>
                      <Field
                        type="text"
                        name="city_village"
                        id="city_village"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      />
                      <ErrorMessage name="city_village" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                </div>
                
                {/* Verification */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">{t('profile.verification')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('profile.aadhaar')}
                      </label>
                      <Field
                        type="text"
                        name="aadhaar"
                        id="aadhaar"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="XXXX XXXX XXXX"
                      />
                      <ErrorMessage name="aadhaar" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                      >
                        {t('profile.verifyAadhaar')}
                      </button>
                      
                      <div className="ml-4 flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile?.aadhaar_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {profile?.aadhaar_verified ? t('profile.verified') : t('profile.notVerified')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center disabled:bg-green-300"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        {t('profile.saveChanges')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfilePage;