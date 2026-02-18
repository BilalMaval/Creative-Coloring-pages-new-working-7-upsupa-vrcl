import { supabase } from '@/lib/upload';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filePathParam = url.searchParams.get('file'); // e.g., "pdfs/1771434828132-bdkgq8.pdf"
    const fileNameParam = url.searchParams.get('name') || 'download.pdf';

    if (!filePathParam) {
      return new Response('File not specified', { status: 400 });
    }

    // Generate a signed URL valid for 60 seconds
    const { data, error } = await supabase.storage
      .from('uploads')
      .createSignedUrl(filePathParam, 60);

    if (error || !data?.signedUrl) {
      console.error('Error creating signed URL:', error);
      return new Response('Download failed', { status: 500 });
    }

    // Redirect user to signed URL
    return Response.redirect(data.signedUrl, 302);
  } catch (err) {
    console.error('Download route error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
