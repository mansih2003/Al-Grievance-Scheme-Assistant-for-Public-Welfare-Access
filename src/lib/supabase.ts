import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

// These environment variables will need to be set in a .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect to Supabase.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithOTP(phone: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Profile functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
}

// Scheme functions
export async function getSchemes(filters = {}) {
  let query = supabase.from('schemes').select('*');
  
  // Apply filters if any
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query = query.eq(key, value);
    }
  });
  
  const { data, error } = await query;
  return { data, error };
}

export async function getSchemeById(id: string) {
  const { data, error } = await supabase
    .from('schemes')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

// Application functions
export async function submitApplication(applicationData: any) {
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select('*, schemes(*)');  // Include scheme details in the response
  return { data, error };
}

export async function getUserApplications(userId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*, schemes(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });  // Show newest first
  return { data, error };
}

// Document upload
export async function uploadDocument(bucket: string, path: string, file: File) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  return { data, error };
}

// Grievance functions
export async function submitGrievance(grievanceData: any) {
  const { data, error } = await supabase
    .from('grievances')
    .insert([grievanceData]);
  return { data, error };
}

export async function getUserGrievances(userId: string) {
  const { data, error } = await supabase
    .from('grievances')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
}