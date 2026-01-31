import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email and message are required' },
        { status: 400 }
      );
    }
    
    // For now, just log the contact (can be extended to store in DB or send email)
    console.log('Contact form submission:', { name, email, subject, message });
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error processing contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
