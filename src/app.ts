import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";

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

// Custom middlewares

app.use(errorMiddleware);

export default app;
