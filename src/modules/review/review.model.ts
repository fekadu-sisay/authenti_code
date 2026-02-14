import { Schema, model, Types } from "mongoose";

export interface IReview extends Document {
  jobId: Types.ObjectId;
  candidateId: string;
  repoUrl: string;
  trustScore: number;
  signals: {
    commitConsistency: number;
    codeEvolution: number;
    documentation: number;
    styleConsistency: number;
    aiPattern: number;
    report?: string;
  };
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  jobId: {
    type: Types.ObjectId,
    ref: "Job",
    required: true,
  },

  candidateId: {
    type: String,
    required: true,
  },

  repoUrl: {
    type: String,
    required: true,
  },

  trustScore: {
    type: Number,
    required: true,
  },

  signals: {
    commitConsistency: { type: Number, required: true },
    codeEvolution: { type: Number, required: true },
    documentation: { type: Number, required: true },
    styleConsistency: { type: Number, required: true },
    aiPattern: { type: Number, required: true },
    report: { type: String },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ jobId: 1, repoUrl: 1 }, { unique: true });

const Review = model<IReview>("Review", ReviewSchema);

export default Review;
