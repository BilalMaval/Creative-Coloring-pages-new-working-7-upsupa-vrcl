import { supabase } from '@/lib/upload';
import { prisma } from '@/lib/prisma'; // adjust path if different

export const runtime = 'edge';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const filePathParam = url.searchParams.get('file'); // e.g., "pdfs/1771434828132-bdkgq8.pdf"
    const fileNameParam = url.searchParams.get('name') || 'download.pdf';
    const productId = url.searchParams.get('productId'); // New: product ID to increment counter

    if (!filePathParam) {
      return new Response('File not specified', { status: 400 });
    }

    // ✅ Increment download counter if productId is provided
    if (productId) {
      try {
        await prisma.product.update({
          where: { id: Number(productId) },
          data: {
            downloadCount: {
              increment: 1,
            },
          },
        });
      } catch (err) {
        console.error('Error incrementing download count:', err);
        // We do not fail the download if counting fails
      }
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
