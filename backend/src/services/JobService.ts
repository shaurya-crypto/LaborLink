import mongoose from 'mongoose';
import { JobRepository, JobSearchParams } from '../repositories/JobRepository';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { SavedJobRepository } from '../repositories/SavedJobRepository';
import { JobAuditRepository } from '../repositories/JobAuditRepository';
import { EventPublisher } from './EventPublisher';
import { IJob, JobStatus } from '../models/Job';
import { IApplication } from '../models/Application';

export class JobService {
  constructor(
    private jobRepo: JobRepository,
    private appRepo: ApplicationRepository,
    private savedJobRepo: SavedJobRepository,
    private auditRepo: JobAuditRepository
  ) {}

  async createJob(employerId: string, jobData: Partial<IJob>): Promise<IJob> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      jobData.employerId = new mongoose.Types.ObjectId(employerId);
      const job = await this.jobRepo.create(jobData, session);
      
      await this.auditRepo.createAudit(job._id, employerId, 'employer', 'JOB_CREATED', undefined, undefined, session);
      
      await session.commitTransaction();
      EventPublisher.emitJobPosted(job._id.toString(), employerId);
      return job;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateJob(employerId: string, jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId.toString() !== employerId) throw new Error('Unauthorized');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedJob = await this.jobRepo.update(jobId, updateData, session);
      await this.auditRepo.createAudit(jobId, employerId, 'employer', 'JOB_UPDATED', undefined, updateData, session);
      await session.commitTransaction();
      return updatedJob;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async changeJobStatus(employerId: string, jobId: string, status: JobStatus): Promise<IJob | null> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId.toString() !== employerId) throw new Error('Unauthorized');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let action: any = 'JOB_UPDATED';
      if (status === 'Paused') action = 'JOB_PAUSED';
      if (status === 'Active') action = 'JOB_REOPENED';
      if (status === 'Closed') action = 'JOB_CLOSED';
      if (status === 'Archived') action = 'JOB_ARCHIVED';

      const updatedJob = await this.jobRepo.update(jobId, { status }, session);
      await this.auditRepo.createAudit(jobId, employerId, 'employer', action, undefined, { status }, session);
      await session.commitTransaction();
      return updatedJob;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async softDeleteJob(employerId: string, jobId: string): Promise<void> {
    await this.changeJobStatus(employerId, jobId, 'Deleted');
  }

  async searchJobs(params: JobSearchParams) {
    return this.jobRepo.search(params);
  }

  async getJobById(jobId: string, incrementView = false) {
    const job = await this.jobRepo.findById(jobId);
    if (job && incrementView) {
      // Not wrapping in transaction as it's a minor analytics update
      await this.jobRepo.incrementAnalytics(jobId, 'views');
    }
    return job;
  }

  // --- Worker Actions ---

  async applyForJob(workerId: string, jobId: string, coverLetter?: string, expectedSalary?: number): Promise<IApplication> {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.status !== 'Active') throw new Error('Job is not open for applications');

    const existingApp = await this.appRepo.findByWorkerAndJob(workerId, jobId);
    if (existingApp) throw new Error('Already applied to this job');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const appData = {
        workerId: new mongoose.Types.ObjectId(workerId),
        employerId: job.employerId,
        jobId: job._id,
        status: 'Applied' as any,
        coverLetter,
        expectedSalary,
        matchPercentage: 0 // Will be calculated async or by recommendation service
      };

      const application = await this.appRepo.create(appData, session);
      
      await this.jobRepo.incrementAnalytics(jobId, 'applications', session);
      await this.auditRepo.createAudit(jobId, workerId, 'worker', 'WORKER_APPLIED', application._id, undefined, session);
      
      await session.commitTransaction();
      EventPublisher.emitJobApplied(jobId, workerId, application._id.toString());
      return application;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async toggleBookmark(workerId: string, jobId: string): Promise<boolean> {
    const isBookmarked = await this.savedJobRepo.isBookmarked(workerId, jobId);
    if (isBookmarked) {
      await this.savedJobRepo.removeBookmark(workerId, jobId);
      return false; // Not bookmarked
    } else {
      await this.savedJobRepo.addBookmark(workerId, jobId);
      await this.jobRepo.incrementAnalytics(jobId, 'saves'); // Best effort analytics
      return true; // Bookmarked
    }
  }

  async getEmployerDashboardStats(employerId: string) {
    const jobs = await this.jobRepo.findByEmployer(employerId);
    const applicationsReceived = jobs.reduce((acc: number, job: any) => acc + (job.analytics?.applicationsCount || 0), 0);
    const workersHired = jobs.reduce((acc: number, job: any) => acc + (job.analytics?.hires || 0), 0);
    
    return {
      openJobs: jobs.filter((j: any) => j.status === 'Open').length,
      applicationsReceived,
      workersHired
    };
  }

  // --- Employer Actions ---

  async updateApplicationStatus(employerId: string, appId: string, status: string): Promise<IApplication> {
    const app = await this.appRepo.findById(appId);
    if (!app) throw new Error('Application not found');
    
    const job = await this.jobRepo.findById(app.jobId);
    if (!job || job.employerId.toString() !== employerId) throw new Error('Unauthorized');

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let timestampField = '';
      let action: any = 'JOB_UPDATED';

      if (status === 'Shortlisted') { timestampField = 'shortlistedAt'; action = 'EMPLOYER_SHORTLISTED'; }
      if (status === 'Interview') { timestampField = 'interviewAt'; action = 'EMPLOYER_SHORTLISTED'; } // Reuse or create new
      if (status === 'Hired') { timestampField = 'hiredAt'; action = 'EMPLOYER_HIRED'; }
      if (status === 'Rejected') { timestampField = 'rejectedAt'; action = 'JOB_UPDATED'; } // Or EMPLOYER_REJECTED

      const updatedApp = await this.appRepo.updateStatus(appId, status as any, timestampField, session);
      if (!updatedApp) throw new Error('Failed to update application');

      await this.auditRepo.createAudit(job._id, employerId, 'employer', action, appId, { status }, session);
      
      // If hired, update job stats
      if (status === 'Hired') {
        await this.jobRepo.incrementAnalytics(job._id, 'hires', session);
        EventPublisher.emitWorkerHired(job._id.toString(), app.workerId.toString(), employerId);
      } else if (status === 'Shortlisted') {
        EventPublisher.emitApplicantShortlisted(job._id.toString(), app.workerId.toString(), employerId);
      }

      await session.commitTransaction();
      return updatedApp;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getJobApplicants(employerId: string, jobId: string) {
    const job = await this.jobRepo.findById(jobId);
    if (!job) throw new Error('Job not found');
    if (job.employerId.toString() !== employerId) throw new Error('Unauthorized');
    
    return this.appRepo.findByJob(jobId);
  }
}
