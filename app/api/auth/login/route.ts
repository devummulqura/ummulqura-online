import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();


    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: user._id, role: user.role });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' }, { status: 200 });

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
