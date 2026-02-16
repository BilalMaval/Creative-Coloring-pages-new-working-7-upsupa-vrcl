export const dynamic = 'force-dynamic';
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
    
    // Split query into individual words for fuzzy matching
    const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    // Build OR conditions for each word to match against title, description, or tags
    const orConditions = [];
    
    // Add full query match
    orConditions.push(
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    );
    
    // Add individual word matches
    words.forEach(word => {
      orConditions.push(
        { title: { contains: word, mode: 'insensitive' } },
        { description: { contains: word, mode: 'insensitive' } },
        { tags: { has: word } }
      );
    });
    
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: orConditions
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
    
    // Calculate relevance score for each product
    const scoredProducts = products.map(product => {
      let score = 0;
      const titleLower = product.title.toLowerCase();
      const descLower = (product.description || '').toLowerCase();
      const queryLower = query.toLowerCase();
      
      // Exact full query match in title (highest priority)
      if (titleLower.includes(queryLower)) {
        score += 100;
      }
      
      // Exact full query match in description
      if (descLower.includes(queryLower)) {
        score += 50;
      }
      
      // Count how many individual words match
      words.forEach(word => {
        if (titleLower.includes(word)) {
          score += 20;
        }
        if (descLower.includes(word)) {
          score += 10;
        }
        if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(word))) {
          score += 15;
        }
      });
      
      return { ...product, relevanceScore: score };
    });
    
    // Sort by relevance score (highest first)
    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return NextResponse.json({
      success: true,
      data: scoredProducts,
      pagination: {
        total: scoredProducts.length
      }
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
