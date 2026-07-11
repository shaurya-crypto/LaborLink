import { create } from 'zustand';
import { Job, Applicant, JobStatus } from '@/models/Job';
import { WorkerProfile } from '@/models/User';
import { jobService } from '@/services/JobService';
import Toast from 'react-native-toast-message';

// We map Job to EmployerJob by adding some fields if they don't exist, though backend returns views etc.
interface EmployerJob extends Job {
  status: JobStatus;
  views: number;
  applicantsCount: number;
}

interface EmployerStoreState {
  stats: any;
  jobs: EmployerJob[];
  applicants: Record<string, Applicant[]>; // jobId -> Applicant[]
  savedWorkers: WorkerProfile[];
  recommendedWorkers: WorkerProfile[];
  loading: boolean;
  
  fetchDashboardData: () => Promise<void>;
  fetchJobApplicants: (jobId: string) => Promise<void>;
  hireWorker: (jobId: string, applicantId: string) => Promise<void>;
  rejectWorker: (jobId: string, applicantId: string) => Promise<void>;
  shortlistWorker: (jobId: string, applicantId: string) => Promise<void>;
  createJob: (jobData: Partial<Job>) => Promise<void>;
  changeJobStatus: (jobId: string, status: string) => Promise<void>;
  saveWorker: (worker: WorkerProfile) => void;
  removeSavedWorker: (workerId: string) => void;
}

export const useEmployerStore = create<EmployerStoreState>((set, get) => ({
  stats: null,
  jobs: [],
  applicants: {},
  savedWorkers: [],
  recommendedWorkers: [],
  loading: false,

  fetchDashboardData: async () => {
    set({ loading: true });
    try {
      const [stats, jobs, recommendedWorkers] = await Promise.all([
        jobService.getEmployerDashboardStats(),
        jobService.getEmployerJobs(),
        jobService.getRecommendedWorkers(),
      ]);
      set({ stats, jobs: jobs as any, recommendedWorkers, loading: false });
    } catch (e: any) {
      set({ loading: false });
      Toast.show({ type: 'error', text1: 'Failed to fetch dashboard data', text2: e.message });
    }
  },

  fetchJobApplicants: async (jobId: string) => {
    try {
      const apps = await jobService.getJobApplicants(jobId);
      set(state => ({
        applicants: { ...state.applicants, [jobId]: apps as any }
      }));
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to fetch applicants', text2: e.message });
    }
  },

  hireWorker: async (jobId: string, applicantId: string) => {
    try {
      await jobService.updateApplicationStatus(applicantId, 'Hired');
      set(state => ({
        applicants: {
          ...state.applicants,
          [jobId]: (state.applicants[jobId] || []).map(a => a.id === applicantId ? { ...a, status: 'Hired' as any } : a)
        }
      }));
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to hire worker', text2: e.message });
      throw e;
    }
  },

  rejectWorker: async (jobId: string, applicantId: string) => {
    try {
      await jobService.updateApplicationStatus(applicantId, 'Rejected');
      set(state => ({
        applicants: {
          ...state.applicants,
          [jobId]: (state.applicants[jobId] || []).map(a => a.id === applicantId ? { ...a, status: 'Rejected' as any } : a)
        }
      }));
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to reject worker', text2: e.message });
      throw e;
    }
  },

  shortlistWorker: async (jobId: string, applicantId: string) => {
    try {
      await jobService.updateApplicationStatus(applicantId, 'Interview'); // Or Shortlisted
      set(state => ({
        applicants: {
          ...state.applicants,
          [jobId]: (state.applicants[jobId] || []).map(a => a.id === applicantId ? { ...a, status: 'Interview' as any } : a)
        }
      }));
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to shortlist worker', text2: e.message });
      throw e;
    }
  },

  createJob: async (jobData: Partial<Job>) => {
    try {
      const newJob = await jobService.createJob(jobData);
      set(state => ({ jobs: [newJob as any, ...state.jobs] }));
      Toast.show({ type: 'success', text1: 'Job created successfully' });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to create job', text2: e.message });
      throw e;
    }
  },

  changeJobStatus: async (jobId: string, status: string) => {
    try {
      const updatedJob = await jobService.changeJobStatus(jobId, status);
      set(state => ({
        jobs: state.jobs.map(j => j.id === jobId ? { ...j, status: (updatedJob as any).status as JobStatus } : j)
      }));
      Toast.show({ type: 'success', text1: `Job status changed to ${status}` });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Failed to update job status', text2: e.message });
      throw e;
    }
  },

  saveWorker: (worker: WorkerProfile) => {
    const current = get().savedWorkers;
    if (!current.find(w => w.id === worker.id)) {
      set({ savedWorkers: [worker, ...current] });
    }
  },

  removeSavedWorker: (workerId: string) => {
    const current = get().savedWorkers;
    set({ savedWorkers: current.filter(w => w.id !== workerId) });
  }

}));
