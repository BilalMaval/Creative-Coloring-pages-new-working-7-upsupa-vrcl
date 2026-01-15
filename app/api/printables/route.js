import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const latest = searchParams.get('latest') === 'true';
    
    const printables = await getCollection('printables');
    
    let query = {};
    if (category) {
      query.category_id = category;
    }
    
    const total = await printables.countDocuments(query);
    const skip = (page - 1) * limit;
    
    let cursor = printables.find(query).skip(skip).limit(limit);
    
    if (latest) {
      cursor = cursor.sort({ createdAt: -1 });
    }
    
    const items = await cursor.toArray();
    
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
    const { title, slug, description, tags, image, pdf_url, category_id } = body;
    
    if (!title || !slug || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and category are required' },
        { status: 400 }
      );
    }
    
    const printables = await getCollection('printables');
    
    // Check if slug exists
    const existing = await printables.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Printable with this slug already exists' },
        { status: 400 }
      );
    }
    
    const newPrintable = {
      title,
      slug,
      description: description || '',
      tags: tags || [],
      image: image || '',
      pdf_url: pdf_url || '',
      category_id,
      downloads: 0,
      createdAt: new Date()
    };
    
    const result = await printables.insertOne(newPrintable);
    
    return NextResponse.json({
      success: true,
      data: { ...newPrintable, _id: result.insertedId }
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
    const { _id, title, slug, description, tags, image, pdf_url, category_id } = body;
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Printable ID is required' },
        { status: 400 }
      );
    }
    
    const printables = await getCollection('printables');
    
    const updateData = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (image !== undefined) updateData.image = image;
    if (pdf_url !== undefined) updateData.pdf_url = pdf_url;
    if (category_id) updateData.category_id = category_id;
    
    await printables.updateOne(
      { _id },
      { $set: updateData }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Printable updated successfully'
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
        { success: false, error: 'Printable ID is required' },
        { status: 400 }
      );
    }
    
    const printables = await getCollection('printables');
    await printables.deleteOne({ _id: id });
    
    return NextResponse.json({
      success: true,
      message: 'Printable deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting printable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete printable' },
      { status: 500 }
    );
  }
}