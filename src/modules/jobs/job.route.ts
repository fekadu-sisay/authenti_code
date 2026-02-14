import { Router } from "express";
import { getJobs, getJob } from "./job.controller";

const router = Router();

router.get("/jobs", getJobs);
router.get("/jobs/:id", getJob);

export default router;
