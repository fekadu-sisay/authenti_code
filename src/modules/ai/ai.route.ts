import { NextFunction, Router } from "express";
import { analyze } from "./ai.service";
import { Request, Response } from "express";

const router = Router();

router.post("/analyze", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, techStacks, jobId } = req.body;

    if (!url || !techStacks || !jobId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    analyze(url, techStacks, jobId)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
});

export default router;
