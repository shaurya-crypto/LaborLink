import { Application, IApplication, ApplicationStatus } from '../models/Application';
import mongoose, { ClientSession } from 'mongoose';

export class ApplicationRepository {
  async create(applicationData: Partial<IApplication>, session?: ClientSession): Promise<IApplication> {
    const app = new Application(applicationData);
    return app.save({ session });
  }

  async findById(id: string | mongoose.Types.ObjectId, session?: ClientSession): Promise<IApplication | null> {
    return Application.findById(id).session(session || null);
  }

  async findByWorkerAndJob(workerId: string | mongoose.Types.ObjectId, jobId: string | mongoose.Types.ObjectId): Promise<IApplication | null> {
    return Application.findOne({ workerId, jobId });
  }

  async findByWorker(workerId: string | mongoose.Types.ObjectId): Promise<IApplication[]> {
    return Application.find({ workerId }).sort({ createdAt: -1 }).populate('jobId');
  }

  async findByJob(jobId: string | mongoose.Types.ObjectId): Promise<IApplication[]> {
    return Application.find({ jobId }).sort({ matchPercentage: -1, createdAt: -1 }).populate('workerId');
  }

  async updateStatus(
    id: string | mongoose.Types.ObjectId, 
    status: ApplicationStatus, 
    statusTimestampField: string, 
    session?: ClientSession
  ): Promise<IApplication | null> {
    const update: any = { status };
    if (statusTimestampField) {
      update[statusTimestampField] = new Date();
    }
    return Application.findByIdAndUpdate(id, update, { new: true, session: session || null });
  }
}
