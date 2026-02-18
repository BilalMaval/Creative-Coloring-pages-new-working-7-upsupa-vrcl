import { supabase } from '@/lib/upload';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filePathParam = url.searchParams.get('file'); // e.g., "pdfs/1771434828132-bdkgq8.pdf"
    const fileNameParam = url.searchParams.get('name') || 'download.pdf';

    if (!filePathParam) {
      return new Response('File not specified', { status: 400 });
    }

    // Download the file from Supabase Storage bucket
    const { data, error } = await supabase.storage.from('uploads').download(filePathParam);

    if (error || !data) {
      console.error('Error downloading file from Supabase:', error);
      return new Response('Download failed', { status: 500 });
    }

    // Convert to ArrayBuffer for Edge Response
    const arrayBuffer = await data.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': data.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileNameParam}"`,
      },
    });
  } catch (err) {
    console.error('Download route error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
