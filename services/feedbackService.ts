
import { supabase } from './supabaseClient';
import { CustomerFeedback } from '../types';

export const getFeedback = async (): Promise<CustomerFeedback[]> => {
  const { data, error } = await supabase
    .from('customer_feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    // If table doesn't exist yet, return empty array gracefully
    if (error.code === '42P01') return [];
    throw new Error(error.message);
  }

  return data || [];
};

export const createFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'created_at'>, imageFile: File | null): Promise<CustomerFeedback> => {
  let imageUrl = feedback.image;

  try {
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `feedback/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('customer_feedback')
      .insert([{
        ...feedback,
        image: imageUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const updateFeedback = async (id: number, feedback: Partial<CustomerFeedback>, imageFile: File | null): Promise<CustomerFeedback> => {
  let imageUrl = feedback.image;

  try {
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `feedback/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('customer_feedback')
      .update({ ...feedback, image: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const deleteFeedback = async (id: number) => {
  const { error } = await supabase.from('customer_feedback').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
