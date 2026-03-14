# Auth API Test Results

**Test Date:** 2026-03-11
**Base URL:** http://localhost:8000

## Passwordless Auth Flow Tests

| Endpoint | Method | Test Case | Request Body | Expected Response | Status |
|----------|--------|-----------|--------------|-------------------|--------|
| `/auth/email` | POST | Existing user | `{"email":"kez@test.com"}` | `{"success":true,"is_new_user":false,"email":"kez@test.com"}` | ✅ PASS |
| `/auth/email` | POST | New user | `{"email":"newuser@test.com"}` | `{"success":true,"is_new_user":true,"email":"newuser@test.com"}` | ✅ PASS |
| `/auth/resend-otp` | POST | Resend OTP | `{"email":"kez@test.com"}` | `{"success":true}` | ✅ PASS |
| `/auth/verify-otp` | POST | Verify OTP (new user) | `{"email":"newuser@test.com","otp":"968417","first_name":"New","last_name":"User"}` | `{"access_token":"eyJ...","user":{...}}` | ✅ PASS |
| `/auth/initialize` | GET | Get authenticated user | Header: `x-auth-token: eyJ...` | `{"user":{"uuid":"...","first_name":"New",...}}` | ✅ PASS |

## Notes

- **OTP Generation:** 6-digit code stored in `users.auth_otp`
- **Token Type:** Long-lived JWT (365 days expiry)
- **Token Payload:** `{"uuid": "user-uuid", "iat": timestamp, "exp": timestamp}`
- **Auth Header:** `x-auth-token: <JWT>`
- **Email Handling:** Emails are lowercased before storage/lookup
- **New User Flow:** First name and last name are optional in `/verify-otp` for new users

## Changes Made

1. Removed short-lived temp tokens - no longer needed for passwordless flow
2. `/auth/email` now returns `success` instead of `temp_token`
3. `/auth/verify-otp` accepts `email` + `otp` instead of `temp_token` + `otp`
4. `/auth/resend-otp` accepts `email` instead of `temp_token`
5. Fixed middleware bug: `decoded.user_uuid` → `decoded.uuid`
6. Removed `Auth.createShortAccessToken()` method (unused)
