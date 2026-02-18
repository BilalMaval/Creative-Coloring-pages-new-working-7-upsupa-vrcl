import { NextResponse } from 'next/server';
import { uploadFile, validateImageFile, validatePdfFile } from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'image' or 'pdf'

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // ✅ Validate using real File object
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

    const folder = type === 'pdf' ? 'pdfs' : 'images';

    // ✅ Pass real File object to uploadFile
    const url = await uploadFile(file, folder);

    return NextResponse.json({ success: true, url });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
