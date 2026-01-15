import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { verifyPassword, createAuthToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const users = await getCollection('users');
    const user = await users.findOne({ email });
    
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = createAuthToken(email, password);
    
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role
      }
    });
    
    // Set cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}