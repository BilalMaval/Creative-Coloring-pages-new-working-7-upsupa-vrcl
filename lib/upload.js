console.log('Supabase URL:', supabaseUrl);
console.log('Anon key exists:', !!supabaseAnonKey);

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
 * @param {File|Buffer} file - File object from formData (browser) or Buffer (Node.js)
 * @param {string} folder - 'images' or 'pdfs'
 * @returns {string} Public URL
 */
export async function uploadFile(file, folder = '') {
  try {
    let buffer;

    // Handle browser File/Blob
    if (file.arrayBuffer) {
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    }
    // Handle Node.js Buffer (from API route)
    else if (file.buffer) {
      buffer = file.buffer;
    } else {
      throw new Error('Invalid file object for upload');
    }

    // Generate unique filename
    const ext = file.name?.split('.').pop() || 'bin';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = `${folder}/${filename}`;

    // Upload to Supabase Storage bucket named 'uploads'
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });

    if (error) {
      const statusCode = error.status || 500;
      console.error('Supabase upload error full object:', error, 'data:', data);
      throw new Error(`Supabase upload failed (status ${statusCode}): ${error.message}`);
    }

    // Generate public URL
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Supabase upload caught error:', err);
    throw err; // rethrow the full error including status info
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
