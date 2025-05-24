import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, FileText, HelpCircle, User, ArrowRight, CheckCircle } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useSchemeStore from '../stores/schemeStore';

const HomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated, profile } = useAuthStore();
  const { recommendedSchemes, setRecommendedSchemes } = useSchemeStore();
  
  useEffect(() => {
    const mockRecommendedSchemes = [
      {
        id: '1',
        title: 'PM Kisan Samman Nidhi',
        description: 'Income support to farmer families to meet their agricultural and farming needs',
        ministry: 'Agriculture & Farmers Welfare',
        category: 'Agriculture',
        benefits: '₹6,000 per year in three equal installments',
      },
      {
        id: '2',
        title: 'Ayushman Bharat',
        description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary hospitalization',
        ministry: 'Health & Family Welfare',
        category: 'Healthcare',
        benefits: 'Health coverage up to ₹5 lakh per family per year',
      },
      {
        id: '3',
        title: 'PM Awas Yojana',
        description: 'Housing for All by 2022 mission to provide housing for the urban and rural poor',
        ministry: 'Housing & Urban Affairs',
        category: 'Housing',
        benefits: 'Financial assistance for house construction',
      }
    ];
    
    setRecommendedSchemes(mockRecommendedSchemes as any);
  }, [setRecommendedSchemes]);
  
  return (
    <div className="space-y-10">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] mix-blend-overlay opacity-20"></div>
        <div className="relative p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Empowering Citizens Through Digital Access
            </h1>
            <p className="text-xl text-orange-50 mb-8 max-w-2xl">
              Discover and apply for government welfare schemes designed to support and uplift Indian citizens. Get personalized recommendations and easy-to-follow application processes.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/schemes"
                className="bg-white text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Schemes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
          <div className="text-gray-600">Active Schemes</div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">1M+</div>
          <div className="text-gray-600">Beneficiaries</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">₹1000Cr+</div>
          <div className="text-gray-600">Benefits Disbursed</div>
        </div>
      </div>
      
      {/* Welcome back section for authenticated users */}
      {isAuthenticated && (
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                Welcome back, {profile?.name || 'User'}!
              </h2>
              <p className="text-gray-600">Continue your journey with us</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/applications"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <FileText className="text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">My Applications</div>
                <div className="text-sm text-gray-600">Track your applications</div>
              </div>
            </Link>
            
            <Link 
              to="/assistant"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <HelpCircle className="text-green-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">Get Assistance</div>
                <div className="text-sm text-gray-600">AI-powered help</div>
              </div>
            </Link>
            
            <Link 
              to="/profile"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <User className="text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-medium">Complete Profile</div>
                <div className="text-sm text-gray-600">Update your details</div>
              </div>
            </Link>
          </div>
        </div>
      )}
      
      {/* Featured schemes section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isAuthenticated ? 'Recommended For You' : 'Featured Schemes'}
          </h2>
          <Link to="/schemes" className="text-blue-600 hover:text-blue-800 font-medium">
            View All Schemes
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedSchemes.map((scheme) => (
            <Link 
              key={scheme.id} 
              to={`/schemes/${scheme.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-100 group"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {scheme.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {scheme.ministry}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {scheme.category}
                  </span>
                </div>
                <div className="flex items-center text-blue-600 font-medium">
                  Learn More
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* How it works section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-blue-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Discover Schemes</h3>
            <p className="text-gray-600">Find welfare schemes that match your profile and needs</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Application</h3>
            <p className="text-gray-600">Complete and submit applications entirely online</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-orange-600 h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your applications and get real-time updates</p>
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join millions of citizens who have already benefited from government welfare schemes.
        </p>
        <Link
          to={isAuthenticated ? "/schemes" : "/register"}
          className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-medium text-lg inline-flex items-center transition-colors"
        >
          {isAuthenticated ? "Browse Schemes" : "Create Account"}
          <ArrowRight className="ml-2 h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;