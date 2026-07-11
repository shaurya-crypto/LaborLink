import Config from 'react-native-config';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthResponse, User } from '@/models/User';
import { apiClient } from '../api/apiClient';
import { TokenStorage } from '../api/TokenStorage';

class AuthService {
  async init() {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }

  async login(email?: string, password?: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    await TokenStorage.setTokens(accessToken, refreshToken);
    
    return { token: accessToken, user };
  }

  async register(email: string, password?: string, name?: string, role: string = 'worker'): Promise<void> {
    await apiClient.post('/auth/register', { email, password, name, role });
  }

  async verifyEmail(email: string, otp: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/verify-email', { email, otp });
    const { accessToken, refreshToken, user } = response.data;
    
    await TokenStorage.setTokens(accessToken, refreshToken);
    
    return { token: accessToken, user };
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async verifyResetOtp(email: string, otp: string): Promise<string> {
    const response = await apiClient.post('/auth/verify-reset-otp', { email, otp });
    return response.data.resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { resetToken, newPassword });
  }

  async loginWithGoogle(role?: string): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('Google Sign-In failed to return ID token');

      const response = await apiClient.post('/auth/google', { idToken, role });
      const { accessToken, refreshToken, user } = response.data;
      
      await TokenStorage.setTokens(accessToken, refreshToken);
      
      return { token: accessToken, user };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('User cancelled the login flow');
      }
      throw error;
    }
  }

  async logout() {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch {
      // ignore
    } finally {
      await TokenStorage.clearTokens();
      try {
        await GoogleSignin.signOut();
      } catch {}
    }
  }

  async getMe(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data.user;
  }
}

export const authService = new AuthService();
