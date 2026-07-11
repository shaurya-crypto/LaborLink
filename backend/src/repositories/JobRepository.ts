import { Job, IJob, JobStatus } from '../models/Job';
import mongoose, { ClientSession } from 'mongoose';

export interface JobSearchParams {
  category?: string;
  city?: string;
  minSalary?: number;
  employmentType?: string;
  isUrgent?: boolean;
  query?: string; // Full-text search
  coordinates?: [number, number]; // [lng, lat] for GeoNear
  maxDistanceKm?: number;
  page?: number;
  limit?: number;
  cursor?: string; // Cursor pagination
}

export class JobRepository {
  async create(jobData: Partial<IJob>, session?: ClientSession): Promise<IJob> {
    const job = new Job(jobData);
    return job.save({ session });
  }

  async findById(id: string | mongoose.Types.ObjectId, session?: ClientSession): Promise<IJob | null> {
    return Job.findById(id).session(session || null);
  }

  async update(id: string | mongoose.Types.ObjectId, updateData: Partial<IJob>, session?: ClientSession): Promise<IJob | null> {
    return Job.findByIdAndUpdate(id, updateData, { new: true, session: session || null });
  }

  async softDelete(id: string | mongoose.Types.ObjectId, session?: ClientSession): Promise<IJob | null> {
    return Job.findByIdAndUpdate(id, { status: 'Deleted' }, { new: true, session: session || null });
  }

  async findByEmployer(employerId: string | mongoose.Types.ObjectId): Promise<IJob[]> {
    return Job.find({ employerId, status: { $ne: 'Deleted' } }).sort({ createdAt: -1 });
  }

  async search(params: JobSearchParams): Promise<{ jobs: IJob[], nextCursor?: string, totalPages?: number }> {
    const { category, city, minSalary, employmentType, isUrgent, query, coordinates, maxDistanceKm, page = 1, limit = 10, cursor } = params;
    
    let pipeline: any[] = [];

    // GeoNear must be the first stage if coordinates are provided
    if (coordinates && coordinates.length === 2) {
      pipeline.push({
        $geoNear: {
          near: { type: 'Point', coordinates },
          distanceField: 'distance',
          maxDistance: (maxDistanceKm || 50) * 1000, // Convert to meters
          spherical: true,
          query: { status: 'Active' }
        }
      });
    } else {
      pipeline.push({ $match: { status: 'Active' } });
    }

    const matchStage: any = {};

    if (query) {
      matchStage.$text = { $search: query };
    }
    if (category) matchStage.category = category;
    if (city) matchStage.city = city;
    if (minSalary) matchStage.maxSalary = { $gte: minSalary }; // If maxSalary is at least minSalary
    if (employmentType) matchStage.employmentType = employmentType;
    if (isUrgent) matchStage.urgentHiring = isUrgent;

    // Apply match stage
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Sort
    if (query && !coordinates) {
      pipeline.push({ $sort: { score: { $meta: 'textScore' } } });
    } else if (!coordinates) {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    // Pagination
    if (cursor) {
      // Decode cursor and apply it if cursor based pagination is used
      // Simplistic approach for now: skip/limit based on page
    }
    
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const jobs = await Job.aggregate(pipeline);
    
    // For pagination metadata, you would typically run a count query parallel to this.
    // Simplifying here.
    return { jobs };
  }

  async incrementAnalytics(id: string | mongoose.Types.ObjectId, field: 'views' | 'uniqueViews' | 'saves' | 'applications' | 'hires', session?: ClientSession): Promise<void> {
    await Job.findByIdAndUpdate(id, { $inc: { [field]: 1 } }, { session: session || null });
  }
}
