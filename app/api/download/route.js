import { supabase } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file'); // e.g., "pdfs/1771434828132-bdkgq8.pdf"
    const fileName = searchParams.get('name') || 'file.pdf';

    if (!filePath) {
      return new Response(JSON.stringify({ error: 'File not specified' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Download the file from Supabase bucket 'uploads'
    const { data, error } = await supabase.storage
      .from('uploads')
      .download(filePath);

    if (error || !data) {
      console.error('Supabase download error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch file' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert to ArrayBuffer for streaming
    const arrayBuffer = await data.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`, // Forces download
      },
    });
  } catch (err) {
    console.error('Server download error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
