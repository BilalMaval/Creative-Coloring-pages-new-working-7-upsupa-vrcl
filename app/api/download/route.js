import { supabase } from '@/lib/upload';

// Use Edge runtime for signed URL redirects
export const runtime = 'edge';

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
    return new Response(null, {
      status: 302,
      headers: {
        Location: data.signedUrl,
        'Content-Disposition': `attachment; filename="${fileNameParam}"`,
      },
    });
  } catch (err) {
    console.error('Download route error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
