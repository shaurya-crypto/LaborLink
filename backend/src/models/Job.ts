import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type JobStatus = 'Draft' | 'Active' | 'Paused' | 'Closed' | 'Archived' | 'Deleted' | 'Expired';

export interface IJob extends Document {
  uuid: string;
  // Basic Info
  title: string;
  description: string;
  category: string;
  occupation: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Daily Wage';
  experienceRequired: string;
  educationRequired?: string;

  // Salary
  salaryType: 'Monthly' | 'Daily' | 'Weekly' | 'Hourly';
  minSalary: number;
  maxSalary: number;
  currency: string;
  paymentFrequency?: string;

  // Employer
  employerId: mongoose.Types.ObjectId;
  companyName: string;
  companyDescription?: string;

  // Location
  state?: string;
  city: string;
  area?: string;
  address?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Skills
  requiredSkills: string[];
  preferredSkills: string[];
  languages: string[];

  // Status & Soft Delete
  status: JobStatus;
  
  // Requirements
  workersCount: number;

  // Media (Image Architecture - Phase 1.3C Req 5)
  logoId?: string;
  bannerId?: string;
  attachmentIds: string[];

  // Analytics (Phase 1.3C Req 10)
  views: number;
  uniqueViews: number;
  saves: number;
  applications: number;
  hires: number;
  conversionRate: number;

  // Metadata
  featured: boolean;
  verifiedEmployer: boolean;
  urgentHiring: boolean;
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    uuid: { type: String, default: () => uuidv4(), unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    occupation: { type: String },
    employmentType: { type: String, required: true, default: 'Full-Time' },
    experienceRequired: { type: String, required: true },
    educationRequired: { type: String },

    salaryType: { type: String, required: true, default: 'Monthly' },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentFrequency: { type: String },

    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true },
    companyDescription: { type: String },

    state: { type: String },
    city: { type: String, required: true, index: true },
    area: { type: String },
    address: { type: String },
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },

    requiredSkills: { type: [String], default: [] },
    preferredSkills: { type: [String], default: [] },
    languages: { type: [String], default: [] },

    status: { 
      type: String, 
      enum: ['Draft', 'Active', 'Paused', 'Closed', 'Archived', 'Deleted', 'Expired'], 
      default: 'Active',
      index: true
    },
    
    workersCount: { type: Number, default: 1 },

    logoId: { type: String },
    bannerId: { type: String },
    attachmentIds: { type: [String], default: [] },

    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
    hires: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },

    featured: { type: Boolean, default: false },
    verifiedEmployer: { type: Boolean, default: false },
    urgentHiring: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
jobSchema.index({ location: '2dsphere' }); // GeoNear index
jobSchema.index({ category: 1, city: 1, status: 1 });
jobSchema.index({ 'title': 'text', 'description': 'text', 'category': 'text', 'companyName': 'text' }); // Full-text search

export const Job = mongoose.model<IJob>('Job', jobSchema);
