import Review, { IReview } from "./review.model";
import { Types } from "mongoose";

export class ReviewService {
  private static instance: ReviewService;

  private constructor() {}

  public static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }
    return ReviewService.instance;
  }

  async getReviews(): Promise<IReview[]> {
    return Review.find().sort({ createdAt: -1 }).exec();
  }

  async getReviewsByJobId(jobId: string): Promise<IReview[]> {
    const objectId = new Types.ObjectId(jobId);
    return Review.find({ jobId: objectId }).sort({ createdAt: -1 }).exec();
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    const objectId = new Types.ObjectId(reviewId);
    return Review.findById(objectId).exec();
  }

  async createReview(data: {
    jobId: string;
    candidateId: string;
    repoUrl: string;
    trustScore: number;
    signals: {
      commitConsistency: number;
      codeEvolution: number;
      documentation: number;
      styleConsistency: number;
      aiPattern: number;
    };
  }): Promise<IReview> {
    const review = new Review({
      ...data,
      jobId: new Types.ObjectId(data.jobId),
      createdAt: new Date(),
    });
    return review.save();
  }

  async updateReview(
    reviewId: string,
    data: Partial<IReview>,
  ): Promise<IReview | null> {
    const objectId = new Types.ObjectId(reviewId);
    return Review.findByIdAndUpdate(objectId, data, { new: true }).exec();
  }

  async deleteReview(reviewId: string): Promise<IReview | null> {
    const objectId = new Types.ObjectId(reviewId);
    return Review.findByIdAndDelete(objectId).exec();
  }
}
