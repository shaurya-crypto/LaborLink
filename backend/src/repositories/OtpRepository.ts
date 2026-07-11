import { Otp, IOtp } from '../models/Otp';

export class OtpRepository {
  async create(otpData: Partial<IOtp>): Promise<IOtp> {
    // Delete any existing OTP for this email and type to prevent duplicates
    await this.deleteByEmailAndType(otpData.email!, otpData.type!);
    
    const otp = new Otp(otpData);
    return otp.save();
  }

  async findByEmailAndType(email: string, type: string): Promise<IOtp | null> {
    return Otp.findOne({ email, type } as any).exec();
  }

  async incrementAttempts(id: string): Promise<void> {
    await Otp.findByIdAndUpdate(id, { $inc: { attempts: 1 } });
  }

  async deleteById(id: string): Promise<void> {
    await Otp.findByIdAndDelete(id);
  }

  async deleteByEmailAndType(email: string, type: string): Promise<void> {
    await Otp.deleteMany({ email, type } as any).exec();
  }
}
