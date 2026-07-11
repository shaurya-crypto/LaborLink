import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedJob extends Document {
  workerId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    workerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound index to prevent duplicate bookmarks
savedJobSchema.index({ workerId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', savedJobSchema);
