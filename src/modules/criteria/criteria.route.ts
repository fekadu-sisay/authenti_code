import { Router } from "express";
import {
  createCriteria,
  getCriteria,
  getCriterias,
} from "./criteria.controller";

const router = Router();

router.get("/criteria", getCriterias);
router.post("/criteria", createCriteria);
router.get("/criteria/:id", getCriteria);

export default router;
