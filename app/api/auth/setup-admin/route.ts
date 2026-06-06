import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

// Manage admin credentials directly inside the API
const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ummul.edu';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword123';

export async function GET() {
  try {
    await connectToDatabase();

    // Check if the admin user already exists
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: `Admin user with email ${ADMIN_EMAIL} already exists`,
        },
        { status: 400 }
      );
    }

    const admin = new User({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    await admin.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created successfully',
        data: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: 'admin',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'An error occurred while creating admin',
      },
      { status: 500 }
    );
  }
}
