import pino from "pino";
import pinoHttp from "pino-http";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug"
});

export const httpLogger = pinoHttp({
  logger: logger as any,
  redact: ["req.headers.authorization", "req.headers.cookie"]
});
