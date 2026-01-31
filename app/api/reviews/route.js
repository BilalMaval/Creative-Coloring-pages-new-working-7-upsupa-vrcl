import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET reviews for a product
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const productSlug = searchParams.get('slug');
    
    let where = { isApproved: true };
    
    if (productId) {
      where.productId = productId;
    } else if (productSlug) {
      const product = await prisma.product.findUnique({
        where: { slug: productSlug },
        select: { id: true }
      });
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      where.productId = product.id;
    }
    
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    return NextResponse.json({
      success: true,
      data: reviews,
      stats: {
        count: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST create new review
export async function POST(request) {
  try {
    const body = await request.json();
    const { productId, productSlug, rating, title, comment, authorName, authorEmail } = body;
    
    if (!rating || !authorName) {
      return NextResponse.json(
        { success: false, error: 'Rating and author name are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    let finalProductId = productId;
    
    if (!finalProductId && productSlug) {
      const product = await prisma.product.findUnique({
        where: { slug: productSlug },
        select: { id: true }
      });
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      finalProductId = product.id;
    }
    
    if (!finalProductId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or slug is required' },
        { status: 400 }
      );
    }
    
    const newReview = await prisma.review.create({
      data: {
        productId: finalProductId,
        rating: parseInt(rating),
        title: title || null,
        comment: comment || null,
        authorName,
        authorEmail: authorEmail || null,
        isApproved: true,
        isVerified: false
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// DELETE review (admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.review.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
