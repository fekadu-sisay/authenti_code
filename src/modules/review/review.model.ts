import { Schema, model, Types } from "mongoose";

export interface IReview extends Document {
  jobId: Types.ObjectId;
  criteriaId: Types.ObjectId;
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
  warnings: string[];
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  jobId: {
    type: Types.ObjectId,
    ref: "Job",
    required: true,
  },

  criteriaId: {
    type: Types.ObjectId,
    ref: "Criteria",
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
  },

  warnings: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = model<IReview>("Review", ReviewSchema);

export default Review;


