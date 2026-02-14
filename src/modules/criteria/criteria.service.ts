import Criteria, { ICriteria } from "./criteria.model";
import { Types } from "mongoose";

export class CriteriaService {
  private static instance: CriteriaService;

  private constructor() {}

  public static getInstance(): CriteriaService {
    if (!CriteriaService.instance) {
      CriteriaService.instance = new CriteriaService();
    }
    return CriteriaService.instance;
  }

  async getCriterias(): Promise<ICriteria[]> {
    return Criteria.find().sort({ createdAt: -1 }).exec();
  }

  async getCriteriaById(criteriaId: string): Promise<ICriteria | null> {
    const objectId = new Types.ObjectId(criteriaId);
    return Criteria.findById(objectId).exec();
  }

  async createCriteria(data: {
    jobId: string;
    commitConsistency?: number;
    codeEvolution?: number;
    documentation?: number;
    styleConsistency?: number;
    aiPattern?: number;
  }): Promise<ICriteria> {
    const criteria = new Criteria({
      jobId: new Types.ObjectId(data.jobId),
      commitConsistency: data.commitConsistency ?? 1,
      codeEvolution: data.codeEvolution ?? 1,
      documentation: data.documentation ?? 1,
      styleConsistency: data.styleConsistency ?? 1,
      aiPattern: data.aiPattern ?? 1,
      createdAt: new Date(),
    });
    return criteria.save();
  }

  async updateCriteria(
    criteriaId: string,
    data: Partial<ICriteria>,
  ): Promise<ICriteria | null> {
    const objectId = new Types.ObjectId(criteriaId);
    return Criteria.findByIdAndUpdate(objectId, data, { new: true }).exec();
  }

  async deleteCriteria(criteriaId: string): Promise<ICriteria | null> {
    const objectId = new Types.ObjectId(criteriaId);
    return Criteria.findByIdAndDelete(objectId).exec();
  }
}
