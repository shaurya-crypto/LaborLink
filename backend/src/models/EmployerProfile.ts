import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployerProfile extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  businessType: string;
  companyDescription?: string;
  companyLogo?: string;
  gst?: string;
  contactPerson: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  website?: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const employerProfileSchema = new Schema<IEmployerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    businessType: { type: String, required: true },
    companyDescription: { type: String },
    companyLogo: { type: String },
    gst: { type: String },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    website: { type: String },
    verificationStatus: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export const EmployerProfile = mongoose.model<IEmployerProfile>('EmployerProfile', employerProfileSchema);
