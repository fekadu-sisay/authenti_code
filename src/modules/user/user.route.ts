import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import userController from "./user.controller";

const router = Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users fetch successfully",
  });
});

router.post("/repo-stats", userController.getRepoStats);

export default router;
