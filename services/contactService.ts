import { supabase } from './supabaseClient.ts';
import { ContactInquiry } from '../types.ts';

export const createInquiry = async (inquiry: Omit<ContactInquiry, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .insert([inquiry])
    .select()
    .single();

  if (error) {
    if (error.message.includes('row-level security') || error.message.includes('column')) {
        console.error('CRITICAL DATABASE ERROR: The Supabase database has not been set up correctly.');
        console.error('ACTION REQUIRED: Go to /admin dashboard, copy the SQL, and run it in Supabase SQL Editor.');
    }
    throw new Error(error.message);
  }

  return data;
};

export const getInquiries = async (): Promise<ContactInquiry[]> => {
  const { data, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const deleteInquiry = async (id: string) => {
  const { error } = await supabase
    .from('contact_inquiries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};