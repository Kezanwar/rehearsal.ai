import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import appleSignin from "apple-signin-auth";
import { JWT_SECRET, APPLE_CLIENT_ID } from "@src/env";

export const AUTH_METHODS = {
  EMAIL: "email",
  GOOGLE: "google",
  APPLE: "apple",
} as const;

export class Auth {
  // JWT sign
  static signToken(payload: object, expiresIn: SignOptions["expiresIn"]) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  static createAccessToken(userUuid: string) {
    return this.signToken({ user_uuid: userUuid }, "30d");
  }

  static createLongAccessToken(userUuid: string) {
    return this.signToken({ user_uuid: userUuid }, "365d");
  }

  static createResetToken(email: string) {
    return this.signToken({ email }, "15m");
  }

  // JWT verify
  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { user_uuid: string };
  }

  // Password
  static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  // OTP
  static createOTP() {
    const arr: number[] = [];
    for (let i = 0; i < 6; i++) {
      arr.push(Math.floor(Math.random() * 10));
    }
    return arr.join("");
  }

  // Google OAuth
  static async verifyGoogleToken(token: string) {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
    );
    return {
      email: data.email as string,
      given_name: (data.given_name as string) || "",
      family_name: (data.family_name as string) || "",
      picture: data.picture as string | undefined,
    };
  }

  // Apple OAuth
  static verifyAppleIdToken(token: string) {
    return appleSignin.verifyIdToken(token, {
      audience: APPLE_CLIENT_ID,
      ignoreExpiration: true,
    });
  }

  // Auth method checks
  static isEmailAuth(method: string) {
    return method === AUTH_METHODS.EMAIL;
  }

  static isGoogleAuth(method: string) {
    return method === AUTH_METHODS.GOOGLE;
  }

  static isAppleAuth(method: string) {
    return method === AUTH_METHODS.APPLE;
  }
}
