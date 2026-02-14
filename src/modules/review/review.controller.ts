import { Request, Response, NextFunction } from "express";
import { ReviewService } from "./review.service";

const reviewService = ReviewService.getInstance();

export const getReviewsByJobId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobId } = req.params;
    const resolvedJobId = Array.isArray(jobId) ? jobId[0] : jobId;
    const reviews = await reviewService.getReviewsByJobId(resolvedJobId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const reviewId = Array.isArray(id) ? id[0] : id;
    const review = await reviewService.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      jobId,
      criteriaId,
      candidateId,
      repoUrl,
      trustScore,
      signals,
      warnings = [],
    } = req.body;

    if (!jobId || !criteriaId || !candidateId || !repoUrl || !trustScore || !signals) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const review = await reviewService.createReview({
      jobId,
      criteriaId,
      candidateId,
      repoUrl,
      trustScore,
      signals,
      warnings,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
