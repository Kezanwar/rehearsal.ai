import { users } from "@src/db/schema";
import { User } from "@src/plugins/user";

declare module "fastify" {
  interface FastifyRequest {
    user?: User;
  }
}
