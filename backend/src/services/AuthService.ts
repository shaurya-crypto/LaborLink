import { UserRepository } from '../repositories/UserRepository';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { EmailService } from './EmailService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import mongoose from 'mongoose';

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const emailService = new EmailService();
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export class AuthService {
  private generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
    });
    
    // Generate a random string for refresh token to avoid massive JWT payloads
    const refreshToken = crypto.randomBytes(40).toString('hex');
    
    return { accessToken, refreshToken };
  }

  private async hashAndStoreRefreshToken(userId: mongoose.Types.ObjectId | string, refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    // Calculate expiry (default 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create({
      user: new mongoose.Types.ObjectId(userId.toString()),
      tokenHash,
      expiresAt
    });
  }

  async register(data: any) {
    const { name, email, password, role } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.badRequest('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role,
      provider: 'local',
      isEmailVerified: false
    });

    // Send OTP
    await emailService.sendOTP(email, 'email_verification');

    return { 
      message: 'Registration successful. Please verify your email.',
      userId: user._id
    };
  }

  async verifyEmail(email: string, otp: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw ApiError.notFound('User not found');
    if (user.isEmailVerified) throw ApiError.badRequest('Email already verified');

    const isValid = await emailService.verifyOTP(email, otp, 'email_verification');
    if (!isValid) throw ApiError.badRequest('Invalid or expired OTP');

    user.isEmailVerified = true;
    user.isActive = true;
    await user.save();

    // Issue tokens after verification
    const { accessToken, refreshToken } = this.generateTokens(user._id.toString(), user.role);
    await this.hashAndStoreRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user || user.provider !== 'local' || !user.passwordHash) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.isBlocked) {
      throw ApiError.forbidden('Account is blocked. Please contact support.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      // Re-send OTP
      await emailService.sendOTP(email, 'email_verification');
      throw ApiError.forbidden('Please verify your email first. A new OTP has been sent.');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user._id.toString(), user.role);
    await this.hashAndStoreRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || user.provider !== 'local') {
      // Do not reveal if user exists or not for security
      return { message: 'If that email is registered, we have sent a reset OTP.' };
    }

    await emailService.sendOTP(email, 'password_reset');
    return { message: 'If that email is registered, we have sent a reset OTP.' };
  }

  async verifyResetOtp(email: string, otp: string) {
    const isValid = await emailService.verifyOTP(email, otp, 'password_reset');
    if (!isValid) throw ApiError.badRequest('Invalid or expired OTP');
    
    // Generate a temporary token to allow password reset
    const resetToken = jwt.sign({ email, intent: 'reset' }, env.JWT_SECRET, { expiresIn: '15m' });
    return { resetToken };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    let decoded: any;
    try {
      decoded = jwt.verify(resetToken, env.JWT_SECRET);
    } catch (e) {
      throw ApiError.unauthorized('Invalid or expired reset token');
    }

    if (decoded.intent !== 'reset' || !decoded.email) {
      throw ApiError.badRequest('Invalid token payload');
    }

    const user = await userRepository.findByEmail(decoded.email);
    if (!user) throw ApiError.notFound('User not found');

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    // Invalidate all existing sessions
    user.refreshTokenVersion += 1;
    await user.save();
    await refreshTokenRepository.revokeAllForUser(user._id.toString());

    return { message: 'Password has been reset successfully' };
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    const tokenRecord = await refreshTokenRepository.findByHash(tokenHash);
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository.findById(tokenRecord.user);
    if (!user || user.isBlocked) {
      throw ApiError.unauthorized('User not found or blocked');
    }

    // Issue new tokens (Rotation)
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user._id.toString(), user.role);
    
    // Revoke old token and store new one
    await refreshTokenRepository.revokeToken(tokenRecord._id.toString());
    await this.hashAndStoreRefreshToken(user._id.toString(), newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenRecord = await refreshTokenRepository.findByHash(tokenHash);
    if (tokenRecord) {
      await refreshTokenRepository.revokeToken(tokenRecord._id.toString());
    }
  }

  async logoutAll(userId: string) {
    await refreshTokenRepository.revokeAllForUser(userId);
    const user = await userRepository.findById(userId);
    if (user) {
      user.refreshTokenVersion += 1;
      await user.save();
    }
  }

  async googleLogin(idToken: string, role?: string) {
    if (env.GOOGLE_CLIENT_ID.includes('placeholder')) {
      throw ApiError.internal('Google OAuth is not configured on the server');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw ApiError.badRequest('Invalid Google Token');
    }

    let user = await userRepository.findByEmail(payload.email);
    
    if (!user) {
      if (!role) {
        throw ApiError.badRequest('Role is required for new Google signups');
      }
      // Create new user
      user = await userRepository.create({
        name: payload.name || 'Google User',
        email: payload.email,
        role: role as 'worker' | 'employer',
        provider: 'google',
        isEmailVerified: true,
        profilePhoto: payload.picture
      });
    } else {
      // If user exists but was local, we can link them or just login (since emails match and google verified it)
      if (user.provider === 'local') {
        user.isEmailVerified = true; // Google inherently verifies email
        await user.save();
      }
    }

    user.lastLoginAt = new Date();
    await user.save();

    const { accessToken, refreshToken } = this.generateTokens(user._id.toString(), user.role);
    await this.hashAndStoreRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  }
}
