import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query.toLowerCase() } }
        ]
      },
      include: {
        category: {
          include: {
            parent: true
          }
        }
      },
      take: 50,
      orderBy: { downloads: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
