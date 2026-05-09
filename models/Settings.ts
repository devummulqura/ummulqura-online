import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    instituteName: { type: String, default: 'Ummul Islamic Institute' },
    logoUrl: { type: String, default: '' },
    email: { type: String, default: 'info@ummulinstitute.edu' },
    phone: { type: String, default: '+1 (234) 567-8900' },
    address: { type: String, default: '123 Islamic Center St, Knowledge City' },
    facebookUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
