import { JobSummaryDTO } from './JobDTO';

export interface ApplicationDTO {
  id: string; // Mapped from _id
  jobId: string;
  workerId: string;
  employerId: string;
  status: string;
  
  coverLetter?: string;
  expectedSalary?: number;
  
  appliedAt: string;
  updatedAt: string;
  
  // Optional populated relationships
  job?: JobSummaryDTO;
  worker?: any; // To be mapped to WorkerSummaryDTO later
  
  matchPercentage: number;
}
