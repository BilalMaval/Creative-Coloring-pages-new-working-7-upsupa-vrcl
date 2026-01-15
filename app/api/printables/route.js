import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const latest = searchParams.get('latest') === 'true';
    
    let where = { isActive: true };
    if (category) {
      where.categoryId = category;
    }
    
    const total = await prisma.product.count({ where });
    const skip = (page - 1) * limit;
    
    const items = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: latest ? { createdAt: 'desc' } : { title: 'asc' },
      include: {
        category: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching printables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch printables' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, description, tags, image, pdfPath, webpPath, categoryId, price, isFree } = body;
    
    if (!title || !slug || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and category are required' },
        { status: 400 }
      );
    }
    
    // Check if slug exists
    const existing = await prisma.product.findUnique({
      where: { slug }
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Product with this slug already exists' },
        { status: 400 }
      );
    }
    
    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        tags: tags || [],
        webpPath: webpPath || image || null,
        pdfPath: pdfPath || null,
        categoryId,
        price: price || 0,
        isFree: isFree !== undefined ? isFree : true,
        isActive: true,
        downloads: 0
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating printable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create printable' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, slug, description, tags, image, pdfPath, webpPath, categoryId, price, isFree } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (image !== undefined) updateData.webpPath = image;
    if (webpPath !== undefined) updateData.webpPath = webpPath;
    if (pdfPath !== undefined) updateData.pdfPath = pdfPath;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (price !== undefined) updateData.price = price;
    if (isFree !== undefined) updateData.isFree = isFree;
    
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating printable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update printable' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.product.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting printable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete printable' },
      { status: 500 }
    );
  }
}
