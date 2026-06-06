import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const studentData: Record<string, FormDataEntryValue | string> = {};
    
    formData.forEach((value, key) => {
      if (key !== 'photo') {
        studentData[key] = value;
      }
    });

    const photoFile = formData.get('photo') as File | null;
    if (photoFile) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const uploadResult = await uploadToCloudinary(buffer, 'ummul_admissions') as { secure_url: string };
      studentData.photoUrl = uploadResult.secure_url;
    }

    const student = await Student.create(studentData);

    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: students }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' }, { status: 200 });
  } catch (error) {
    const err = error as { message?: string };
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
