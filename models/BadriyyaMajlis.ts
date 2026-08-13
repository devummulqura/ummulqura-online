import mongoose from 'mongoose';

const BadriyyaMajlisSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    houseName: { type: String, required: true },
    mahallu: { type: String, required: true },
    district: { type: String, required: true },
    photoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.BadriyyaMajlis || mongoose.model('BadriyyaMajlis', BadriyyaMajlisSchema);
