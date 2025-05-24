import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { signUpWithEmail, signInWithOTP } from '../../lib/supabase';
import useAuthStore from '../../stores/authStore';

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { initialize, setError } = useAuthStore();
  
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const emailRegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });
  
  const phoneRegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    phone: Yup.string()
      .matches(/^\+?[0-9]{10,12}$/, 'Invalid phone number')
      .required('Phone number is required'),
    otp: otpSent ? Yup.string().required('OTP is required') : Yup.string(),
  });
  
  const handleEmailRegister = async (values: { name: string; email: string; password: string }, { setSubmitting }: any) => {
    try {
      const { data, error } = await signUpWithEmail(values.email, values.password);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // In a real implementation, we would create a profile for the user here
        await initialize();
        navigate('/profile');
      }
    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSendOTP = async (values: { phone: string }, { setSubmitting }: any) => {
    try {
      setPhoneNumber(values.phone);
      const { error } = await signInWithOTP(values.phone);
      
      if (error) {
        throw error;
      }
      
      setOtpSent(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleVerifyOTP = async (values: { name: string; otp: string }, { setSubmitting }: any) => {
    try {
      // In a real implementation, this would verify the OTP and create a new user
      // For the MVP, we'll just simulate success
      
      await initialize();
      navigate('/profile');
    } catch (error: any) {
      setError(error.message || 'Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };
  
  const toggleRegisterMethod = () => {
    setRegisterMethod(registerMethod === 'email' ? 'phone' : 'email');
    setOtpSent(false);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{t('auth.register')}</h2>
      
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 ${registerMethod === 'email' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-md transition-colors`}
          onClick={() => setRegisterMethod('email')}
        >
          {t('auth.registerWithEmail')}
        </button>
        <button
          className={`px-4 py-2 ${registerMethod === 'phone' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-md transition-colors`}
          onClick={() => setRegisterMethod('phone')}
        >
          {t('auth.registerWithPhone')}
        </button>
      </div>
      
      {registerMethod === 'email' ? (
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={emailRegisterSchema}
          onSubmit={handleEmailRegister}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="John Doe"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="email@example.com"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="********"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="********"
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {t('auth.register')}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ name: '', phone: '', otp: '' }}
          validationSchema={phoneRegisterSchema}
          onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="John Doe"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="+91XXXXXXXXXX"
                    disabled={otpSent}
                  />
                </div>
                <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
              </div>
              
              {otpSent && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.enterOTP')}
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    id="otp"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter OTP"
                  />
                  <ErrorMessage name="otp" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {otpSent ? t('auth.verifyOTP') : t('auth.sendOTP')}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
              
              {otpSent && (
                <button
                  type="button"
                  className="mt-2 w-full text-center text-sm text-blue-600 hover:text-blue-500"
                  onClick={() => setOtpSent(false)}
                >
                  {t('auth.resendOTP')}
                </button>
              )}
            </Form>
          )}
        </Formik>
      )}
      
      <div className="mt-6 text-center">
        <button
          onClick={toggleRegisterMethod}
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          {registerMethod === 'email' ? t('auth.registerWithPhone') : t('auth.registerWithEmail')}
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;