import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with anon key (safe for API routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload a file to Supabase Storage
 * @param {File} file - File object from formData
 * @param {string} folder - 'images' or 'pdfs'
 * @returns {string} Public URL
 */
export async function uploadFile(file, folder = '') {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = `${folder}/${filename}`;

    // Upload to Supabase Storage bucket named 'uploads'
    const { error } = await supabase.storage
      .from('uploads')
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    // Generate public URL
    const { data } = supabase.storage.from('uploads').getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('Supabase upload error:', err);
    throw new Error('Failed to upload file to Supabase');
  }
}

/**
 * Validate image files
 */
export function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid image type. Allowed: JPG, PNG, WEBP');
  }

  if (file.size > maxSize) {
    throw new Error('Image too large. Max size: 5MB');
  }

  return true;
}

/**
 * Validate PDF files
 */
export function validatePdfFile(file) {
  const allowedTypes = ['application/pdf'];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Must be PDF');
  }

  if (file.size > maxSize) {
    throw new Error('PDF too large. Max size: 20MB');
  }

  return true;
}
