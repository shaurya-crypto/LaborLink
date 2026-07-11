import { create } from 'zustand';
import { ApplicationStatus } from '@/models/Job';

export interface TimelineStep {
  status: string;
  isCompleted: boolean;
  isActive: boolean;
  timestamp: string | null;
}

interface TimelineStore {
  getTimelineForJob: (jobId: string, appStatus: ApplicationStatus | undefined, appliedAt?: string) => TimelineStep[];
}

export const useTimelineStore = create<TimelineStore>((_set) => ({
  getTimelineForJob: (jobId, appStatus, appliedAt) => {
    // If not applied yet
    if (!appStatus) {
      return [
        { status: 'Job Posted', isCompleted: true, isActive: true, timestamp: 'Just now' },
        { status: 'Worker Applied', isCompleted: false, isActive: false, timestamp: null },
        { status: 'Employer Viewed Application', isCompleted: false, isActive: false, timestamp: null },
        { status: 'Interview Scheduled', isCompleted: false, isActive: false, timestamp: null },
        { status: 'Worker Hired', isCompleted: false, isActive: false, timestamp: null },
        { status: 'Work Completed', isCompleted: false, isActive: false, timestamp: null },
        { status: 'Payment Pending', isCompleted: false, isActive: false, timestamp: null },
      ];
    }

    const appliedDate = appliedAt ? new Date(appliedAt) : new Date(Date.now() - 1000 * 60 * 60 * 48);
    const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    // Determine states based on status
    const steps: TimelineStep[] = [
      { 
        status: 'Job Posted', 
        isCompleted: true, 
        isActive: appStatus === 'Pending' ? false : false, 
        timestamp: formatDate(new Date(appliedDate.getTime() - 1000 * 60 * 60 * 24)) 
      },
      { 
        status: 'Worker Applied', 
        isCompleted: true, 
        isActive: appStatus === 'Pending', 
        timestamp: formatDate(appliedDate) 
      },
      { 
        status: 'Employer Viewed Application', 
        isCompleted: appStatus !== 'Pending', 
        isActive: appStatus === 'Pending', 
        timestamp: appStatus !== 'Pending' ? formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 4)) : null 
      },
      { 
        status: 'Interview Scheduled', 
        isCompleted: ['Interview', 'Accepted', 'Completed'].includes(appStatus), 
        isActive: appStatus === 'Interview', 
        timestamp: ['Interview', 'Accepted', 'Completed'].includes(appStatus) ? formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 12)) : null 
      },
      { 
        status: 'Worker Hired', 
        isCompleted: ['Accepted', 'Completed'].includes(appStatus), 
        isActive: appStatus === 'Accepted', 
        timestamp: ['Accepted', 'Completed'].includes(appStatus) ? formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 24)) : null 
      },
      { 
        status: 'Work Completed', 
        isCompleted: appStatus === 'Completed', 
        isActive: appStatus === 'Completed', 
        timestamp: appStatus === 'Completed' ? formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 48)) : null 
      },
      { 
        status: 'Payment Pending', 
        isCompleted: false, 
        isActive: appStatus === 'Completed', 
        timestamp: null 
      },
    ];

    // If rejected, replace step 3/4 with Rejected state
    if (appStatus === 'Rejected') {
      return [
        steps[0],
        steps[1],
        { status: 'Employer Viewed Application', isCompleted: true, isActive: false, timestamp: formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 4)) },
        { status: 'Application Declined', isCompleted: true, isActive: true, timestamp: formatDate(new Date(appliedDate.getTime() + 1000 * 60 * 60 * 18)) },
      ];
    }

    return steps;
  },
}));
