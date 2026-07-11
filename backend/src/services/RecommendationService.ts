import { IJob } from '../models/Job';
import { IUser } from '../models/User';

export class RecommendationService {
  /**
   * Version 1: Calculate match score based on various factors.
   * Future: Can be replaced with an AI/ML model endpoint without breaking the interface.
   */
  async calculateMatchScore(job: IJob, worker: IUser, context?: any): Promise<{ score: number, reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];

    // Mock worker profile data for now since WorkerProfile model is separate.
    // Assuming context provides worker skills, preferred salary, languages etc.
    const workerSkills = context?.skills || [];
    const workerLanguages = context?.languages || ['English'];
    const preferredSalary = context?.preferredSalary || 0;
    const distanceKm = context?.distanceKm;

    // 1. Skills Match (Up to 40 points)
    if (job.requiredSkills && job.requiredSkills.length > 0) {
      const matchCount = job.requiredSkills.filter(skill => workerSkills.includes(skill)).length;
      const skillScore = (matchCount / job.requiredSkills.length) * 40;
      score += skillScore;
      if (skillScore > 20) reasons.push('Matches your skills');
    } else {
      score += 20; // Default if no specific skills required
    }

    // 2. Location & Distance (Up to 20 points)
    if (distanceKm !== undefined && distanceKm < 10) {
      score += 20;
      reasons.push('Near you');
    } else if (job.city === context?.city) {
      score += 15;
      reasons.push('In your city');
    }

    // 3. Salary (Up to 15 points)
    if (preferredSalary > 0 && job.maxSalary >= preferredSalary) {
      score += 15;
      reasons.push('Meets salary expectations');
    }

    // 4. Languages (Up to 10 points)
    if (job.languages && job.languages.length > 0) {
      const langMatch = job.languages.some(l => workerLanguages.includes(l));
      if (langMatch) {
        score += 10;
      }
    }

    // 5. Metadata Boosts (Up to 15 points)
    if (job.verifiedEmployer) {
      score += 10;
      reasons.push('Verified Employer');
    }
    if (job.urgentHiring) {
      score += 5;
      reasons.push('Hiring Urgently');
    }

    // Cap at 100
    score = Math.min(Math.round(score), 100);

    return { score, reasons };
  }
}
