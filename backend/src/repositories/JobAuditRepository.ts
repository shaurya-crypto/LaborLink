import { JobAudit, IJobAudit, AuditAction } from '../models/JobAudit';
import mongoose, { ClientSession } from 'mongoose';

export class JobAuditRepository {
  async createAudit(
    jobId: string | mongoose.Types.ObjectId,
    actorId: string | mongoose.Types.ObjectId,
    actorRole: 'worker' | 'employer' | 'system',
    action: AuditAction,
    targetId?: string | mongoose.Types.ObjectId,
    metadata?: any,
    session?: ClientSession
  ): Promise<IJobAudit> {
    const audit = new JobAudit({
      jobId,
      actorId,
      actorRole,
      action,
      targetId,
      metadata
    });
    return audit.save({ session });
  }

  async getJobHistory(jobId: string | mongoose.Types.ObjectId): Promise<IJobAudit[]> {
    return JobAudit.find({ jobId }).sort({ createdAt: -1 });
  }
}
