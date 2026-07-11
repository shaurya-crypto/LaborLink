import { Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

const userService = new UserService();

export class UserController {
  public getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await userService.getMe(req.user!.id);
      res.status(200).json(ApiResponse.success('User profile retrieved', result));
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { role, ...data } = req.body;
      const result = await userService.updateProfile(req.user!.id, role, data);
      res.status(200).json(ApiResponse.success('Profile updated successfully', result));
    } catch (error) {
      next(error);
    }
  };

  public completeOnboarding = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await userService.completeOnboarding(req.user!.id);
      res.status(200).json(ApiResponse.success('Onboarding completed', { user: result }));
    } catch (error) {
      next(error);
    }
  };

  public deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await userService.softDelete(req.user!.id);
      res.status(200).json(ApiResponse.success('Account deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
