import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { productId } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if product is free
    if (!product.isFree) {
      // Check if user is authenticated and has purchased
      const token = request.cookies.get('auth_token')?.value;
      const user = await verifyAuth(token);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Please login or purchase this product' },
          { status: 401 }
        );
      }
      
      // Check if user has purchased this product
      const purchase = await prisma.orderItem.findFirst({
        where: {
          productId: productId,
          order: {
            userId: user.id,
            status: 'COMPLETED'
          }
        }
      });
      
      if (!purchase) {
        return NextResponse.json(
          { success: false, error: 'Please purchase this product to download' },
          { status: 403 }
        );
      }
    }
    
    // Increment download count
    await prisma.product.update({
      where: { id: productId },
      data: { downloads: { increment: 1 } }
    });
    
    // Log download if user is authenticated
    const token = request.cookies.get('auth_token')?.value;
    const user = await verifyAuth(token);
    
    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      if (dbUser) {
        await prisma.download.create({
          data: {
            userId: dbUser.id,
            productId: productId
          }
        });
      }
    }
    
    // Return download URL (for now, return the PDF path)
    return NextResponse.json({
      success: true,
      downloadUrl: product.pdfPath || product.webpPath,
      message: 'Download started'
    });
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    );
  }
}
