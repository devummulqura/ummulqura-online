import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Gallery from '@/models/Gallery';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string || 'Events';
    const description = formData.get('description') as string;
    const eventName = formData.get('eventName') as string;
    
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadResult = await uploadToCloudinary(buffer, 'ummul_gallery') as { secure_url: string };
    
    const galleryItem = await Gallery.create({
      title,
      description,
      eventName,
      category,
      imageUrl: uploadResult.secure_url
    });

    return NextResponse.json({ success: true, data: galleryItem }, { status: 201 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const query: Record<string, string> = {};
    if (category) query.category = category;

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Gallery ID is required' }, { status: 400 });

    const formData = await request.formData();
    const updateData: Record<string, string | FormDataEntryValue> = {};
    
    ['title', 'category', 'description', 'eventName'].forEach(key => {
      const val = formData.get(key);
      if (val !== null) updateData[key] = val;
    });

    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'ummul_gallery') as { secure_url: string };
      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedItem) return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedItem }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Gallery ID is required' }, { status: 400 });

    const deletedItem = await Gallery.findByIdAndDelete(id);
    if (!deletedItem) return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
