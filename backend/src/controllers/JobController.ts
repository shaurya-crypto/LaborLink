import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/JobService';
import { RecommendationService } from '../services/RecommendationService';
import { JobRepository } from '../repositories/JobRepository';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { SavedJobRepository } from '../repositories/SavedJobRepository';
import { JobAuditRepository } from '../repositories/JobAuditRepository';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { JobMapper } from '../mappers/JobMapper';

const jobRepo = new JobRepository();
const appRepo = new ApplicationRepository();
const savedJobRepo = new SavedJobRepository();
const auditRepo = new JobAuditRepository();

const jobService = new JobService(jobRepo, appRepo, savedJobRepo, auditRepo);
const recommendationService = new RecommendationService();

export class JobController {
  
  // --- Employer APIs ---

  public createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const jobData = req.body;
      const job = await jobService.createJob(employerId, jobData);
      res.status(201).json(ApiResponse.success('Job posted successfully', JobMapper.toDTO(job)));
    } catch (error) {
      next(error);
    }
  };

  public updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const { id } = req.params;
      const job = await jobService.updateJob(employerId, id as string, req.body);
      res.status(200).json(ApiResponse.success('Job updated successfully', job ? JobMapper.toDTO(job) : null));
    } catch (error) {
      next(error);
    }
  };

  public changeJobStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body; // e.g. Paused, Closed, Active, Archived
      const job = await jobService.changeJobStatus(employerId, id as string, status);
      res.status(200).json(ApiResponse.success(`Job status changed to ${status}`, job ? JobMapper.toDTO(job) : null));
    } catch (error) {
      next(error);
    }
  };

  public softDeleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const { id } = req.params;
      await jobService.softDeleteJob(employerId, id as string);
      res.status(200).json(ApiResponse.success('Job deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  public getEmployerJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const jobs = await jobRepo.findByEmployer(employerId);
      const dtos = jobs.map(j => JobMapper.toDTO(j));
      // Wrap it in the `{ data: Job[] }` structure because frontend expects `res.data.data` wait actually wait... 
      // let me just return jobs directly but frontend expects `res.data.data`.
      res.status(200).json(ApiResponse.success('Employer jobs fetched', { data: dtos }));
    } catch (error) {
      next(error);
    }
  };

  public getEmployerDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const stats = await jobService.getEmployerDashboardStats(employerId);
      res.status(200).json(ApiResponse.success('Employer stats fetched', stats));
    } catch (error) {
      next(error);
    }
  };

  public getJobApplicants = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const { id } = req.params;
      const applicants = await jobService.getJobApplicants(employerId, id as string);
      // Map to DTOs when we have WorkerMapper
      res.status(200).json(ApiResponse.success('Applicants fetched', applicants));
    } catch (error) {
      next(error);
    }
  };

  public getWorkerApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workerId = req.user!.id;
      const applications = await appRepo.findByWorker(workerId);
      res.status(200).json(ApiResponse.success('Applications fetched', applications));
    } catch (error) {
      next(error);
    }
  };

  public updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const employerId = req.user!.id;
      const { appId } = req.params;
      const { status } = req.body;
      const updatedApp = await jobService.updateApplicationStatus(employerId, appId as string, status as string);
      res.status(200).json(ApiResponse.success(`Application status updated to ${status}`, updatedApp));
    } catch (error) {
      next(error);
    }
  };

  // --- Worker / Public APIs ---

  public searchJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, city, minSalary, employmentType, isUrgent, query, lat, lng, maxDistanceKm, page, limit } = req.query;
      
      const params: any = {
        category,
        city,
        minSalary: minSalary ? Number(minSalary) : undefined,
        employmentType,
        isUrgent: isUrgent === 'true',
        query,
        maxDistanceKm: maxDistanceKm ? Number(maxDistanceKm) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      };

      if (lat && lng) {
        params.coordinates = [Number(lng), Number(lat)];
      }

      const result = await jobService.searchJobs(params);
      const dtos = result.jobs.map(j => {
        const distance = (j as any).distance ? (j as any).distance / 1000 : undefined; // Convert m to km
        return JobMapper.toSummaryDTO(j, distance);
      });

      res.status(200).json(ApiResponse.success('Search results fetched', { jobs: dtos, nextCursor: result.nextCursor }));
    } catch (error) {
      next(error);
    }
  };

  public getJobById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const incrementView = req.query.view === 'true';
      const job = await jobService.getJobById(id as string, incrementView);
      if (!job) {
        return res.status(404).json(ApiResponse.error('Job not found'));
      }
      res.status(200).json(ApiResponse.success('Job fetched', JobMapper.toDTO(job)));
    } catch (error) {
      next(error);
    }
  };

  public getRecommendedJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workerId = req.user!.id;
      // V1: Simple recent active jobs query, scored by recommendation engine in memory.
      // In production with millions of jobs, this would be an aggregation pipeline.
      const recentJobs = await jobRepo.search({ page: 1, limit: 50 });
      
      const scoredJobs = await Promise.all(recentJobs.jobs.map(async job => {
        const match = await recommendationService.calculateMatchScore(job, req.user! as any); // Context placeholder
        return { job, score: match.score, labels: match.reasons };
      }));

      scoredJobs.sort((a, b) => b.score - a.score);
      const topJobs = scoredJobs.slice(0, 10).map(sj => JobMapper.toSummaryDTO(sj.job, undefined, sj.labels));

      res.status(200).json(ApiResponse.success('Recommendations fetched', topJobs));
    } catch (error) {
      next(error);
    }
  };

  public getNearbyJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { lat, lng } = req.query;
      if (!lat || !lng) {
        return res.status(400).json(ApiResponse.error('lat and lng are required'));
      }
      const result = await jobService.searchJobs({
        coordinates: [Number(lng), Number(lat)],
        maxDistanceKm: 50,
        page: 1,
        limit: 20
      });
      const dtos = result.jobs.map(j => {
        const distance = (j as any).distance ? (j as any).distance / 1000 : undefined;
        return JobMapper.toSummaryDTO(j, distance);
      });
      res.status(200).json(ApiResponse.success('Nearby jobs fetched', dtos));
    } catch (error) {
      next(error);
    }
  };

  public applyForJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workerId = req.user!.id;
      const { id } = req.params;
      const { coverLetter, expectedSalary } = req.body;
      const application = await jobService.applyForJob(workerId, id as string, coverLetter, expectedSalary);
      res.status(201).json(ApiResponse.success('Applied successfully', application));
    } catch (error) {
      next(error);
    }
  };

  public toggleBookmark = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const workerId = req.user!.id;
      const { id } = req.params;
      const isBookmarked = await jobService.toggleBookmark(workerId, id as string);
      res.status(200).json(ApiResponse.success(isBookmarked ? 'Job bookmarked' : 'Job unbookmarked', { isBookmarked }));
    } catch (error) {
      next(error);
    }
  };

}
