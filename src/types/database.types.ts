export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          age: number | null;
          gender: string | null;
          caste_category: string | null;
          religion: string | null;
          annual_income: number | null;
          state: string | null;
          district: string | null;
          city_village: string | null;
          aadhaar_verified: boolean;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          name?: string;
          age?: number | null;
          gender?: string | null;
          caste_category?: string | null;
          religion?: string | null;
          annual_income?: number | null;
          state?: string | null;
          district?: string | null;
          city_village?: string | null;
          aadhaar_verified?: boolean;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          age?: number | null;
          gender?: string | null;
          caste_category?: string | null;
          religion?: string | null;
          annual_income?: number | null;
          state?: string | null;
          district?: string | null;
          city_village?: string | null;
          aadhaar_verified?: boolean;
          avatar_url?: string | null;
        };
      };
      schemes: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          eligibility_criteria: string;
          benefits: string;
          required_documents: string[];
          ministry: string;
          category: string;
          region_specific: boolean;
          regions: string[] | null;
          income_limit: number | null;
          age_min: number | null;
          age_max: number | null;
          gender_specific: string | null;
          caste_categories: string[] | null;
          expiry_date: string | null;
          application_link: string | null;
          official_website: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          eligibility_criteria: string;
          benefits: string;
          required_documents: string[];
          ministry: string;
          category: string;
          region_specific?: boolean;
          regions?: string[] | null;
          income_limit?: number | null;
          age_min?: number | null;
          age_max?: number | null;
          gender_specific?: string | null;
          caste_categories?: string[] | null;
          expiry_date?: string | null;
          application_link?: string | null;
          official_website?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          eligibility_criteria?: string;
          benefits?: string;
          required_documents?: string[];
          ministry?: string;
          category?: string;
          region_specific?: boolean;
          regions?: string[] | null;
          income_limit?: number | null;
          age_min?: number | null;
          age_max?: number | null;
          gender_specific?: string | null;
          caste_categories?: string[] | null;
          expiry_date?: string | null;
          application_link?: string | null;
          official_website?: string | null;
        };
      };
      applications: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          scheme_id: string;
          status: string;
          rejection_reason: string | null;
          document_ids: string[];
          submitted_data: object;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          scheme_id: string;
          status?: string;
          rejection_reason?: string | null;
          document_ids?: string[];
          submitted_data?: object;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          scheme_id?: string;
          status?: string;
          rejection_reason?: string | null;
          document_ids?: string[];
          submitted_data?: object;
        };
      };
      grievances: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          application_id: string | null;
          scheme_id: string | null;
          issue_type: string;
          description: string;
          status: string;
          response: string | null;
          document_ids: string[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          application_id?: string | null;
          scheme_id?: string | null;
          issue_type: string;
          description: string;
          status?: string;
          response?: string | null;
          document_ids?: string[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          application_id?: string | null;
          scheme_id?: string | null;
          issue_type?: string;
          description?: string;
          status?: string;
          response?: string | null;
          document_ids?: string[] | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Scheme = Database['public']['Tables']['schemes']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Grievance = Database['public']['Tables']['grievances']['Row'];

export type UserRole = 'PUBLIC_USER' | 'GOVERNMENT_OFFICIAL_ADMIN';