# HTTP API Testing

Execute HTTP requests from `test.http` files in route folders.

> **🔴 WARNING: NEVER use production tokens. Local/test only.**

## Config

Environment variables: `.claude/commands/http.env.json`

## Authentication

This API uses `x-auth-token` header for authentication:

```
x-auth-token: {{token}}
```

**Important:**

- If running tests for any route other than `auth` and no token is set, run `auth login` first to get a token
- If running `--all` across multiple routes, always run `auth` tests first to obtain a token before other routes

## Test File Location

```
api/src/routes/{route}/test.http
```

## Available Routes

- `auth` - Authentication (register, login, OTP, password reset)
- `session` - Session management

## Usage

```
/http                  # Ask which route, then which request
/http auth             # Ask which request in auth
/http auth login       # Run "Login" request directly
/http auth --all       # Run all auth requests sequentially
/http --all            # Run all tests in all routes (auth first)
```

## Execution Steps

1. Read `.claude/commands/http.env.json` for variables
2. Parse $ARGUMENTS for route name and flags
3. If `--all` with no route:
   - Run `auth` tests first to get token
   - Then run all other `api/src/routes/*/test.http` files
4. If `--all` with route: run all requests in that route's test.http
5. If route + request name: run that specific request (match against `###` lines)
6. If just route: show available requests, ask which to run
7. If no args: show available routes, ask which to test
8. For each request:
   - Parse method, URL, headers, body
   - Replace `{{variables}}` with values from env JSON
   - If `token` is empty and request needs it, run `auth login` first or ask user for token
   - Execute with curl
   - Display response
   - If response contains new token, update `http.env.json` automatically

## Request Matching

Requests are identified by their `###` comment:

```http
### Login
POST {{baseUrl}}/auth/login
```

Match is case-insensitive and partial, so these all work:

```
/http auth login
/http auth Login
/http auth "Login"
```
