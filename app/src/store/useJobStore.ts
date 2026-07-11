import { create } from 'zustand';
import { Job, Application, AppNotification } from '@/models/Job';
import Toast from 'react-native-toast-message';
import { jobService } from '@/services/JobService';
import { notificationService } from '@/services/NotificationService';

interface JobStoreState {
  // Jobs
  recommendedJobs: Job[];
  nearbyJobs: Job[];
  loadingJobs: boolean;
  
  // Bookmarks
  bookmarkedJobIds: string[];
  bookmarkedJobs: Job[]; // Hydrated
  
  // Applications
  applications: Application[];
  loadingApplications: boolean;
  
  // Notifications
  notifications: AppNotification[];
  loadingNotifications: boolean;
  
  // Search
  recentSearches: string[];
  
  // Actions
  fetchHomeData: () => Promise<void>;
  toggleBookmark: (job: Job) => Promise<void>;
  fetchApplications: () => Promise<void>;
  applyForJob: (jobId: string, coverLetter?: string, expectedSalary?: number) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useJobStore = create<JobStoreState>((set, get) => ({
  recommendedJobs: [],
  nearbyJobs: [],
  loadingJobs: false,
  
  bookmarkedJobIds: [],
  bookmarkedJobs: [],
  
  applications: [],
  loadingApplications: false,
  
  notifications: [],
  loadingNotifications: false,
  
  recentSearches: ['Electrician', 'Mumbai', 'L&T Construction'],
  
  fetchHomeData: async () => {
    set({ loadingJobs: true });
    try {
      // Hardcoded coordinates for nearby jobs temporarily until LocationService is integrated
      const [recommended, nearby] = await Promise.all([
        jobService.getRecommendedJobs(),
        jobService.getNearbyJobs(19.0760, 72.8777) // Mumbai coords
      ]);
      set({ recommendedJobs: recommended, nearbyJobs: nearby, loadingJobs: false });
    } catch (e: any) {
      set({ loadingJobs: false });
      Toast.show({ type: 'error', text1: 'Error fetching jobs', text2: e.message });
    }
  },
  
  toggleBookmark: async (job: Job) => {
    const { bookmarkedJobIds, bookmarkedJobs } = get();
    const isBookmarked = bookmarkedJobIds.includes(job.id);
    
    // Optimistic Update
    if (isBookmarked) {
      set({ 
        bookmarkedJobIds: bookmarkedJobIds.filter(id => id !== job.id),
        bookmarkedJobs: bookmarkedJobs.filter(j => j.id !== job.id)
      });
    } else {
      set({ 
        bookmarkedJobIds: [...bookmarkedJobIds, job.id],
        bookmarkedJobs: [...bookmarkedJobs, job]
      });
    }

    try {
      await jobService.toggleBookmark(job.id);
    } catch (e: any) {
      // Revert on failure
      Toast.show({ type: 'error', text1: 'Failed to bookmark', text2: e.message });
      if (isBookmarked) {
        set({ 
          bookmarkedJobIds: [...bookmarkedJobIds, job.id],
          bookmarkedJobs: [...bookmarkedJobs, job]
        });
      } else {
        set({ 
          bookmarkedJobIds: bookmarkedJobIds.filter(id => id !== job.id),
          bookmarkedJobs: bookmarkedJobs.filter(j => j.id !== job.id)
        });
      }
    }
  },
  
  fetchApplications: async () => {
    set({ loadingApplications: true });
    try {
      const apps = await jobService.getWorkerApplications();
      set({ applications: apps, loadingApplications: false });
    } catch (e: any) {
      set({ loadingApplications: false });
      Toast.show({ type: 'error', text1: 'Error fetching applications', text2: e.message });
    }
  },
  
  applyForJob: async (jobId: string, coverLetter?: string, expectedSalary?: number) => {
    try {
      await jobService.applyForJob(jobId, coverLetter, expectedSalary);
      // set(state => ({ applications: [newApp, ...state.applications] }));
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Application failed', text2: e.message });
      throw e;
    }
  },
  
  fetchNotifications: async () => {
    set({ loadingNotifications: true });
    try {
      const data = await notificationService.getNotifications();
      // Map backend fields to frontend model if necessary, or just set it
      set({ notifications: data.notifications, loadingNotifications: false });
    } catch {
      set({ loadingNotifications: false });
    }
  },
  
  markAllNotificationsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      }));
    } catch (e) {
      console.error('Error marking notifications read', e);
    }
  },
  
  deleteNotification: async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    } catch (e) {
      console.error('Error deleting notification', e);
    }
  },
  
  addRecentSearch: (query: string) => {
    if (!query.trim()) return;
    set(state => {
      const filtered = state.recentSearches.filter(q => q.toLowerCase() !== query.toLowerCase());
      return { recentSearches: [query, ...filtered].slice(0, 10) };
    });
  },
  
  clearRecentSearches: () => {
    set({ recentSearches: [] });
  }
}));
