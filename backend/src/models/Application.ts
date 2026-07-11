import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ApplicationStatus = 'Applied' | 'Viewed' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';

export interface IApplication extends Document {
  uuid: string;
  workerId: mongoose.Types.ObjectId;
  employerId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  
  coverLetter?: string;
  expectedSalary?: number;
  
  // Timestamps for status tracking
  appliedAt: Date;
  viewedAt?: Date;
  shortlistedAt?: Date;
  interviewAt?: Date;
  selectedAt?: Date;
  rejectedAt?: Date;
  withdrawnAt?: Date;
  
  // Analytics / Recommendations metadata
  matchPercentage: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    uuid: { type: String, default: () => uuidv4(), unique: true, index: true },
    workerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    employerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    
    status: { 
      type: String, 
      enum: ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Withdrawn'],
      default: 'Applied',
      index: true
    },
    
    coverLetter: { type: String },
    expectedSalary: { type: Number },
    
    appliedAt: { type: Date, default: Date.now },
    viewedAt: { type: Date },
    shortlistedAt: { type: Date },
    interviewAt: { type: Date },
    selectedAt: { type: Date },
    rejectedAt: { type: Date },
    withdrawnAt: { type: Date },
    
    matchPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate applications
applicationSchema.index({ workerId: 1, jobId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
