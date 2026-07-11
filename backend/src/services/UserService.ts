import { UserRepository } from '../repositories/UserRepository';
import { WorkerProfileRepository } from '../repositories/WorkerProfileRepository';
import { EmployerProfileRepository } from '../repositories/EmployerProfileRepository';
import { ApiError } from '../utils/ApiError';

const userRepository = new UserRepository();
const workerRepository = new WorkerProfileRepository();
const employerRepository = new EmployerProfileRepository();

export class UserService {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    let profile = null;
    if (user.role === 'worker') {
      profile = await workerRepository.findByUserId(userId);
    } else if (user.role === 'employer') {
      profile = await employerRepository.findByUserId(userId);
    }

    return { user, profile };
  }

  async updateProfile(userId: string, role: string, data: any) {
    if (role === 'worker') {
      const profile = await workerRepository.upsert(userId, data);
      return profile;
    } else if (role === 'employer') {
      const profile = await employerRepository.upsert(userId, data);
      return profile;
    }
    throw ApiError.badRequest('Invalid role');
  }

  async completeOnboarding(userId: string) {
    const user = await userRepository.update(userId, { isProfileCompleted: true });
    return user;
  }

  async uploadProfilePhoto(userId: string, photoUrl: string) {
    // In future phases, actual S3/Cloudinary upload logic would happen here or in a media service
    const user = await userRepository.update(userId, { profilePhoto: photoUrl });
    return user;
  }

  async softDelete(userId: string) {
    await userRepository.update(userId, { 
      isActive: false, 
      isBlocked: true, // Prevent them from logging back in
      name: 'Deleted User',
      email: `deleted_${userId}@laborlink.local`,
      phone: undefined
    });
  }
}
