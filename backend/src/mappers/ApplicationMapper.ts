import { IApplication } from '../models/Application';
import { ApplicationDTO } from '../dtos/ApplicationDTO';
import { JobMapper } from './JobMapper';

export class ApplicationMapper {
  static toDTO(app: IApplication, populatedJob?: any, populatedWorker?: any): ApplicationDTO {
    return {
      id: app._id.toString(),
      jobId: app.jobId.toString(),
      workerId: app.workerId.toString(),
      employerId: app.employerId.toString(),
      status: app.status,
      
      coverLetter: app.coverLetter,
      expectedSalary: app.expectedSalary,
      
      appliedAt: app.appliedAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      
      matchPercentage: app.matchPercentage,
      
      job: populatedJob ? JobMapper.toSummaryDTO(populatedJob) : undefined,
      worker: populatedWorker ? populatedWorker : undefined, // Replace with WorkerMapper if needed
    };
  }
}
