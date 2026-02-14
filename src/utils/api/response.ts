import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export const sendResponse = (
  res: Response,
  statusCode: number = StatusCodes.OK,
  message: string = "",
  data: any = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
