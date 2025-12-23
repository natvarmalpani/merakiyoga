import { supabase } from './supabaseClient.ts';
import { YogaStyle } from '../types.ts';

// Fetch all styles
export const getStyles = async (): Promise<YogaStyle[]> => {
  const { data, error } = await supabase
    .from('yoga_styles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching styles:', error.message || error);
    throw new Error(error.message || 'Failed to fetch styles');
  }

  return data || [];
};

// Create a new style
export const createStyle = async (style: Omit<YogaStyle, 'id' | 'slug'>, file: File | null): Promise<YogaStyle> => {
  let imageUrl = style.image;

  try {
    // 1. Upload Image if exists
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `styles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    // 2. Insert Record
    // Auto-generate slug from name
    const slug = style.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('yoga_styles')
      .insert([{
        name: style.name,
        slug: slug,
        description: style.description,
        benefits: style.benefits,
        difficulty: style.difficulty,
        duration: style.duration,
        image: imageUrl
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return data as YogaStyle;

  } catch (error: any) {
    console.error('Service Error in createStyle:', error.message || error);
    throw error;
  }
};

// Update an existing style
export const updateStyle = async (
  originalSlug: string, 
  style: Partial<YogaStyle>, 
  file: File | null
): Promise<YogaStyle> => {
  let imageUrl = style.image;

  try {
    // 1. Upload New Image if provided
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `styles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    // 2. Prepare Update Object
    const updateData: any = { ...style };
    if (imageUrl) updateData.image = imageUrl;
    
    // If name is updated, regenerate slug (optional, but keeps URLs clean)
    if (updateData.name) {
      updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // 3. Update Record
    const { data, error } = await supabase
      .from('yoga_styles')
      .update(updateData)
      .eq('slug', originalSlug)
      .select()
      .single();

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    return data as YogaStyle;

  } catch (error: any) {
    console.error('Service Error in updateStyle:', error.message || error);
    throw error;
  }
};

// Delete a style
export const deleteStyle = async (slug: string, imageUrl?: string) => {
  // 1. Delete from DB using slug
  const { error } = await supabase
    .from('yoga_styles')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error('Error deleting style:', error.message);
    throw new Error(error.message);
  }

  // 2. Delete image from storage if it exists and belongs to our bucket
  if (imageUrl && imageUrl.includes('meraki-assets')) {
    try {
      const path = imageUrl.split('/meraki-assets/')[1];
      if (path) {
        await supabase.storage.from('meraki-assets').remove([path]);
      }
    } catch (storageError) {
      console.warn('Failed to delete image file, but database record was removed:', storageError);
    }
  }
};