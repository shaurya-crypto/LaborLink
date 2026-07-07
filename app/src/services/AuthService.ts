import Config from 'react-native-config';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthResponse, User } from '@/models/User';

// Helper to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Mock JWT Token for Phase 1.1 frontend-only architecture
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-for-phase-1.1";

class AuthService {
  async init() {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID, 
      offlineAccess: true,
    });
  }

  /**
   * Mock Implementation of future POST /auth/login
   */
  async login(email?: string, password?: string): Promise<AuthResponse> {
    await delay(1200); 
    if (email === 'error@test.com') {
      throw new Error('Invalid email or password');
    }
    return {
      token: MOCK_TOKEN,
      user: {
        id: 'mock-usr-123',
        name: 'LaborLink User',
        email: email || 'user@laborlink.com',
      }
    };
  }

  /**
   * Mock Implementation of future POST /auth/register
   * Triggers OTP email via Brevo in Phase 1.4
   */
  async register(email: string, password?: string, name?: string): Promise<void> {
    await delay(1200);
    if (email === 'error@test.com') {
      throw new Error('Email already in use');
    }
  }

  /**
   * Mock Implementation of future POST /auth/verify-email
   */
  async verifyEmail(email: string, otp: string): Promise<AuthResponse> {
    await delay(1200);
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }
    return {
      token: MOCK_TOKEN,
      user: {
        id: 'mock-usr-123',
        name: 'LaborLink User',
        email,
      }
    };
  }

  /**
   * Mock Implementation of future POST /auth/forgot-password
   */
  async forgotPassword(email: string): Promise<void> {
    await delay(1200);
    if (!email) throw new Error('Email required');
  }

  /**
   * Mock Implementation of future POST /auth/verify-reset-otp
   */
  async verifyResetOtp(email: string, otp: string): Promise<void> {
    await delay(1200);
    if (otp !== '123456') throw new Error('Invalid OTP');
  }

  /**
   * Mock Implementation of future POST /auth/reset-password
   */
  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    await delay(1200);
    if (otp !== '123456') throw new Error('Invalid OTP');
  }

  /**
   * Mock Implementation of future POST /auth/google
   * Verifies Google ID Token on the backend and returns unified MongoDB user
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) throw new Error('Google Sign-In failed to return ID token');

      // Simulate backend ID token verification
      await delay(1200); 

      return {
        token: MOCK_TOKEN,
        user: {
          id: userInfo.data?.user.id || 'mock-usr-123',
          name: userInfo.data?.user.name || 'Google User',
          email: userInfo.data?.user.email || 'google@user.com',
          photo: userInfo.data?.user.photo || undefined,
        }
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('User cancelled the login flow');
      }
      throw error;
    }
  }

  /**
   * Mock Implementation of future POST /auth/logout
   */
  async logout() {
    await delay(500); 
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // Ignore error if not signed in with Google
    }
  }
}

export const authService = new AuthService();
