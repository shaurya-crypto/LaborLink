import { create } from 'zustand';
import { EmployerJob, Applicant } from '@/models/Job';
import { mockDataService } from '@/services/MockDataService';
import { WorkerProfile } from '@/models/User';

interface EmployerState {
  stats: any | null;
  employerJobs: EmployerJob[];
  recommendedWorkers: WorkerProfile[];
  loadingDashboard: boolean;
  
  loadingJobs: boolean;
  
  savedWorkers: WorkerProfile[];
  
  fetchDashboardData: () => Promise<void>;
  fetchEmployerJobs: () => Promise<void>;
  postJob: (jobData: any) => Promise<void>;
  saveWorker: (worker: WorkerProfile) => void;
  removeSavedWorker: (workerId: string) => void;
}

export const useEmployerStore = create<EmployerState>((set, get) => ({
  stats: null,
  employerJobs: [],
  recommendedWorkers: [],
  loadingDashboard: false,
  
  loadingJobs: false,
  
  savedWorkers: [],

  fetchDashboardData: async () => {
    set({ loadingDashboard: true });
    try {
      const stats = await mockDataService.getEmployerDashboardStats();
      const recommendedWorkers = await mockDataService.getRecommendedWorkers();
      set({ stats, recommendedWorkers, loadingDashboard: false });
    } catch (error) {
      set({ loadingDashboard: false });
    }
  },

  fetchEmployerJobs: async () => {
    set({ loadingJobs: true });
    try {
      const jobs = await mockDataService.getEmployerJobs();
      set({ employerJobs: jobs, loadingJobs: false });
    } catch (error) {
      set({ loadingJobs: false });
    }
  },

  postJob: async (jobData: any) => {
    await mockDataService.postJob(jobData);
    // In a real app, we'd refetch jobs here. For mock, we'll just wait.
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
