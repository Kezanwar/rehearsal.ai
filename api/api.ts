import Fastify from "fastify";
import { isDev, PORT } from "@src/env";

import { checkDbConnection } from "@src/db";
import { Errors } from "@src/errors";

import { devLogger, prodLogger } from "@src/plugins/logger";
import { errorHandler } from "@src/plugins/error-handler";
import userPlugin from "@src/plugins/user";

import { authRoutes } from "@src/routes/auth";

const fastify = Fastify({
  logger: isDev ? devLogger : prodLogger,
});

fastify.register(userPlugin);
fastify.setErrorHandler(errorHandler);

fastify.register(authRoutes, { prefix: "/auth" });

fastify.get("/", async function handler(request, reply) {
  return { message: "Rehearsal.AI API Up and Running!" };
});

fastify.get("/error-test", async function handler(request, reply) {
  return Errors.notFound("Test resource");
});

try {
  await checkDbConnection();
  fastify.log.info("Database connected");
  await fastify.listen({ port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
