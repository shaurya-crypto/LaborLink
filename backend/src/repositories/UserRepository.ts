import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findById(id: string | mongoose.Types.ObjectId): Promise<IUser | null> {
    return User.findById(id);
  }

  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  async update(id: string | mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async incrementRefreshTokenVersion(id: string | mongoose.Types.ObjectId): Promise<void> {
    await User.findByIdAndUpdate(id, { $inc: { refreshTokenVersion: 1 } });
  }
}
