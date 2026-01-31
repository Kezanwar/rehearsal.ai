import { sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  check,
  unique,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    uuid: uuid("uuid").primaryKey().defaultRandom(),

    // Profile
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    email_confirmed: boolean("email_confirmed").default(false).notNull(),
    avatar: text("avatar"), // URL to profile image

    // Authentication
    auth_method: text("auth_method").notNull(), // email | google | apple
    auth_otp: text("auth_otp"), // temporary OTP for email auth
    password: text("password"), // bcrypt hash, null for OAuth users

    // Billing
    credits_remaining: integer("credits_remaining").default(3).notNull(), // 3 free sessions to start

    // Timestamps
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check("credits_non_negative", sql`${table.credits_remaining} >= 0`),
  ],
);

export const sessions = pgTable("sessions", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),

  // Basic info
  title: text("title"),
  duration: integer("duration"), // seconds

  // Location
  location_name: text("location_name"),

  // Audio storage
  audio_url: text("audio_url"), // S3 URL (nullable after deletion)
  local_uri: text("local_uri"), // Device path

  // Processing status
  status: text("status").default("pending").notNull(), // pending | processing | complete | failed

  // Transcript & analysis
  segments: jsonb("segments"), // music/speech timeline
  transcript: jsonb("transcript"), // timestamped transcript data
  transcript_text: text("transcript_text"), // flat text for search
  summary: text("summary"), // AI summary (Claude?)

  // Sharing
  share_id: text("share_id").unique(), // public URL slug
  share_mode: text("share_mode"), // public | password | email_list
  share_password: text("share_password"), // bcrypt hash
  share_emails: jsonb("share_emails"), // string[]

  // Storage lifecycle (90-day retention)
  expires_at: timestamp("expires_at").notNull(),
  s3_deleted: boolean("s3_deleted").default(false).notNull(),
  expiry_reminder_sent_14d: boolean("expiry_reminder_sent_14d")
    .default(false)
    .notNull(),
  expiry_reminder_sent_7d: boolean("expiry_reminder_sent_7d")
    .default(false)
    .notNull(),
  last_exported_at: timestamp("last_exported_at"),

  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),

  // Transaction details
  platform: text("platform").notNull(), // ios | android
  product_id: text("product_id").notNull(), // App Store / Play Store product ID
  transaction_id: text("transaction_id").unique().notNull(), // store transaction reference

  // Purchase value
  amount: integer("amount").notNull(), // pence
  credits: integer("credits").notNull(), // credits granted

  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const push_tokens = pgTable("push_tokens", {
  token: text("token").primaryKey(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
});

export const band_members = pgTable(
  "band_members",
  {
    uuid: uuid("uuid").primaryKey().defaultRandom(),
    user_uuid: uuid("user_uuid")
      .references(() => users.uuid)
      .notNull(),

    // Contact info
    email: text("email").notNull(),
    name: text("name"), // optional display name

    // Timestamps
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("unique_user_band_member").on(table.user_uuid, table.email),
  ],
);
