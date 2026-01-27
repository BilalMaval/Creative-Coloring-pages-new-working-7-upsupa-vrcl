import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all collections (top-level categories where parentId is null)
export async function GET() {
  try {
    const collections = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { children: true }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

// POST create new collection
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, image, order } = body;
    
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }
    
    // Check if slug exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Collection with this slug already exists' },
        { status: 400 }
      );
    }
    
    const newCollection = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || '',
        image: image || null,
        parentId: null,
        order: order || 0,
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newCollection
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}

// PUT update collection
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image, order } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      );
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (order !== undefined) updateData.order = order;
    
    const updatedCollection = await prisma.category.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      message: 'Collection updated successfully',
      data: updatedCollection
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

// DELETE collection (and optionally its children)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Collection ID is required' },
        { status: 400 }
      );
    }
    
    // Check if collection has categories with products
    const categoriesWithProducts = await prisma.category.findMany({
      where: { parentId: id },
      include: {
        _count: { select: { products: true } }
      }
    });
    
    const totalProducts = categoriesWithProducts.reduce((sum, cat) => sum + cat._count.products, 0);
    
    if (totalProducts > 0) {
      return NextResponse.json(
        { success: false, error: `Cannot delete collection with ${totalProducts} products. Please move or delete the products first.` },
        { status: 400 }
      );
    }
    
    // Delete all child categories first
    await prisma.category.deleteMany({
      where: { parentId: id }
    });
    
    // Delete the collection
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
