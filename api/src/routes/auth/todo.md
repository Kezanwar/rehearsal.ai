# Auth TODO

## High Priority

- [ ] **Implement email service** - OTP emails are currently commented out
  - Uncomment `sendOTPEmail()` calls in `/email` endpoint (line 87)
  - Uncomment `sendOTPEmail()` calls in `/resend-otp` endpoint (line 193)
  - Set up email provider (SendGrid, AWS SES, Resend, etc.)
  - Create OTP email template

## Security & Validation

- [ ] **Rate limiting** - Prevent abuse of OTP endpoints
  - Limit `/email` requests per IP/email (e.g., 3 requests per 15 minutes)
  - Limit `/verify-otp` attempts (e.g., 5 failed attempts = lockout)
  - Limit `/resend-otp` requests (e.g., 3 requests per hour)

- [ ] **OTP expiration** - Currently OTPs never expire
  - Add `auth_otp_expires_at` timestamp to users table
  - Set expiration to 10-15 minutes
  - Validate expiration in `/verify-otp`

- [ ] **Invalidate OTP after successful verification**
  - Clear `auth_otp` field after successful `/verify-otp`
  - Prevents OTP reuse

## Nice to Have

- [ ] **Validation schema for `/resend-otp`** - Currently uses inline type assertion
  - Import and use `resendOtpSchema` in the endpoint (line 150)

- [ ] **Session management** - Track active sessions
  - Store refresh tokens in database
  - Add `/auth/refresh` endpoint
  - Add `/auth/logout` endpoint (invalidate session)

- [ ] **Email verification reminder**
  - Send reminder if user doesn't verify within X minutes
  - Automatic cleanup of unverified users after X days

- [ ] **OAuth error handling improvements**
  - Better error messages for Google/Apple auth failures
  - Handle network timeouts gracefully

## Testing

- [ ] **Unit tests** - Test auth service methods
- [ ] **Integration tests** - Test full auth flows
- [ ] **E2E tests** - Test from frontend perspective
