import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@src/db";
import { users, push_tokens } from "@src/db/schema";
import { Errors } from "@src/errors";
import { authenticate } from "@src/middleware/authenticate";
import UserCache from "@src/cache/user";
import { Auth, AUTH_METHODS } from "@src/services/auth";
import {
  emailAuthSchema,
  verifyOtpSchema,
  googleAuthSchema,
  appleAuthSchema,
  pushTokenSchema,
} from "@src/schemas/auth";
// import { sendOTPEmail } from "@src/services/email";

const capitalise = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function toClientUser(user: typeof users.$inferSelect) {
  const { password, auth_otp, ...safeUser } = user;
  return safeUser;
}

export async function authRoutes(fastify: FastifyInstance) {
  // GET /auth/initialize
  fastify.get(
    "/initialize",
    { preHandler: [authenticate] },
    async (request) => {
      return { user: toClientUser(request.user!) };
    },
  );

  // POST /auth/email
  // Handles both new and existing users
  // Always generates new OTP and sets email_confirmed to false
  fastify.post("/email", async (request) => {
    const body = emailAuthSchema.parse(request.body);

    let user = await db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });

    const otp = Auth.createOTP();
    let isNewUser = false;

    if (user) {
      // Existing user - check they're using email auth
      if (!Auth.isEmailAuth(user.auth_method)) {
        return Errors.badRequest(
          `This email is registered with ${user.auth_method}. Please use "Continue with ${user.auth_method === AUTH_METHODS.GOOGLE ? "Google" : "Apple"}" instead.`,
        );
      }

      // update OTP
      [user] = await db
        .update(users)
        .set({
          auth_otp: otp,
        })
        .where(eq(users.uuid, user.uuid))
        .returning();
    } else {
      // New user - create account
      isNewUser = true;
      [user] = await db
        .insert(users)
        .values({
          first_name: "", // Will be filled in after OTP verification
          last_name: "",
          email: body.email.toLowerCase(),
          auth_method: AUTH_METHODS.EMAIL,
          auth_otp: otp,
        })
        .returning();
    }

    if (!user) {
      return Errors.internal("Failed to process authentication");
    }

    UserCache.set(user);

    console.log("otp: ", otp);

    // Send OTP email
    // await sendOTPEmail(user.email, otp);

    return {
      success: true,
      is_new_user: isNewUser,
      email: user.email,
    };
  });

  // POST /auth/verify-otp
  // Verify OTP and optionally collect name for new users
  fastify.post("/verify-otp", async (request) => {
    const body = verifyOtpSchema.parse(request.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });

    if (!user) {
      return Errors.notFound("User not found");
    }

    if (body.otp !== user.auth_otp) {
      return Errors.badRequest("Incorrect code. Please try again.");
    }

    // Update user with confirmed email and optional name
    const updates: any = {
      email_confirmed: true,
    };

    // If new user and name provided, update it
    if (body.first_name) {
      updates.first_name = capitalise(body.first_name);
    }
    if (body.last_name) {
      updates.last_name = capitalise(body.last_name);
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.uuid, user.uuid))
      .returning();

    if (!updated) {
      return Errors.internal("Failed to verify code");
    }

    UserCache.set(updated);

    // Return long-lived access token
    const accessToken = Auth.createLongAccessToken(updated.uuid);

    return {
      access_token: accessToken,
      user: toClientUser(updated),
    };
  });

  // POST /auth/resend-otp
  // Resend OTP using email
  fastify.post("/resend-otp", async (request) => {
    const { email } = request.body as { email: string };

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return Errors.notFound("User not found");
    }

    const otp = Auth.createOTP();

    const [updated] = await db
      .update(users)
      .set({ auth_otp: otp })
      .where(eq(users.uuid, user.uuid))
      .returning();

    if (!updated) {
      return Errors.internal("Failed to resend code");
    }

    UserCache.set(updated);

    // await sendOTPEmail(user.email, otp);

    return { success: true };
  });

  // POST /auth/google
  fastify.post("/google", async (request) => {
    const body = googleAuthSchema.parse(request.body);

    const googleUser = await Auth.verifyGoogleToken(body.token);

    let user = await db.query.users.findFirst({
      where: eq(users.email, googleUser.email.toLowerCase()),
    });

    if (user) {
      // Existing user - check they're using Google auth
      if (!Auth.isGoogleAuth(user.auth_method)) {
        return Errors.badRequest(
          `This email is registered with ${user.auth_method === AUTH_METHODS.EMAIL ? "Email" : "Apple"}. Please use that sign-in method instead.`,
        );
      }
    } else {
      // New user - create account
      [user] = await db
        .insert(users)
        .values({
          first_name: capitalise(googleUser.given_name),
          last_name: capitalise(googleUser.family_name),
          email: googleUser.email.toLowerCase(),
          avatar: googleUser.picture,
          auth_method: AUTH_METHODS.GOOGLE,
        })
        .returning();
    }

    if (!user) {
      return Errors.internal("Failed to authenticate with Google");
    }

    UserCache.set(user);

    const accessToken = Auth.createLongAccessToken(user.uuid);

    return { access_token: accessToken, user: toClientUser(user) };
  });

  // POST /auth/apple
  fastify.post("/apple", async (request) => {
    const body = appleAuthSchema.parse(request.body);

    const appleUser = await Auth.verifyAppleIdToken(body.identity_token);

    let user = await db.query.users.findFirst({
      where: eq(users.email, appleUser.email.toLowerCase()),
    });

    if (user) {
      // Existing user - check they're using Apple auth
      if (!Auth.isAppleAuth(user.auth_method)) {
        return Errors.badRequest(
          `This email is registered with ${user.auth_method === AUTH_METHODS.EMAIL ? "Email" : "Google"}. Please use that sign-in method instead.`,
        );
      }
    } else {
      // New user - create account
      [user] = await db
        .insert(users)
        .values({
          first_name: body.given_name ? capitalise(body.given_name) : "",
          last_name: body.family_name ? capitalise(body.family_name) : "",
          email: appleUser.email.toLowerCase(),
          auth_method: AUTH_METHODS.APPLE,
        })
        .returning();
    }

    if (!user) {
      return Errors.internal("Failed to authenticate with Apple");
    }

    UserCache.set(user);

    const accessToken = Auth.createLongAccessToken(user.uuid);

    return { access_token: accessToken, user: toClientUser(user) };
  });

  // POST /auth/push-token
  fastify.post(
    "/push-token",
    { preHandler: [authenticate] },
    async (request) => {
      const { token } = pushTokenSchema.parse(request.body);
      const user = request.user!;

      // Clear from other users (token can only belong to one user)
      await db.delete(push_tokens).where(eq(push_tokens.token, token));

      // Add to current user
      await db
        .insert(push_tokens)
        .values({
          token,
          user_uuid: user.uuid,
        })
        .onConflictDoNothing();

      return { success: true };
    },
  );

  // DELETE /auth/push-token
  fastify.delete(
    "/push-token",
    { preHandler: [authenticate] },
    async (request) => {
      const { token } = pushTokenSchema.parse(request.body);

      await db.delete(push_tokens).where(eq(push_tokens.token, token));

      return { success: true };
    },
  );

  // DELETE /auth/delete
  fastify.delete("/delete", { preHandler: [authenticate] }, async (request) => {
    const user = request.user!;

    // Delete associated data
    await db.delete(push_tokens).where(eq(push_tokens.user_uuid, user.uuid));
    // TODO: Delete sessions, purchases, etc.

    await db.delete(users).where(eq(users.uuid, user.uuid));
    UserCache.remove(user.uuid);

    return { success: true };
  });
}
