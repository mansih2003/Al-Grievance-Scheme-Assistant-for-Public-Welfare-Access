import { create } from 'zustand';
import { getCurrentUser, getProfile } from '../lib/supabase';
import type { Profile, UserRole } from '../types/database.types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  setUser: (user: any | null) => void;
  setProfile: (profile: Profile | null) => void;
  setRole: (role: UserRole | null) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  
  initialize: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await getCurrentUser();
      
      if (user) {
        // First try to get the profile
        const { data: profile, error: profileError } = await getProfile(user.id);
        
        if (profileError) {
          // If profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ id: user.id }])
            .select()
            .single();
            
          if (createError) throw createError;
          
          // For simplicity in the MVP, we'll assume all authenticated users have PUBLIC_USER role
          const role: UserRole = 'PUBLIC_USER';
          
          set({ 
            user, 
            profile: newProfile, 
            role, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } else {
          // Profile exists, use it
          const role: UserRole = 'PUBLIC_USER';
          
          set({ 
            user, 
            profile, 
            role, 
            isAuthenticated: true, 
            isLoading: false 
          });
        }
      } else {
        set({ 
          user: null, 
          profile: null, 
          role: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      console.error('Error initializing auth:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to initialize authentication' 
      });
    }
  },
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setProfile: (profile) => set({ profile }),
  
  setRole: (role) => set({ role }),
  
  setError: (error) => set({ error }),
  
  clearAuth: () => set({ 
    user: null, 
    profile: null, 
    role: null, 
    isAuthenticated: false, 
    error: null 
  }),
}));

export default useAuthStore;