import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: 'worker' | 'employer';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isProfileCompleted: boolean;
  isActive: boolean;
  isBlocked: boolean;
  profilePhoto?: string;
  lastLoginAt?: Date;
  refreshTokenVersion: number;
  provider: 'local' | 'google';
  language: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  fcmTokens: string[];
  isOnline: boolean;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    uuid: { type: String, default: () => uuidv4(), unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    passwordHash: { type: String },
    role: { type: String, enum: ['worker', 'employer'], required: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    profilePhoto: { type: String },
    lastLoginAt: { type: Date },
    refreshTokenVersion: { type: Number, default: 0 },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    language: { type: String, default: 'en' },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    fcmTokens: [{ type: String }],
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

// Indexes for faster lookups
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
