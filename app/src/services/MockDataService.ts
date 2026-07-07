import { Job, Application, AppNotification, EmployerJob, Applicant } from '@/models/Job';
import { User, WorkerProfile } from '@/models/User';

const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Electrician',
    company: 'Tata Projects Ltd',
    category: 'Electrician',
    location: 'Andheri East, Mumbai',
    distanceKm: 4.2,
    salaryMin: 25000,
    salaryMax: 35000,
    salaryType: 'Monthly',
    experienceRequired: '3 - 5 years',
    workingHours: '9:00 AM - 6:00 PM',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isUrgent: true,
    isVerified: true,
    description: 'We are looking for an experienced electrician to handle commercial building wiring and maintenance.',
    responsibilities: [
      'Install and repair electrical wiring systems.',
      'Troubleshoot electrical issues in commercial setups.',
      'Ensure safety compliance during all operations.'
    ],
    requirements: [
      'ITI Certification in Electrician Trade.',
      'Minimum 3 years of commercial experience.',
      'Ability to read blueprints.'
    ],
    benefits: ['PF & ESI', 'Overtime Pay', 'Health Insurance']
  },
  {
    id: 'job-2',
    title: 'Commercial Plumber',
    company: 'Godrej Properties',
    category: 'Plumber',
    location: 'Bandra Kurla Complex, Mumbai',
    distanceKm: 12.5,
    salaryMin: 800,
    salaryMax: 1200,
    salaryType: 'Daily',
    experienceRequired: '1 - 3 years',
    workingHours: '10:00 AM - 7:00 PM',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isUrgent: false,
    isVerified: true,
    description: 'Require a skilled plumber for a new commercial real estate project.',
    responsibilities: [
      'Install plumbing systems in new constructions.',
      'Test systems for leaks and other issues.',
    ],
    requirements: [
      'Basic plumbing tools required.',
      'Physical stamina.',
    ],
    benefits: ['Travel Allowance', 'Daily Meals']
  },
  {
    id: 'job-3',
    title: 'Construction Helper',
    company: 'L&T Construction',
    category: 'Helper',
    location: 'Navi Mumbai',
    distanceKm: 25.0,
    salaryMin: 500,
    salaryMax: 600,
    salaryType: 'Daily',
    experienceRequired: 'Less than 1 year',
    workingHours: '8:00 AM - 5:00 PM',
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isUrgent: true,
    isVerified: true,
    description: 'General construction helper needed for site clearing and material transport.',
    responsibilities: [
      'Load and unload construction materials.',
      'Assist skilled workers on site.',
    ],
    requirements: [
      'Must be physically fit.',
      'Willing to work hard.'
    ],
    benefits: ['Accommodation provided', 'Weekly payout']
  },
  {
    id: 'job-4',
    title: 'Heavy Vehicle Driver',
    company: 'Delhivery Logistics',
    category: 'Driver',
    location: 'Bhiwandi, Maharashtra',
    distanceKm: 35.0,
    salaryMin: 22000,
    salaryMax: 30000,
    salaryType: 'Monthly',
    experienceRequired: '5+ years',
    workingHours: 'Flexible / Shift Based',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isUrgent: false,
    isVerified: true,
    description: 'Experienced truck driver required for inter-city logistics transport.',
    responsibilities: [
      'Safely transport goods across cities.',
      'Maintain vehicle logs and ensure timely delivery.',
    ],
    requirements: [
      'Valid Heavy Motor Vehicle (HMV) License.',
      'Clean driving record.',
    ],
    benefits: ['Trip incentives', 'Insurance']
  },
  {
    id: 'job-5',
    title: 'Finishing Carpenter',
    company: 'Livspace Interiors',
    category: 'Carpenter',
    location: 'Powai, Mumbai',
    distanceKm: 8.0,
    salaryMin: 20000,
    salaryMax: 28000,
    salaryType: 'Monthly',
    experienceRequired: '3 - 5 years',
    workingHours: '9:30 AM - 6:30 PM',
    postedAt: new Date().toISOString(),
    isUrgent: false,
    isVerified: false,
    description: 'Looking for a finishing carpenter for premium residential interiors.',
    responsibilities: [
      'Install modular furniture.',
      'Wood polishing and finishing work.',
    ],
    requirements: [
      'Attention to detail.',
      'Experience with premium laminates.'
    ],
    benefits: ['Project completion bonus']
  },
];

const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    occupation: 'Electrician',
    experience: '3 - 5 years',
    city: 'Jaipur, Rajasthan',
    skills: ['Home Wiring', 'Maintenance', 'Repair'],
    languages: ['Hindi', 'English'],
    workingHours: '9:00 AM - 6:00 PM',
    availability: 'Full Time',
    expectedSalary: '₹25,000 / Monthly',
    profileCompletion: 85,
    gender: 'Male',
    rating: 4.8,
    distanceKm: 2.1,
  },
  {
    id: 'worker-2',
    name: 'Amit Singh',
    email: 'amit@example.com',
    occupation: 'Plumber',
    experience: '1 - 3 years',
    city: 'Jaipur, Rajasthan',
    skills: ['Bathroom Fitting', 'Pipe Repair', 'Installation'],
    languages: ['Hindi'],
    workingHours: '10:00 AM - 7:00 PM',
    availability: 'Part Time',
    expectedSalary: '₹800 / Daily',
    profileCompletion: 60,
    gender: 'Male',
    rating: 4.2,
    distanceKm: 5.4,
  },
  {
    id: 'worker-3',
    name: 'Pooja Sharma',
    email: 'pooja@example.com',
    occupation: 'Cleaning',
    experience: 'Fresher',
    city: 'Jaipur, Rajasthan',
    skills: ['Deep Cleaning', 'Dusting', 'Sanitization'],
    languages: ['Hindi', 'English'],
    workingHours: 'Flexible',
    availability: 'Contract',
    expectedSalary: '₹15,000 / Monthly',
    profileCompletion: 95,
    gender: 'Female',
    rating: 4.9,
    distanceKm: 1.2,
  },
  {
    id: 'worker-4',
    name: 'Vikram Patel',
    email: 'vikram@example.com',
    occupation: 'Carpenter',
    experience: '5+ years',
    city: 'Jaipur, Rajasthan',
    skills: ['Wood Polish', 'Furniture Assembly', 'Cutting'],
    languages: ['Hindi', 'Gujarati'],
    workingHours: '8:00 AM - 5:00 PM',
    availability: 'Full Time',
    expectedSalary: '₹30,000 / Monthly',
    profileCompletion: 100,
    gender: 'Male',
    rating: 4.6,
    distanceKm: 8.5,
  }
];

const MOCK_EMPLOYER_JOBS: EmployerJob[] = [
  {
    ...MOCK_JOBS[0],
    id: 'emp-job-1',
    status: 'Open',
    views: 142,
    applicantsCount: 12,
  },
  {
    ...MOCK_JOBS[1],
    id: 'emp-job-2',
    status: 'In Progress',
    views: 89,
    applicantsCount: 3,
  },
  {
    ...MOCK_JOBS[2],
    id: 'emp-job-3',
    status: 'Completed',
    views: 400,
    applicantsCount: 45,
  },
  {
    ...MOCK_JOBS[3],
    id: 'emp-job-4',
    status: 'Draft',
    views: 0,
    applicantsCount: 0,
  }
];

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'applicant-1',
    jobId: 'emp-job-1',
    worker: MOCK_WORKERS[0],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'Pending',
    matchScore: 92,
  },
  {
    id: 'applicant-2',
    jobId: 'emp-job-1',
    worker: MOCK_WORKERS[1],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'Rejected',
    matchScore: 45,
  },
  {
    id: 'applicant-3',
    jobId: 'emp-job-2',
    worker: MOCK_WORKERS[3],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'Interview',
    matchScore: 88,
  }
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockDataService {
  
  // Simulates dynamic backend recommendations based on user profile
  private enhanceJobsWithSmartBadges(jobs: Job[], user: User | null): Job[] {
    return jobs.map(job => {
      const labels: string[] = [];
      const now = Date.now();
      const postedDate = new Date(job.postedAt).getTime();
      const isNew = (now - postedDate) < 1000 * 60 * 60 * 24; // Less than 24 hours

      if (isNew) labels.push('New Today');
      if (job.isUrgent) labels.push('High Demand');

      if (user) {
        if (job.category === user.occupation) labels.push('Matches your skills');
        if (job.distanceKm < 10) labels.push('Near You');
        if (job.experienceRequired === user.experience) labels.push('Good for your experience');
      }

      return { ...job, matchLabels: labels.slice(0, 2) }; // Max 2 labels to keep UI clean
    });
  }

  async getRecommendedJobs(user: User | null): Promise<Job[]> {
    await delay(1000);
    // Shuffle slightly to make it feel dynamic on reload
    const shuffled = [...MOCK_JOBS].sort(() => 0.5 - Math.random());
    return this.enhanceJobsWithSmartBadges(shuffled, user);
  }

  async getNearbyJobs(user: User | null): Promise<Job[]> {
    await delay(800);
    const nearby = [...MOCK_JOBS].sort((a, b) => a.distanceKm - b.distanceKm);
    return this.enhanceJobsWithSmartBadges(nearby, user);
  }

  async getJobDetails(jobId: string, user: User | null): Promise<Job | null> {
    await delay(500);
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) return null;
    return this.enhanceJobsWithSmartBadges([job], user)[0];
  }

  async searchJobs(query: string, user: User | null): Promise<Job[]> {
    await delay(1200);
    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_JOBS.filter(job => 
      job.title.toLowerCase().includes(lowerQuery) || 
      job.category.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery)
    );
    return this.enhanceJobsWithSmartBadges(filtered, user);
  }

  async getCategories(): Promise<any[]> {
    await delay(300);
    return [
      { id: '1', name: 'Electrician', icon: 'zap' },
      { id: '2', name: 'Plumber', icon: 'droplet' },
      { id: '3', name: 'Carpenter', icon: 'tool' },
      { id: '4', name: 'Welder', icon: 'cpu' },
      { id: '5', name: 'Driver', icon: 'truck' },
      { id: '6', name: 'Helper', icon: 'box' },
    ];
  }

  async getMockApplications(): Promise<Application[]> {
    await delay(1000);
    return [
      {
        id: 'app-1',
        jobId: 'job-1',
        job: MOCK_JOBS[0],
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        status: 'Interview'
      },
      {
        id: 'app-2',
        jobId: 'job-5',
        job: MOCK_JOBS[4],
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        status: 'Rejected'
      }
    ];
  }

  async applyToJob(jobId: string): Promise<Application> {
    await delay(1500); // Simulate processing
    const job = MOCK_JOBS.find(j => j.id === jobId)!;
    return {
      id: `app-${Date.now()}`,
      jobId,
      job,
      appliedAt: new Date().toISOString(),
      status: 'Pending'
    };
  }

  async getMockNotifications(): Promise<AppNotification[]> {
    await delay(800);
    return [
      {
        id: 'notif-1',
        category: 'Applications',
        title: 'Interview Scheduled',
        message: 'Tata Projects wants to interview you for the Senior Electrician role.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false
      },
      {
        id: 'notif-2',
        category: 'Recommendations',
        title: 'New Jobs Matching Your Skills',
        message: '3 new Electrician jobs posted near Andheri.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        isRead: true
      }
    ];
  }

  // ==========================================
  // EMPLOYER METHODS
  // ==========================================

  async getEmployerDashboardStats() {
    await delay(500);
    return {
      openJobs: 2,
      activeJobs: 1,
      applicationsReceived: 15,
      workersHired: 4,
      completedJobs: 12
    };
  }

  async getEmployerJobs(): Promise<EmployerJob[]> {
    await delay(800);
    return [...MOCK_EMPLOYER_JOBS];
  }

  async getRecommendedWorkers(): Promise<WorkerProfile[]> {
    await delay(1000);
    const shuffled = [...MOCK_WORKERS].sort(() => 0.5 - Math.random());
    return shuffled.map(w => ({...w, matchLabels: ['Highly Recommended']}));
  }

  async getNearbyWorkers(): Promise<WorkerProfile[]> {
    await delay(800);
    const nearby = [...MOCK_WORKERS].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    return nearby.map(w => ({...w, matchLabels: ['Near You']}));
  }

  async searchWorkers(query: string): Promise<WorkerProfile[]> {
    await delay(1200);
    const lowerQuery = query.toLowerCase();
    return MOCK_WORKERS.filter(worker => 
      worker.name.toLowerCase().includes(lowerQuery) || 
      worker.occupation?.toLowerCase().includes(lowerQuery) ||
      worker.skills.some(s => s.toLowerCase().includes(lowerQuery))
    );
  }

  async getJobApplicants(jobId: string): Promise<Applicant[]> {
    await delay(800);
    return MOCK_APPLICANTS.filter(a => a.jobId === jobId);
  }

  async hireApplicant(applicantId: string): Promise<void> {
    await delay(1000);
    // Simulates hiring
  }

  async postJob(jobData: any): Promise<void> {
    await delay(1500);
    // Simulates job creation
  }

  async getEmployerNotifications(): Promise<AppNotification[]> {
    await delay(800);
    return [
      {
        id: 'emp-notif-1',
        category: 'Applications',
        title: 'New Application',
        message: 'Rajesh Kumar applied for Senior Electrician.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        isRead: false
      },
      {
        id: 'emp-notif-2',
        category: 'System',
        title: 'Profile Approved',
        message: 'Your employer profile has been verified successfully.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: true
      }
    ];
  }

}

export const mockDataService = new MockDataService();
