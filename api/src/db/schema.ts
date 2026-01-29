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
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    uuid: uuid("uuid").primaryKey().defaultRandom(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    email_confirmed: boolean("email_confirmed").default(false).notNull(),
    auth_method: text("auth_method").notNull(), // 'email' | 'google' | 'apple',
    auth_otp: text("auth_otp"),
    avatar: text("avatar"),
    password: text("password"), // null for oauth users
    credits_remaining: integer("credits_remaining").default(3).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Third arg: callback returning array of constraints/indexes
    // 'table' gives you access to the columns for referencing

    check(
      "credits_non_negative", // constraint name (shows in errors)
      sql`${table.credits_remaining} >= 0`, // the actual SQL check
    ),
  ],
);

export const sessions = pgTable("sessions", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  title: text("title"),
  audio_url: text("audio_url"),
  duration: integer("duration"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  location_name: text("location_name"), // "Studio 5, Manchester" - reverse geocoded or user entered
  status: text("status").default("pending").notNull(), // pending | processing | complete | failed
  segments: jsonb("segments"),
  transcript: jsonb("transcript"),
  transcript_text: text("transcript_text"), // flat text version for search
  summary: text("summary"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const purchases = pgTable("purchases", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  platform: text("platform").notNull(), // 'ios' | 'android'
  product_id: text("product_id").notNull(),
  transaction_id: text("transaction_id").unique().notNull(),
  amount: integer("amount").notNull(), // pence
  credits: integer("credits").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const push_tokens = pgTable("push_tokens", {
  token: text("token").primaryKey(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
});

export const band_members = pgTable("band_members", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  user_uuid: uuid("user_uuid")
    .references(() => users.uuid)
    .notNull(),
  email: text("email").notNull(),
  name: text("name"), // optional, for display
  created_at: timestamp("created_at").defaultNow().notNull(),
});
