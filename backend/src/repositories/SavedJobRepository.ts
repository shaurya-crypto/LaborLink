import { SavedJob, ISavedJob } from '../models/SavedJob';
import mongoose from 'mongoose';

export class SavedJobRepository {
  async addBookmark(workerId: string | mongoose.Types.ObjectId, jobId: string | mongoose.Types.ObjectId): Promise<ISavedJob> {
    const savedJob = new SavedJob({ workerId, jobId });
    return savedJob.save();
  }

  async removeBookmark(workerId: string | mongoose.Types.ObjectId, jobId: string | mongoose.Types.ObjectId): Promise<void> {
    await SavedJob.deleteOne({ workerId, jobId });
  }

  async findByWorker(workerId: string | mongoose.Types.ObjectId): Promise<ISavedJob[]> {
    return SavedJob.find({ workerId }).sort({ createdAt: -1 }).populate('jobId');
  }

  async isBookmarked(workerId: string | mongoose.Types.ObjectId, jobId: string | mongoose.Types.ObjectId): Promise<boolean> {
    const count = await SavedJob.countDocuments({ workerId, jobId });
    return count > 0;
  }
}
