import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { initDiscordBot } from "./services/discordService";

const start = async () => {
  await connectDatabase();
  await initDiscordBot();

  app.listen(env.PORT, () => {
    logger.info(`IncuXai backend running on ${env.PORT}`);
  });
};

start().catch((error) => {
  logger.error({ err: error }, "Failed to start server");
  process.exit(1);
});
