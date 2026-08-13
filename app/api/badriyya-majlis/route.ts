import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BadriyyaMajlis from '@/models/BadriyyaMajlis';
import { uploadToCloudinary, extractPublicIdFromCloudinaryUrl, deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const ageStr = (formData.get('age') as string || '').trim();
    const houseName = (formData.get('houseName') as string || '').trim();
    const mahallu = (formData.get('mahallu') as string || '').trim();
    const district = (formData.get('district') as string || '').trim();
    const photoFile = formData.get('photo') as File | null;

    if (!name) return NextResponse.json({ error: 'പേര് നിർബന്ധമാണ് (Name is required)' }, { status: 400 });
    if (!phone) return NextResponse.json({ error: 'മൊബൈൽ നമ്പർ നിർബന്ധമാണ് (Mobile number is required)' }, { status: 400 });
    if (!ageStr) return NextResponse.json({ error: 'വയസ്സ് നിർബന്ധമാണ് (Age is required)' }, { status: 400 });
    if (!houseName) return NextResponse.json({ error: 'വീട്ടു പേര് നിർബന്ധമാണ് (House name is required)' }, { status: 400 });
    if (!mahallu) return NextResponse.json({ error: 'മഹല്ല് നിർബന്ധമാണ് (Mahallu is required)' }, { status: 400 });
    if (!district) return NextResponse.json({ error: 'ജില്ല നിർബന്ധമാണ് (District is required)' }, { status: 400 });

    const age = parseInt(ageStr, 10);
    if (isNaN(age) || age <= 0) {
      return NextResponse.json({ error: 'സാധുവായ വയസ്സ് നൽകുക (Valid age is required)' }, { status: 400 });
    }

    let photoUrl = '';
    if (photoFile && photoFile.size > 0) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const uploadResult = (await uploadToCloudinary(buffer, 'badriyya_majlis')) as { secure_url: string };
      photoUrl = uploadResult.secure_url;
    }

    const entry = await BadriyyaMajlis.create({
      name,
      phone,
      age,
      houseName,
      mahallu,
      district,
      photoUrl,
    });

    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const entries = await BadriyyaMajlis.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const entry = await BadriyyaMajlis.findByIdAndDelete(id);

    if (!entry) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Automatically remove photo asset from Cloudinary if photoUrl exists
    if (entry.photoUrl) {
      const publicId = extractPublicIdFromCloudinaryUrl(entry.photoUrl);
      if (publicId) {
        await deleteFromCloudinary(publicId).catch((err) => {
          console.error('Failed to delete photo from Cloudinary:', err);
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Registration and associated photo deleted successfully' }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
