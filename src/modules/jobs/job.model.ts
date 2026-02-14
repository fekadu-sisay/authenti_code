import { Schema, model, Types } from "mongoose";

export interface IJob {
  title: string;
  description?: string;
  stack: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
  },

  stack: {
    type: [String],
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = model<IJob>("Job", JobSchema);

export default Job;
