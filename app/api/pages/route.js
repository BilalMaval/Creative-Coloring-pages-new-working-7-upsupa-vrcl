import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    const pages = await getCollection('pages');
    
    if (slug) {
      const page = await pages.findOne({ slug });
      return NextResponse.json({
        success: true,
        data: page
      });
    }
    
    const allPages = await pages.find({}).toArray();
    return NextResponse.json({
      success: true,
      data: allPages
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { slug, title, body: content } = body;
    
    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: 'Slug and title are required' },
        { status: 400 }
      );
    }
    
    const pages = await getCollection('pages');
    
    const existing = await pages.findOne({ slug });
    if (existing) {
      // Update
      await pages.updateOne(
        { slug },
        { $set: { title, body: content || '' } }
      );
    } else {
      // Insert
      await pages.insertOne({
        slug,
        title,
        body: content || '',
        createdAt: new Date()
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Page saved successfully'
    });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save page' },
      { status: 500 }
    );
  }
}