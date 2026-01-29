export const PORT = Number(process.env.PORT);

const ENVIRONMENT = process.env.NODE_ENV;

export const isDev = ENVIRONMENT === "development";

export const DATABASE_URL = process.env.DATABASE_URL!;

export const JWT_SECRET = process.env.JWT_SECRET!;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;

export const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID!;
