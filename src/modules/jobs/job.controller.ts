import { JobService } from "./job.service";
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/api/response";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

const jobService = JobService.getInstance();

const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jobService.getJobs();

    return sendResponse(res, StatusCodes.OK, "", jobs);
  } catch (error) {
    next(error);
  }
};

const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.id;

    if (typeof jobId !== "string" || !Types.ObjectId.isValid(jobId)) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid job ID");
    }

    const job = await jobService.getJobById(jobId);

    if (!job) {
      return sendResponse(res, StatusCodes.NOT_FOUND, "Job not found");
    }

    return sendResponse(res, StatusCodes.OK, "", job);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, stack, createdBy } = req.body;
    const job = await jobService.createJob({
      title,
      description,
      stack,
      createdBy,
    });
    return sendResponse(res, 201, "Job created successfully", job);
  } catch (error) {
    next(error);
  }
};

export { getJobs, getJob, createJob };
