
import { supabase } from './supabaseClient';
import { BlogPost, BlogComment } from '../types';

// --- POSTS ---

export const getBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
  let query = supabase
    .from('blog_posts')
    .select('*, blog_comments(count)')
    .order('created_at', { ascending: false });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  
  // Transform data to flatten the comment count structure
  return (data || []).map((post: any) => ({
    ...post,
    comment_count: post.blog_comments?.[0]?.count || 0
  }));
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    // If not found, return null instead of throwing for smoother UI handling
    if (error.code === 'PGRST116') return null; 
    throw new Error(error.message);
  }
  return data;
};

export const createBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'likes'>, imageFile: File | null): Promise<BlogPost> => {
  let imageUrl = post.image;

  try {
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('meraki-assets')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('meraki-assets')
        .getPublicUrl(fileName);
      
      imageUrl = urlData.publicUrl;
    }

    const slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        image: imageUrl,
        slug,
        likes: 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const updateBlogPost = async (id: number, post: Partial<BlogPost>, imageFile: File | null): Promise<BlogPost> => {
  let imageUrl = post.image;

  try {
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `blog/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
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
      .from('blog_posts')
      .update({ ...post, image: imageUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const deleteBlogPost = async (id: number) => {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const incrementBlogLikes = async (id: number) => {
  // Using RPC is ideal, but for simplicity we fetch-increment-update or use a raw sql call if enabled.
  // Standard Supabase allows increment via rpc if you set up a function, 
  // but to avoid custom SQL functions for now, we will just fetch and update.
  // NOTE: This is not race-condition safe for high traffic, but fine for this scale.
  
  const { data: post, error: fetchError } = await supabase
    .from('blog_posts')
    .select('likes')
    .eq('id', id)
    .single();
    
  if (fetchError) throw fetchError;

  const newLikes = (post?.likes || 0) + 1;

  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({ likes: newLikes })
    .eq('id', id);

  if (updateError) throw updateError;
  return newLikes;
};

// --- COMMENTS ---

export const getComments = async (postId: number): Promise<BlogComment[]> => {
  const { data, error } = await supabase
    .from('blog_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

export const addComment = async (comment: Omit<BlogComment, 'id' | 'created_at'>): Promise<BlogComment> => {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert([comment])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteComment = async (id: number) => {
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);
    if (error) throw new Error(error.message);
};
