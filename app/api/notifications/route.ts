import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Notification from '@/models/Notification';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const notification = await Notification.create(data);
    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    let query: any = {};
    if (activeOnly) {
      query.isActive = true;
      query.$or = [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }];
    }

    const notifications = await Notification.find(query).sort({ isPinned: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });

    const updateData = await request.json();
    const updatedItem = await Notification.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedItem) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });

    const deletedItem = await Notification.findByIdAndDelete(id);
    if (!deletedItem) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Notification deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
