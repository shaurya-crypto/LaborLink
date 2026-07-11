export interface IAuthService {
  registerUser(data: any): Promise<any>;
  loginUser(data: any): Promise<any>;
  verifyEmail(token: string): Promise<any>;
}
