export type JobType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Daily Wage';
export type JobStatus = 'Draft' | 'Open' | 'In Progress' | 'Completed' | 'Closed';

export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  distanceKm: number;
  salaryMin: number;
  salaryMax: number;
  salaryType: 'Monthly' | 'Daily' | 'Weekly';
  experienceRequired: string;
  workingHours: string;
  postedAt: string; // ISO string
  isUrgent: boolean;
  isVerified: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  
  // Dynamic mock badges injected by MockDataService based on user profile
  matchLabels?: string[]; 
}

export type ApplicationStatus = 'Pending' | 'Interview' | 'Accepted' | 'Rejected' | 'Completed';

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  appliedAt: string; // ISO
  status: ApplicationStatus;
}

export interface EmployerJob extends Job {
  status: JobStatus;
  views: number;
  applicantsCount: number;
}

import { WorkerProfile } from './User';

export interface Applicant {
  id: string;
  jobId: string;
  worker: WorkerProfile;
  appliedAt: string; // ISO
  status: ApplicationStatus;
  matchScore: number;
}

export type NotificationCategory = 'Applications' | 'Recommendations' | 'Messages' | 'System' | 'Job Updates' | 'Hiring';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
