import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    caption: { type: String },
    content: { type: String, required: true },
    summary: { type: String },
    imageUrl: { type: String }, // From Cloudinary
    date: { type: Date, default: Date.now },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model('News', NewsSchema);
