import { EmployerProfile, IEmployerProfile } from '../models/EmployerProfile';
import mongoose from 'mongoose';

export class EmployerProfileRepository {
  async findByUserId(userId: string | mongoose.Types.ObjectId): Promise<IEmployerProfile | null> {
    return EmployerProfile.findOne({ user: userId });
  }

  async upsert(userId: string | mongoose.Types.ObjectId, data: Partial<IEmployerProfile>): Promise<IEmployerProfile> {
    return EmployerProfile.findOneAndUpdate(
      { user: userId },
      { ...data, user: userId },
      { new: true, upsert: true }
    );
  }
}
