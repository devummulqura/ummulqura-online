export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IStudent {
  _id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  course: string;
  dob: string | Date;
  gender: 'Male' | 'Female';
  photoUrl?: string;
  notes?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IGallery {
  _id: string;
  title: string;
  description?: string;
  eventName?: string;
  imageUrl: string;
  category: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface INews {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  caption?: string;
  content: string;
  summary?: string;
  imageUrl?: string;
  date: string | Date;
  category: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isPinned: boolean;
  isActive: boolean;
  expiresAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ISettings {
  _id: string;
  instituteName: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string | Date;
  updatedAt: string | Date;
}
