import { ApiError } from "../utils/api/ApiError";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import env from "../config/env";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.code == 11000) {
    statusCode = StatusCodes.BAD_REQUEST;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  } else if (err.name == "ValidationError") {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(",");
  }

  res.status(statusCode).json({
    success: false,
    message,
    // error: env.NODE_ENV == "development" ? err.stack : undefined,
  });
};
