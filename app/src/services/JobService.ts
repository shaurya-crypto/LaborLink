import { Job, Application } from '@/models/Job';
import { apiClient } from '../api/apiClient';

class JobService {
  
  // --- Worker / Public Endpoints ---

  async searchJobs(params: any): Promise<{ jobs: Job[], nextCursor?: string }> {
    const response = await apiClient.get('/jobs/search', { params });
    return response.data;
  }

  async getRecommendedJobs(): Promise<Job[]> {
    const response = await apiClient.get('/jobs/recommended');
    return response.data;
  }

  async getNearbyJobs(lat: number, lng: number): Promise<Job[]> {
    const response = await apiClient.get('/jobs/nearby', { params: { lat, lng } });
    return response.data;
  }

  async getJobById(id: string, view: boolean = false): Promise<Job> {
    const response = await apiClient.get(`/jobs/${id}`, { params: { view } });
    return response.data;
  }

  async applyForJob(id: string, coverLetter?: string, expectedSalary?: number): Promise<Application> {
    const response = await apiClient.post(`/jobs/${id}/apply`, { coverLetter, expectedSalary });
    return response.data;
  }

  async toggleBookmark(id: string): Promise<boolean> {
    const response = await apiClient.post(`/jobs/${id}/bookmark`);
    return response.data.isBookmarked;
  }

  async getWorkerApplications(): Promise<Application[]> {
    const response = await apiClient.get('/jobs/applications/me');
    return response.data;
  }

  // --- Employer Endpoints ---

  async createJob(jobData: Partial<Job>): Promise<Job> {
    const response = await apiClient.post('/jobs', jobData);
    return response.data;
  }

  async getEmployerJobs(): Promise<Job[]> {
    const response = await apiClient.get('/jobs/employer/me');
    return response.data.data;
  }

  async getEmployerDashboardStats(): Promise<any> {
    const response = await apiClient.get('/jobs/employer/stats');
    return response.data;
  }

  // Stub until Phase 1.3D or separate worker discover service
  async getRecommendedWorkers(): Promise<any[]> {
    // Return empty array for now since no backend exists for this
    return [];
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}`, jobData);
    return response.data;
  }

  async changeJobStatus(id: string, status: string): Promise<Job> {
    const response = await apiClient.patch(`/jobs/${id}/status`, { status });
    return response.data;
  }

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  }

  async getJobApplicants(id: string): Promise<Application[]> {
    const response = await apiClient.get(`/jobs/${id}/applicants`);
    return response.data;
  }

  async updateApplicationStatus(appId: string, status: string): Promise<Application> {
    const response = await apiClient.patch(`/jobs/applications/${appId}/status`, { status });
    return response.data;
  }
}

export const jobService = new JobService();
