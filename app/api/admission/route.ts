import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const studentData: any = {};
    
    formData.forEach((value, key) => {
      if (key !== 'photo') {
        studentData[key] = value;
      }
    });

    const photoFile = formData.get('photo') as File | null;
    if (photoFile) {
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      const uploadResult: any = await uploadToCloudinary(buffer, 'ummul_admissions');
      studentData.photoUrl = uploadResult.secure_url;
    }

    const student = await Student.create(studentData);

    return NextResponse.json({ success: true, data: student }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const students = await Student.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: students }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
