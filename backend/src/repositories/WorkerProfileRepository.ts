import { WorkerProfile, IWorkerProfile } from '../models/WorkerProfile';
import mongoose from 'mongoose';

export class WorkerProfileRepository {
  async findByUserId(userId: string | mongoose.Types.ObjectId): Promise<IWorkerProfile | null> {
    return WorkerProfile.findOne({ user: userId });
  }

  async upsert(userId: string | mongoose.Types.ObjectId, data: Partial<IWorkerProfile>): Promise<IWorkerProfile> {
    return WorkerProfile.findOneAndUpdate(
      { user: userId },
      { ...data, user: userId },
      { new: true, upsert: true }
    );
  }
}
