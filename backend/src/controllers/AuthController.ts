import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(ApiResponse.success(result.message, { userId: result.userId }));
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(ApiResponse.success('Login successful', result));
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyEmail(email, otp);
      res.status(200).json(ApiResponse.success('Email verified successfully', result));
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) {
      next(error);
    }
  };

  public verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyResetOtp(email, otp);
      res.status(200).json(ApiResponse.success('OTP verified', result));
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { resetToken, newPassword } = req.body;
      const result = await authService.resetPassword(resetToken, newPassword);
      res.status(200).json(ApiResponse.success(result.message));
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new Error('Refresh token is required'); // Will be caught and formatted
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json(ApiResponse.success('Token refreshed', result));
    } catch (error: any) {
      // Return 401 explicitly for refresh token failures so frontend Axios interceptor knows to logout
      res.status(401).json(ApiResponse.error(error.message || 'Invalid refresh token'));
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.status(200).json(ApiResponse.success('Logged out successfully'));
    } catch (error) {
      next(error);
    }
  };

  public logoutAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await authService.logoutAll(req.user!.id);
      res.status(200).json(ApiResponse.success('Logged out from all devices'));
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken, role } = req.body;
      const result = await authService.googleLogin(idToken, role);
      res.status(200).json(ApiResponse.success('Google login successful', result));
    } catch (error) {
      next(error);
    }
  };
}
