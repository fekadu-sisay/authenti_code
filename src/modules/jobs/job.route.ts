import { Router } from "express";
import { getJobs, getJob, createJob } from "./job.controller";

const router = Router();

router.get("/jobs", getJobs);
router.post("/jobs", createJob);
router.get("/jobs/:id", getJob);

export default router;
