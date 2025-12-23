import { supabase } from './supabaseClient.ts';
import { Course } from '../types.ts';

export const getPrograms = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const createProgram = async (program: Omit<Course, 'slug'>, imageFile: File | null, pdfFile: File | null): Promise<Course> => {
  let imageUrl = program.image;
  let pdfUrl = program.pdf_url;

  try {
    // 1. Upload Image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `programs/${Date.now()}-img-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // 2. Upload PDF
    if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `programs/${Date.now()}-pdf-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from('meraki-assets')
          .upload(fileName, pdfFile);
  
        if (uploadError) throw new Error(`PDF upload failed: ${uploadError.message}`);
  
        const { data: urlData } = supabase.storage
          .from('meraki-assets')
          .getPublicUrl(fileName);
  
        pdfUrl = urlData.publicUrl;
      }

    const slug = program.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        slug,
        title: program.title,
        description: program.description,
        level: program.level,
        duration: program.duration,
        price: program.price,
        image: imageUrl,
        badge: program.badge,
        pdf_url: pdfUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Create Program Error:', error);
    throw error;
  }
};

export const updateProgram = async (slug: string, program: Partial<Course>, imageFile: File | null, pdfFile: File | null): Promise<Course> => {
  let imageUrl = program.image;
  let pdfUrl = program.pdf_url;

  try {
    // 1. Upload Image
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `programs/${Date.now()}-img-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    // 2. Upload PDF
    if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `programs/${Date.now()}-pdf-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
        const { error: uploadError } = await supabase.storage
          .from('meraki-assets')
          .upload(fileName, pdfFile);
  
        if (uploadError) throw new Error(`PDF upload failed: ${uploadError.message}`);
  
        const { data: urlData } = supabase.storage
          .from('meraki-assets')
          .getPublicUrl(fileName);
  
        pdfUrl = urlData.publicUrl;
      }

    const updates: any = { ...program };
    if (imageUrl) updates.image = imageUrl;
    if (pdfUrl) updates.pdf_url = pdfUrl;
    
    // Regenerate slug if title changes
    if (updates.title) {
       updates.slug = updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('slug', slug)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Update Program Error:', error);
    throw error;
  }
};

export const deleteProgram = async (slug: string) => {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('slug', slug);

  if (error) throw new Error(error.message);
};