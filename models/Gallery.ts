import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    eventName: { type: String },
    imageUrl: { type: String, required: true }, // From Cloudinary
    category: { type: String, default: 'Events' },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
