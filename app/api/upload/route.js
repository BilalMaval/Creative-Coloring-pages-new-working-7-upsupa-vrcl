import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file directly to Supabase Storage
 * @param {Object} fileData - { name, type, data: Buffer }
 * @param {string} folder - 'images' or 'pdfs'
 * @returns {string} Public URL
 */
export async function uploadFile(fileData, folder) {
  try {
    const fileName = `${Date.now()}-${fileData.name}`;
    const path = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('uploads')           // your bucket name
      .upload(path, fileData.data, {
        contentType: fileData.type,
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    // Generate public URL
    const { data } = supabase.storage.from('uploads').getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error('Supabase upload error:', err);
    throw err;
  }
}

/**
 * Example validation for image files
 */
export function validateImageFile(fileData) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(fileData.type)) {
    throw new Error('Invalid image type');
  }
  // Optional: size limit
  if (fileData.data.length > 5 * 1024 * 1024) {
    throw new Error('Image too large (max 5MB)');
  }
}

/**
 * Example validation for PDF files
 */
export function validatePdfFile(fileData) {
  if (fileData.type !== 'application/pdf') {
    throw new Error('Invalid PDF file');
  }
  if (fileData.data.length > 20 * 1024 * 1024) {
    throw new Error('PDF too large (max 20MB)');
  }
}
