import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: true
          }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Increment views
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } }
    });
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
