import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@src/db";
import { users, push_tokens } from "@src/db/schema";
import { Errors } from "@src/errors";
import { authenticate } from "@src/middleware/authenticate";
import UserCache from "@src/cache/user";
import { Auth, AUTH_METHODS } from "@src/services/auth";
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  appleAuthSchema,
  confirmEmailSchema,
  forgotPasswordSchema,
  changePasswordSchema,
  pushTokenSchema,
} from "@src/schemas/auth";
// import { sendOTPEmail, sendPasswordResetEmail } from "@src/services/email";

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

  // POST /auth/register
  fastify.post("/register", async (request) => {
    const body = registerSchema.parse(request.body);

    const existing = await db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });

    if (existing) {
      return Errors.badRequest("User already exists");
    }

    const hashedPassword = await Auth.hashPassword(body.password);
    const otp = Auth.createOTP();

    const [user] = await db
      .insert(users)
      .values({
        first_name: capitalise(body.first_name),
        last_name: capitalise(body.last_name),
        email: body.email.toLowerCase(),
        password: hashedPassword,
        auth_method: AUTH_METHODS.EMAIL,
        auth_otp: otp,
        email_confirmed: false,
      })
      .returning();

    if (!user) {
      return Errors.internal("Failed to create user");
    }

    UserCache.set(user);

    // await sendOTPEmail(user.email, otp);

    const accessToken = Auth.createLongAccessToken(user.uuid);

    return { access_token: accessToken, user: toClientUser(user) };
  });

  // POST /auth/login
  fastify.post("/login", async (request) => {
    const body = loginSchema.parse(request.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });

    if (!user) {
      return Errors.badRequest("Invalid credentials");
    }

    if (!Auth.isEmailAuth(user.auth_method)) {
      return Errors.badRequest(
        "Please sign in with your original sign in method",
      );
    }

    if (!user.password) {
      return Errors.badRequest("Invalid credentials");
    }

    const validPassword = await Auth.comparePassword(
      body.password,
      user.password,
    );

    if (!validPassword) {
      return Errors.badRequest("Invalid credentials");
    }

    UserCache.set(user);

    const accessToken = Auth.createLongAccessToken(user.uuid);

    return { access_token: accessToken, user: toClientUser(user) };
  });

  // POST /auth/google
  fastify.post("/google", async (request) => {
    const body = googleAuthSchema.parse(request.body);

    const googleUser = await Auth.verifyGoogleToken(body.token);

    let user = await db.query.users.findFirst({
      where: eq(users.email, googleUser.email.toLowerCase()),
    });

    let isNewUser = false;

    if (user) {
      if (!Auth.isGoogleAuth(user.auth_method)) {
        return Errors.badRequest(
          "Please sign in with your original sign in method",
        );
      }
    } else {
      isNewUser = true;
      [user] = await db
        .insert(users)
        .values({
          first_name: capitalise(googleUser.given_name),
          last_name: capitalise(googleUser.family_name),
          email: googleUser.email.toLowerCase(),
          avatar: googleUser.picture,
          auth_method: AUTH_METHODS.GOOGLE,
          email_confirmed: true,
        })
        .returning();
    }

    if (!user) {
      return Errors.internal("Failed to create user");
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

    let isNewUser = false;

    if (user) {
      if (!Auth.isAppleAuth(user.auth_method)) {
        return Errors.badRequest(
          "Please sign in with your original sign in method",
        );
      }
    } else {
      isNewUser = true;
      [user] = await db
        .insert(users)
        .values({
          first_name: body.given_name ? capitalise(body.given_name) : "",
          last_name: body.family_name ? capitalise(body.family_name) : "",
          email: appleUser.email.toLowerCase(),
          auth_method: AUTH_METHODS.APPLE,
          email_confirmed: true,
        })
        .returning();
    }

    if (!user) {
      return Errors.internal("Failed to create user");
    }

    UserCache.set(user);

    const accessToken = Auth.createLongAccessToken(user.uuid);

    return { access_token: accessToken, user: toClientUser(user) };
  });

  // POST /auth/confirm-email
  fastify.post(
    "/confirm-email",
    { preHandler: [authenticate] },
    async (request) => {
      const body = confirmEmailSchema.parse(request.body);
      const user = request.user!;

      if (body.otp !== user.auth_otp) {
        return Errors.badRequest("Incorrect OTP, please try again");
      }

      const [updated] = await db
        .update(users)
        .set({ email_confirmed: true })
        .where(eq(users.uuid, user.uuid))
        .returning();

      if (!updated) {
        return Errors.internal("Failed to confirm email address");
      }

      UserCache.set(updated);

      return { success: true };
    },
  );

  // POST /auth/resend-otp
  fastify.post(
    "/resend-otp",
    { preHandler: [authenticate] },
    async (request) => {
      const user = request.user!;
      const otp = Auth.createOTP();

      const [updated] = await db
        .update(users)
        .set({ auth_otp: otp })
        .where(eq(users.uuid, user.uuid))
        .returning();

      if (!updated) {
        return Errors.internal("Failed to update users OTP");
      }

      UserCache.set(updated);

      // await sendOTPEmail(user.email, otp);

      return { success: true };
    },
  );

  // POST /auth/forgot-password
  fastify.post("/forgot-password", async (request) => {
    const body = forgotPasswordSchema.parse(request.body);

    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email.toLowerCase()),
    });

    if (!user) {
      return Errors.badRequest("No user found with this email");
    }

    if (!Auth.isEmailAuth(user.auth_method)) {
      return Errors.badRequest("This account uses social sign in");
    }

    const token = Auth.createResetToken(user.email);

    // await sendPasswordResetEmail(user.email, token);

    return { success: true };
  });

  // POST /auth/reset-password/:token
  fastify.post("/reset-password/:token", async (request) => {
    const { token } = request.params as { token: string };
    const body = changePasswordSchema.parse(request.body);

    let decoded;
    try {
      decoded = Auth.verifyToken(token) as unknown as { email: string };
    } catch {
      return Errors.badRequest("Token expired");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, decoded.email),
    });

    if (!user) {
      return Errors.badRequest("User not found");
    }

    const hashedPassword = await Auth.hashPassword(body.password);

    const [updated] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.uuid, user.uuid))
      .returning();

    if (!updated) {
      return Errors.internal("Failed to reset password");
    }

    UserCache.set(updated);

    return { success: true };
  });

  // POST /auth/push-token
  fastify.post(
    "/push-token",
    { preHandler: [authenticate] },
    async (request) => {
      const { token } = pushTokenSchema.parse(request.body);
      const user = request.user!;

      // Clear from other users
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

    await db.delete(push_tokens).where(eq(push_tokens.user_uuid, user.uuid));
    await db.delete(users).where(eq(users.uuid, user.uuid));
    UserCache.remove(user.uuid);

    return { success: true };
  });
}
