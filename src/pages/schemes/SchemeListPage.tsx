import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, X } from 'lucide-react';
import useSchemeStore from '../../stores/schemeStore';

const SchemeListPage = () => {
  const { t } = useTranslation();
  const { schemes, fetchSchemes, filters, setFilters, clearFilters, isLoading } = useSchemeStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Initial data fetch
  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);
  
  // Filtered schemes based on search term
  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (filterKey: string, value: any) => {
    setFilters({ ...filters, [filterKey]: value });
  };
  
  // Toggle filter sidebar on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('schemes.title')}</h1>
        <button
          onClick={toggleFilters}
          className="md:hidden bg-gray-100 p-2 rounded-full"
          aria-label="Toggle filters"
        >
          <Filter size={20} />
        </button>
      </div>
      
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('schemes.search')}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar - hidden on mobile unless toggled */}
        <div className={`md:w-1/4 bg-white p-4 rounded-lg shadow-sm border border-gray-100 
                        ${showFilters ? 'fixed inset-0 z-50 bg-white overflow-auto' : 'hidden md:block'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t('schemes.filters')}</h2>
            {showFilters && (
              <button
                onClick={toggleFilters}
                className="md:hidden text-gray-500"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Category filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('schemes.category')}
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Housing">Housing</option>
              <option value="Employment">Employment</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="Women & Child">Women & Child</option>
              <option value="Rural Development">Rural Development</option>
            </select>
          </div>
          
          {/* Ministry filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('schemes.ministry')}
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={filters.ministry || ''}
              onChange={(e) => handleFilterChange('ministry', e.target.value)}
            >
              <option value="">All Ministries</option>
              <option value="Agriculture & Farmers Welfare">Agriculture & Farmers Welfare</option>
              <option value="Education">Education</option>
              <option value="Health & Family Welfare">Health & Family Welfare</option>
              <option value="Housing & Urban Affairs">Housing & Urban Affairs</option>
              <option value="Labour & Employment">Labour & Employment</option>
              <option value="Rural Development">Rural Development</option>
              <option value="Social Justice & Empowerment">Social Justice & Empowerment</option>
              <option value="Women & Child Development">Women & Child Development</option>
            </select>
          </div>
          
          {/* Region filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('schemes.region')}
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All India</option>
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
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters(filters)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t('schemes.applyFilter')}
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {t('schemes.clearFilter')}
            </button>
          </div>
        </div>
        
        {/* Schemes list */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 mb-4">{t('schemes.noSchemes')}</p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('schemes.clearFilter')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSchemes.map((scheme) => (
                <Link
                  key={scheme.id}
                  to={`/schemes/${scheme.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{scheme.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {scheme.ministry}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeListPage;