import { Router } from "express";
import {
  getReviewById,
  getReviewsByJobId,
  createReview,
} from "./review.controller";

const router = Router();

router.get("/reviews/job/:jobId", getReviewsByJobId);
router.get("/reviews/:id", getReviewById);
router.post("/reviews", createReview);

export default router;
