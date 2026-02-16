import { NextResponse } from 'next/server';
import formidable from 'formidable';
import { uploadFile, validateImageFile, validatePdfFile } from '@/lib/upload';

export const runtime = 'nodejs';

// Disable Next.js default body parsing for this route
export const dynamic = 'force-dynamic';

export async function POST(req) {
  // formidable config
  const form = new formidable.IncomingForm({
    keepExtensions: true, // preserve file extensions
    maxFileSize: 50 * 1024 * 1024, // 50MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return resolve(
          NextResponse.json({ success: false, error: err.message }, { status: 500 })
        );
      }

      try {
        const file = files.file;
        const type = fields.type;

        if (!file) {
          return resolve(
            NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
          );
        }

        // Validate file
        if (type === 'image') {
          validateImageFile(file);
        } else if (type === 'pdf') {
          validatePdfFile(file);
        } else {
          return resolve(
            NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 })
          );
        }

        // Upload file
        const subfolder = type === 'pdf' ? 'pdfs' : 'images';
        const url = await uploadFile(file, subfolder);

        return resolve(
          NextResponse.json({ success: true, url })
        );
      } catch (error) {
        console.error('Upload error:', error);
        return resolve(
          NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 })
        );
      }
    });
  });
}
