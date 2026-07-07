export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  occupation?: string;
  experience?: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
