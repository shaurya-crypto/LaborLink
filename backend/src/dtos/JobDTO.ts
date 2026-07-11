export interface JobDTO {
  id: string; // Mapped from _id
  title: string;
  description: string;
  category: string;
  occupation: string;
  employmentType: string;
  experienceRequired: string;
  educationRequired?: string;
  
  salary: {
    type: string;
    min: number;
    max: number;
    currency: string;
    paymentFrequency?: string;
  };

  employer: {
    id: string; // Mapped from employerId
    companyName: string;
    companyDescription?: string;
    logoId?: string;
  };

  location: {
    state?: string;
    city: string;
    area?: string;
    address?: string;
    coordinates?: [number, number]; // [lng, lat]
  };

  skills: {
    required: string[];
    preferred: string[];
    languages: string[];
  };

  status: string;
  workersCount: number;

  media: {
    bannerId?: string;
    attachmentIds: string[];
  };

  analytics: {
    views: number;
    applications: number;
  };

  metadata: {
    featured: boolean;
    verifiedEmployer: boolean;
    urgentHiring: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Minimal DTO for list views to save bandwidth
export interface JobSummaryDTO {
  id: string;
  title: string;
  companyName: string;
  category: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryType: string;
  experienceRequired: string;
  workingHours: string; // Mapped from employmentType or a specific field
  postedAt: string;
  isUrgent: boolean;
  isVerified: boolean;
  matchLabels?: string[]; // Injected by Recommendation Engine
  distanceKm?: number;    // Injected by GeoQuery
}
