import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    
    const updateData: Record<string, string | FormDataEntryValue> = {};
    ['instituteName', 'email', 'phone', 'address', 'facebookUrl', 'twitterUrl', 'instagramUrl', 'youtubeUrl', 'theme'].forEach(key => {
      const val = formData.get(key);
      if (val !== null) updateData[key] = val;
    });

    const logoFile = formData.get('logo') as File | null;
    if (logoFile) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'ummul_settings') as { secure_url: string };
      updateData.logoUrl = uploadResult.secure_url;
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, updateData, { new: true });
    }

    return NextResponse.json({ success: true, data: settings }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
