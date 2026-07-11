import { User } from '../models/User';
import { logger } from '../config/logger';

class PresenceManager {
  public async setOnline(userId: string) {
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (error) {
      logger.error(`Error setting user online: ${error}`);
    }
  }

  public async setOffline(userId: string) {
    try {
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
    } catch (error) {
      logger.error(`Error setting user offline: ${error}`);
    }
  }
}

export const presenceManager = new PresenceManager();
