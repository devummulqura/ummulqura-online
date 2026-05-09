import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    parentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    course: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    photoUrl: { type: String }, // From Cloudinary
    notes: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
