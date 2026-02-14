import Job, { IJob } from "./job.model";
import Criteria from "../criteria/criteria.model";
import mongoose, { Types } from "mongoose";

export class JobService {
  private static instance: JobService;

  private constructor() {}

  public static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  async getJobs(): Promise<IJob[]> {
    return Job.find().sort({ createdAt: -1 }).exec();
  }

  async getJobById(jobId: string): Promise<IJob | null> {
    return Job.findById(jobId).exec();
  }

  async createJob(data: {
    title: string;
    description?: string;
    stack: string[];
    createdBy: string;
  }): Promise<IJob> {
    const job = new Job(data);
    return job.save();
  }

  async updateJob(jobId: string, data: Partial<IJob>): Promise<IJob | null> {
    return Job.findByIdAndUpdate(jobId, data, { new: true }).exec();
  }

  async deleteJob(jobId: string): Promise<IJob | null> {
    const objectId = new Types.ObjectId(jobId);
    await Criteria.deleteMany({ jobId: objectId });
    return Job.findByIdAndDelete(jobId).exec();
  }
}
