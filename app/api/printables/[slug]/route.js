import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    const printables = await getCollection('printables');
    const printable = await printables.findOne({ slug });
    
    if (!printable) {
      return NextResponse.json(
        { success: false, error: 'Printable not found' },
        { status: 404 }
      );
    }
    
    // Get category info
    const categories = await getCollection('categories');
    const category = await categories.findOne({ _id: printable.category_id });
    
    // Get related printables from same category
    const related = await printables
      .find({ category_id: printable.category_id, _id: { $ne: printable._id } })
      .limit(4)
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: {
        printable,
        category,
        related
      }
    });
  } catch (error) {
    console.error('Error fetching printable:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch printable' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = params;
    
    // Increment download count
    const printables = await getCollection('printables');
    await printables.updateOne(
      { slug },
      { $inc: { downloads: 1 } }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Download count incremented'
    });
  } catch (error) {
    console.error('Error incrementing download:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment download' },
      { status: 500 }
    );
  }
}