import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import jobRoutes from "./modules/jobs/job.route";
import reviewRoutes from "./modules/review/review.route";
import criteriaRoutes from "./modules/criteria/criteria.route";

const ROUTE_PREFIX = "/api/v1";
const app = express();

// Global middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use(ROUTE_PREFIX, jobRoutes);
app.use(ROUTE_PREFIX, reviewRoutes);
app.use(ROUTE_PREFIX, criteriaRoutes);

// Custom middlewares

app.use(errorMiddleware);

export default app;
