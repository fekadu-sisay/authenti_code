import { Request, Response, NextFunction } from "express";
import { CriteriaService } from "./criteria.service";

const criteriaService = CriteriaService.getInstance();

export const getCriterias = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const criterias = await criteriaService.getCriterias();
    return res.status(200).json({ success: true, data: criterias });
  } catch (error) {
    next(error);
  }
};

export const getCriteria = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid criteria id" });
    }
    const criteria = await criteriaService.getCriteriaById(id);

    if (!criteria) {
      return res
        .status(404)
        .json({ success: false, message: "Criteria not found" });
    }

    return res.status(200).json({ success: true, data: criteria });
  } catch (error) {
    next(error);
  }
};

export const createCriteria = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      jobId,
      commitConsistency,
      codeEvolution,
      documentation,
      styleConsistency,
      aiPattern,
    } = req.body;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "jobId is required" });
    }

    const criteria = await criteriaService.createCriteria({
      jobId,
      commitConsistency,
      codeEvolution,
      documentation,
      styleConsistency,
      aiPattern,
    });

    return res
      .status(201)
      .json({ success: true, message: "Criteria created", data: criteria });
  } catch (error) {
    next(error);
  }
};

export const updateCriteria = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid criteria id" });
    }

    const updatedCriteria = await criteriaService.updateCriteria(
      id,
      updateData,
    );

    if (!updatedCriteria) {
      return res
        .status(404)
        .json({ success: false, message: "Criteria not found" });
    }

    return res.status(200).json({ success: true, data: updatedCriteria });
  } catch (error) {
    next(error);
  }
};

export const deleteCriteria = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid criteria id" });
    }

    const deletedCriteria = await criteriaService.deleteCriteria(id);

    if (!deletedCriteria) {
      return res
        .status(404)
        .json({ success: false, message: "Criteria not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Criteria deleted successfully" });
  } catch (error) {
    next(error);
  }
};
