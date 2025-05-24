import { create } from 'zustand';
import { getSchemes, getSchemeById } from '../lib/supabase';
import type { Scheme } from '../types/database.types';

interface SchemeFilters {
  region?: string;
  category?: string;
  ministry?: string;
  income_limit?: number;
  age_min?: number;
  age_max?: number;
  gender_specific?: string;
  caste_categories?: string[];
}

interface SchemeState {
  schemes: Scheme[];
  currentScheme: Scheme | null;
  recommendedSchemes: Scheme[];
  filters: SchemeFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSchemes: (filters?: SchemeFilters) => Promise<void>;
  fetchSchemeById: (id: string) => Promise<void>;
  setFilters: (filters: SchemeFilters) => void;
  clearFilters: () => void;
  setRecommendedSchemes: (schemes: Scheme[]) => void;
}

const useSchemeStore = create<SchemeState>((set, get) => ({
  schemes: [],
  currentScheme: null,
  recommendedSchemes: [],
  filters: {},
  isLoading: false,
  error: null,
  
  fetchSchemes: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await getSchemes(filters);
      
      if (error) {
        throw error;
      }
      
      set({ 
        schemes: data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching schemes:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch schemes' 
      });
    }
  },
  
  fetchSchemeById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await getSchemeById(id);
      
      if (error) {
        throw error;
      }
      
      set({ 
        currentScheme: data, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching scheme:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch scheme details' 
      });
    }
  },
  
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchSchemes(get().filters);
  },
  
  clearFilters: () => {
    set({ filters: {} });
    get().fetchSchemes({});
  },
  
  setRecommendedSchemes: (schemes) => set({ 
    recommendedSchemes: schemes 
  }),
}));

export default useSchemeStore;