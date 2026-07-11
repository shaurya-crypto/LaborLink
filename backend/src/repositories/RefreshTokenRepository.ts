import { RefreshToken, IRefreshToken } from '../models/RefreshToken';
import mongoose from 'mongoose';

export class RefreshTokenRepository {
  async create(data: Partial<IRefreshToken>): Promise<IRefreshToken> {
    const token = new RefreshToken(data);
    return token.save();
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshToken.findOne({ tokenHash, isRevoked: false });
  }

  async revokeToken(id: string | mongoose.Types.ObjectId): Promise<void> {
    await RefreshToken.findByIdAndUpdate(id, { isRevoked: true });
  }

  async revokeAllForUser(userId: string | mongoose.Types.ObjectId): Promise<void> {
    await RefreshToken.updateMany({ user: userId }, { isRevoked: true });
  }
}
