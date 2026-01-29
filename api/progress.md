# Rehearsal.AI API Progress

## Done ✅

- Fastify setup with pino-pretty logging
- Drizzle + Postgres (5 tables migrated)
- Error handling (RFC 7807 Problem Details)
- Auth routes (register, login, Google, Apple, OTP, reset password, push tokens)
- Auth service + UserCache
- test.http for manual testing

## Still to do

- [ ] Session routes (CRUD, upload, status)
- [ ] Purchase webhook (RevenueCat)
- [ ] Email service (OTP, password reset)
- [ ] S3 upload (presigned URLs)
- [ ] Worker/queue setup (BullMQ)
- [ ] Go segmentation service integration

## Tables

- `users` - auth, credits
- `sessions` - recordings, transcripts, summaries
- `purchases` - RevenueCat transactions
- `push_tokens` - Expo push tokens
- `band_members` - share list contacts

## Key Files

- `api.ts` - entry point
- `src/routes/auth/index.ts` - auth routes
- `src/services/auth.ts` - JWT, hashing, OAuth
- `src/cache/user.ts` - UserCache
- `src/errors/index.ts` - AppError + Errors class
- `src/middleware/authenticate.ts` - auth middleware
- `src/db/schema.ts` - Drizzle schema
- `src/schemas/auth.ts` - Zod validation
