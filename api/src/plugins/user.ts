import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { users } from "@src/db/schema";

export type User = typeof users.$inferSelect;

async function userPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest("user", undefined);
}

export default fp(userPlugin);
