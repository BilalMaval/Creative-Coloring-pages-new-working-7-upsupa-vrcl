import { NextResponse } from 'next/server';
import { supabase, uploadFile, validateImageFile, validatePdfFile } from '@/lib/upload';

export const runtime = 'nodejs'; // Required for formData in Next.js app directory

export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file'); // File object
    const type = formData.get('type'); // 'image' or 'pdf'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File object to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileData = {
      name: file.name,
      type: file.type,
      data: buffer,
    };

    // Validate file
    if (type === 'image') {
      validateImageFile(fileData);
    } else if (type === 'pdf') {
      validatePdfFile(fileData);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Determine folder
    const folder = type === 'pdf' ? 'pdfs' : 'images';

    // Upload to Supabase
    const url = await uploadFile(fileData, folder);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
