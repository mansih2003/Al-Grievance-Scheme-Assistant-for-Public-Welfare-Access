import { create } from 'zustand';
import { submitApplication, getUserApplications, uploadDocument } from '../lib/supabase';
import type { Application } from '../types/database.types';

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserApplications: (userId: string) => Promise<void>;
  submitNewApplication: (applicationData: any, documents: File[]) => Promise<boolean>;
  setCurrentApplication: (application: Application | null) => void;
}

const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  
  fetchUserApplications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await getUserApplications(userId);
      
      if (error) {
        throw error;
      }
      
      set({ 
        applications: data || [], 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch applications'
      });
    }
  },
  
  submitNewApplication: async (applicationData, documents) => {
    set({ isLoading: true, error: null });
    try {
      // First upload all documents
      const documentIds: string[] = [];
      
      for (const document of documents) {
        const path = `${applicationData.user_id}/${Date.now()}_${document.name}`;
        const { data, error } = await uploadDocument('application-documents', path, document);
        
        if (error) {
          throw error;
        }
        
        if (data?.path) {
          documentIds.push(data.path);
        }
      }
      
      // Then submit the application with document references
      const fullApplicationData = {
        ...applicationData,
        document_ids: documentIds,
        submitted_data: {
          ...applicationData.submitted_data,
          documents: documentIds,
          submitted_at: new Date().toISOString()
        }
      };
      
      const { data, error } = await submitApplication(fullApplicationData);
      
      if (error) {
        throw error;
      }
      
      // Add the new application to the store
      if (data) {
        set(state => ({
          applications: [...state.applications, data[0]]
        }));
      }
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      console.error('Error submitting application:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to submit application'
      });
      return false;
    }
  },
  
  setCurrentApplication: (application) => set({ currentApplication: application }),
}));

export default useApplicationStore;