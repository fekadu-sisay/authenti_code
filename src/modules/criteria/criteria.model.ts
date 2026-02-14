import { Schema, model, Types } from "mongoose";

export interface ICriteria extends Document {
  jobId: Types.ObjectId;
  commitConsistency: number;
  codeEvolution: number;
  documentation: number;
  styleConsistency: number;
  aiPattern: number;
  createdAt: Date;
}

const CriteriaSchema = new Schema<ICriteria>({
  jobId: {
    type: Types.ObjectId,
    ref: "Job",
    required: true,
  },

  commitConsistency: {
    type: Number,
    default: 1,
  },

  codeEvolution: {
    type: Number,
    default: 1,
  },

  documentation: {
    type: Number,
    default: 1,
  },

  styleConsistency: {
    type: Number,
    default: 1,
  },

  aiPattern: {
    type: Number,
    default: 1,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Criteria = model<ICriteria>("Criteria", CriteriaSchema);

export default Criteria;
