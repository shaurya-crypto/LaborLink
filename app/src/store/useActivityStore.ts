import { create } from 'zustand';

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string; // ISO String
  category: 'Applications' | 'Messages' | 'Hiring' | 'Jobs' | 'System';
  role: 'worker' | 'employer';
}

interface ActivityStore {
  activities: ActivityItem[];
  loadingActivities: boolean;
  todayActivities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  fetchActivities: () => Promise<void>;
  initializeActivities: () => void;
}

const MOCK_ACTIVITIES: ActivityItem[] = [];

export const useActivityStore = create<ActivityStore>((set, get) => ({
  activities: MOCK_ACTIVITIES,
  loadingActivities: false,
  todayActivities: MOCK_ACTIVITIES.filter(a => {
    const diff = Date.now() - new Date(a.timestamp).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }),

  addActivity: (activity) => {
    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...activity,
    };
    set((state) => ({
      activities: [newActivity, ...state.activities],
      todayActivities: [newActivity, ...state.todayActivities],
    }));
  },

  initializeActivities: () => {
    const all = get().activities;
    const today = all.filter(a => {
      const diff = Date.now() - new Date(a.timestamp).getTime();
      return diff < 24 * 60 * 60 * 1000;
    });
    set({ todayActivities: today });
  },

  fetchActivities: async () => {
    set({ loadingActivities: true });
    // Network lag simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loadingActivities: false });
  },
}));
