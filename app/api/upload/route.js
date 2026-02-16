import { NextResponse } from 'next/server';
import { uploadFile, validateImageFile, validatePdfFile } from '@/lib/upload';

export const runtime = 'nodejs';  // Node runtime required for formData

export async function POST(request) {
  try {
    // Parse incoming form data
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'image' or 'pdf'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate the file type
    if (type === 'image') {
      validateImageFile(file);
    } else if (type === 'pdf') {
      validatePdfFile(file);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Upload file
    const subfolder = type === 'pdf' ? 'pdfs' : 'images';

    // If your uploadFile supports File objects directly, this will work
    // Otherwise, you may need to convert file to ArrayBuffer
    const url = await uploadFile(file, subfolder);

    return NextResponse.json({
      success: true,
      url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
