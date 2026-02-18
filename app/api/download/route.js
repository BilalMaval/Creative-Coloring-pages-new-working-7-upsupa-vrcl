import { supabase } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get('file'); // e.g., "pdfs/1771434828132-bdkgq8.pdf"
    const fileName = url.searchParams.get('name') || 'download.pdf';

    if (!filePath) {
      return new Response('File not specified', { status: 400 });
    }

    // Generate signed URL valid for 60 seconds
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUrl(filePath, 60);

    if (error || !data.signedUrl) {
      console.error('Error generating signed URL:', error);
      return new Response('Download failed', { status: 500 });
    }

    // Redirect browser to signed URL
    return Response.redirect(data.signedUrl, 302);

  } catch (err) {
    console.error('Download route error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
