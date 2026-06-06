import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import News from '@/models/News';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const content = formData.get('content') as string;
    const summary = formData.get('summary') as string;
    const category = formData.get('category') as string;
    const subtitle = formData.get('subtitle') as string;
    const caption = formData.get('caption') as string;
    const tagsStr = formData.get('tags') as string;
    const isPublished = formData.get('isPublished') === 'true';
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
    
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'ummul_news') as { secure_url: string };
      imageUrl = uploadResult.secure_url;
    }

    const news = await News.create({
      title,
      slug,
      subtitle,
      caption,
      content,
      summary,
      category,
      tags,
      isPublished,
      imageUrl
    });

    return NextResponse.json({ success: true, data: news }, { status: 201 });
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
    const all = searchParams.get('all'); // Admin flag to fetch drafts too
    
    const query: Record<string, string | boolean> = {};
    if (!all) query.isPublished = true;
    if (category) query.category = category;

    const newsList = await News.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: newsList }, { status: 200 });
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

    if (!id) return NextResponse.json({ error: 'News ID is required' }, { status: 400 });

    const formData = await request.formData();
    const updateData: Record<string, string | boolean | string[] | FormDataEntryValue> = {};
    
    ['title', 'content', 'summary', 'category', 'subtitle', 'caption'].forEach(key => {
      const val = formData.get(key);
      if (val !== null) updateData[key] = val;
    });

    if (formData.has('isPublished')) {
      updateData.isPublished = formData.get('isPublished') === 'true';
    }
    
    if (formData.has('tags')) {
      updateData.tags = (formData.get('tags') as string).split(',').map(t => t.trim());
    }

    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'ummul_news') as { secure_url: string };
      updateData.imageUrl = uploadResult.secure_url;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedNews) return NextResponse.json({ error: 'News not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedNews }, { status: 200 });
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

    if (!id) return NextResponse.json({ error: 'News ID is required' }, { status: 400 });

    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) return NextResponse.json({ error: 'News not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'News deleted successfully' }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
