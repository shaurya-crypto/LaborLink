import { IJob } from '../models/Job';
import { JobDTO, JobSummaryDTO } from '../dtos/JobDTO';

export class JobMapper {
  static toDTO(job: IJob, distance?: number, matchLabels?: string[]): any {
    return {
      id: job._id.toString(),
      title: job.title,
      company: job.companyName,
      category: job.category,
      location: job.area ? `${job.area}, ${job.city}` : job.city,
      distanceKm: distance ? Math.round(distance * 10) / 10 : undefined,
      salaryMin: job.minSalary,
      salaryMax: job.maxSalary,
      salaryType: job.salaryType,
      experienceRequired: job.experienceRequired,
      workingHours: job.employmentType,
      postedAt: job.createdAt.toISOString(),
      isUrgent: job.urgentHiring,
      isVerified: job.verifiedEmployer,
      description: job.description,
      responsibilities: job.requiredSkills || [],
      requirements: job.preferredSkills || [],
      benefits: job.languages || [],
      matchLabels: matchLabels || []
    };
  }

  static toSummaryDTO(job: IJob, distance?: number, matchLabels?: string[]): any {
    // For now, details and summary share the same UI interface.
    return this.toDTO(job, distance, matchLabels);
  }
}
