import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Upload file to local storage
export async function uploadFile(file, subfolder = '') {
  try {
    await ensureUploadDir();
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename
    const ext = path.extname(file.name);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(UPLOAD_DIR, subfolder, filename);
    
    // Create subfolder if needed
    const subfolderPath = path.join(UPLOAD_DIR, subfolder);
    if (subfolder && !existsSync(subfolderPath)) {
      await mkdir(subfolderPath, { recursive: true });
    }
    
    // Write file
    await writeFile(filepath, buffer);
    
    // Return public URL
    return `/uploads/${subfolder ? subfolder + '/' : ''}${filename}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

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

export function validatePdfFile(file) {
  const allowedTypes = ['application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Must be PDF');
  }
  
  if (file.size > maxSize) {
    throw new Error('PDF too large. Max size: 10MB');
  }
  
  return true;
}