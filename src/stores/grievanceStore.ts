import { create } from 'zustand';
import { submitGrievance, getUserGrievances, uploadDocument } from '../lib/supabase';
import type { Grievance } from '../types/database.types';

interface GrievanceState {
  grievances: Grievance[];
  currentGrievance: Grievance | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserGrievances: (userId: string) => Promise<void>;
  submitNewGrievance: (grievanceData: any, documents: File[]) => Promise<boolean>;
  setCurrentGrievance: (grievance: Grievance | null) => void;
}

const useGrievanceStore = create<GrievanceState>((set, get) => ({
  grievances: [],
  currentGrievance: null,
  isLoading: false,
  error: null,
  
  fetchUserGrievances: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await getUserGrievances(userId);
      
      if (error) {
        throw error;
      }
      
      set({ 
        grievances: data || [], 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching grievances:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to fetch grievances' 
      });
    }
  },
  
  submitNewGrievance: async (grievanceData, documents) => {
    set({ isLoading: true, error: null });
    try {
      // First upload all documents
      const documentIds: string[] = [];
      
      for (const document of documents) {
        const path = `${grievanceData.user_id}/${Date.now()}_${document.name}`;
        const { data, error } = await uploadDocument('grievance-documents', path, document);
        
        if (error) {
          throw error;
        }
        
        if (data?.path) {
          documentIds.push(data.path);
        }
      }
      
      // Then submit the grievance with document references
      const fullGrievanceData = {
        ...grievanceData,
        document_ids: documentIds.length > 0 ? documentIds : null,
        status: 'Pending',
      };
      
      const { data, error } = await submitGrievance(fullGrievanceData);
      
      if (error) {
        throw error;
      }
      
      // Refresh the user's grievances
      await get().fetchUserGrievances(grievanceData.user_id);
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error submitting grievance:', error);
      set({ 
        isLoading: false, 
        error: 'Failed to submit grievance' 
      });
      return false;
    }
  },
  
  setCurrentGrievance: (grievance) => set({ 
    currentGrievance: grievance 
  }),
}));

export default useGrievanceStore;