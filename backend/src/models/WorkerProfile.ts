import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkerProfile extends Document {
  user: mongoose.Types.ObjectId;
  occupation: string;
  skills: string[];
  experience: number; // in years
  availability: 'Full-time' | 'Part-time' | 'Contract';
  hourlyRate?: number;
  dailyRate?: number;
  expectedSalaryRange?: string;
  languages: string[];
  bio?: string;
  city: string;
  state: string;
  gpsCoordinates?: {
    type: 'Point';
    coordinates: number[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const workerProfileSchema = new Schema<IWorkerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    occupation: { type: String, required: true },
    skills: [{ type: String }],
    experience: { type: Number, default: 0 },
    availability: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    hourlyRate: { type: Number },
    dailyRate: { type: Number },
    expectedSalaryRange: { type: String },
    languages: [{ type: String }],
    bio: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    gpsCoordinates: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true }
);

workerProfileSchema.index({ gpsCoordinates: '2dsphere' });

export const WorkerProfile = mongoose.model<IWorkerProfile>('WorkerProfile', workerProfileSchema);
