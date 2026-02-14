import { Router } from "express";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users fetch successfully",
  });
});

export default router;
