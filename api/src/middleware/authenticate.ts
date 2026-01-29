import { FastifyRequest, FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@src/db";
import { users } from "@src/db/schema";
import { Auth } from "@src/services/auth";
import UserCache from "@src/cache/user";
import { Errors } from "@src/errors";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers["x-auth-token"] as string | undefined;

  if (!token) {
    return Errors.unauthorized("No token provided");
  }

  try {
    const decoded = Auth.verifyToken(token);

    let user = UserCache.get(decoded.user_uuid);

    if (!user) {
      user =
        (await db.query.users.findFirst({
          where: eq(users.uuid, decoded.user_uuid),
        })) ?? undefined;

      if (!user) {
        return Errors.unauthorized("User not found");
      }

      UserCache.set(user);
    }

    request.user = user;
  } catch {
    return Errors.unauthorized("Invalid token");
  }
}
