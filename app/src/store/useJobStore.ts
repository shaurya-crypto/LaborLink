import { create } from 'zustand';
import { Job, Application, AppNotification } from '@/models/Job';
import { mockDataService } from '@/services/MockDataService';
import { useAuthStore } from './useAuthStore';

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
  toggleBookmark: (job: Job) => void;
  fetchApplications: () => Promise<void>;
  applyForJob: (jobId: string) => Promise<void>;
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
      const user = useAuthStore.getState().user;
      const [recommended, nearby] = await Promise.all([
        mockDataService.getRecommendedJobs(user),
        mockDataService.getNearbyJobs(user)
      ]);
      set({ recommendedJobs: recommended, nearbyJobs: nearby, loadingJobs: false });
    } catch (e) {
      set({ loadingJobs: false });
    }
  },
  
  toggleBookmark: (job: Job) => {
    const { bookmarkedJobIds, bookmarkedJobs } = get();
    const isBookmarked = bookmarkedJobIds.includes(job.id);
    
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
  },
  
  fetchApplications: async () => {
    set({ loadingApplications: true });
    try {
      const apps = await mockDataService.getMockApplications();
      set({ applications: apps, loadingApplications: false });
    } catch (e) {
      set({ loadingApplications: false });
    }
  },
  
  applyForJob: async (jobId: string) => {
    try {
      const newApp = await mockDataService.applyToJob(jobId);
      set(state => ({ applications: [newApp, ...state.applications] }));
    } catch (e) {
      throw e;
    }
  },
  
  fetchNotifications: async () => {
    set({ loadingNotifications: true });
    try {
      const notifs = await mockDataService.getMockNotifications();
      set({ notifications: notifs, loadingNotifications: false });
    } catch (e) {
      set({ loadingNotifications: false });
    }
  },
  
  markAllNotificationsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }));
  },
  
  deleteNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
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
