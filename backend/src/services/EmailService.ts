import { env } from '../config/env';
import { logger } from '../config/logger';
import { OtpRepository } from '../repositories/OtpRepository';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const otpRepository = new OtpRepository();

export class EmailService {
  /**
   * Generates a 6 digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generates, hashes, stores, and sends an OTP
   */
  async sendOTP(email: string, type: 'email_verification' | 'password_reset'): Promise<void> {
    const otp = this.generateOTP();

    // Hash OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 10);
    
    // Expires in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await otpRepository.create({
      email,
      otp: hashedOtp,
      type,
      expiresAt
    });

    // Send email via Brevo
    await this.dispatchBrevoEmail(email, otp, type);
  }

  private async dispatchBrevoEmail(email: string, otp: string, type: string): Promise<void> {
    if (env.BREVO_API_KEY.includes('placeholder')) {
      logger.warn('⚠️ BREVO_API_KEY is a placeholder. Email was not actually sent.');
      return;
    }

    const subject = type === 'email_verification' ? 'Verify your LaborLink Email' : 'Reset your LaborLink Password';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>LaborLink</h2>
        <p>Your one-time password is:</p>
        <h1 style="color: #007BFF; letter-spacing: 2px;">${otp}</h1>
        <p>This code will expire in 10 minutes. Do not share it with anyone.</p>
      </div>
    `;

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': env.BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: { name: env.BREVO_SENDER_NAME, email: env.BREVO_SENDER_EMAIL },
          to: [{ email }],
          subject,
          htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error(`❌ Brevo API Error: ${errorData}`);
      } else {
        logger.info(`✅ OTP Email sent successfully to ${email}`);
      }
    } catch (error: any) {
      logger.error(`❌ Failed to send email to ${email}: ${error.message}`);
    }
  }

  async verifyOTP(email: string, otp: string, type: 'email_verification' | 'password_reset'): Promise<boolean> {
    const record = await otpRepository.findByEmailAndType(email, type);
    if (!record) return false;

    if (record.attempts >= 5) {
      await otpRepository.deleteById(record._id as unknown as string);
      return false; // Too many attempts, invalidating OTP
    }

    const isValid = await bcrypt.compare(otp, record.otp);
    
    if (!isValid) {
      await otpRepository.incrementAttempts(record._id as unknown as string);
      return false;
    }

    // OTP is valid, consume it
    await otpRepository.deleteById(record._id as unknown as string);
    return true;
  }
}
