export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  occupation?: string;
  experience?: string;
  city?: string;
}

export interface WorkerProfile extends User {
  skills: string[];
  languages: string[];
  workingHours: string;
  availability: string;
  expectedSalary: string;
  profileCompletion: number;
  gender?: string;
  rating?: number;
  distanceKm?: number;
  matchLabels?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
