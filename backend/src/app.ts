import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { env } from "./config/env";
import { httpLogger } from "./config/logger";
import { apiRateLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/error";
import { csrfProtection } from "./middleware/csrf";
import { router } from "./routes";

const swaggerDoc = YAML.load(path.join(process.cwd(), "src", "docs", "openapi.yaml"));

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.WEB_BASE_URL],
    credentials: true
  })
);
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(httpLogger);
app.use(apiRateLimiter);
app.use(csrfProtection);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use("/api", router);

app.use(errorHandler);
