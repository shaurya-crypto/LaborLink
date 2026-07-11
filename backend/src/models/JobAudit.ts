import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AuditAction = 
  | 'JOB_CREATED'
  | 'JOB_UPDATED'
  | 'JOB_PAUSED'
  | 'JOB_REOPENED'
  | 'JOB_CLOSED'
  | 'JOB_ARCHIVED'
  | 'JOB_DELETED'
  | 'WORKER_APPLIED'
  | 'WORKER_WITHDREW'
  | 'EMPLOYER_VIEWED_APP'
  | 'EMPLOYER_SHORTLISTED'
  | 'EMPLOYER_INTERVIEW'
  | 'EMPLOYER_HIRED'
  | 'EMPLOYER_REJECTED';

export interface IJobAudit extends Document {
  uuid: string;
  jobId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; // User who performed the action
  actorRole: 'worker' | 'employer' | 'system';
  action: AuditAction;
  targetId?: mongoose.Types.ObjectId; // E.g., Application ID or Worker ID if applicable
  metadata?: Record<string, any>; // Store previous/new state or reason
  createdAt: Date;
}

const jobAuditSchema = new Schema<IJobAudit>(
  {
    uuid: { type: String, default: () => uuidv4(), unique: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actorRole: { type: String, enum: ['worker', 'employer', 'system'], required: true },
    action: { type: String, required: true, index: true },
    targetId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const JobAudit = mongoose.model<IJobAudit>('JobAudit', jobAuditSchema);
