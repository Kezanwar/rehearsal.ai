export class AppError extends Error {
  status: number;
  title: string;
  details?: Record<string, unknown>;

  constructor(
    status: number,
    title: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.status = status;
    this.title = title;
    this.details = details;
  }
}

export function throwError(
  status: number,
  title: string,
  message: string,
  details?: Record<string, unknown>,
): never {
  throw new AppError(status, title, message, details);
}

export class Errors {
  static notFound(resource: string): never {
    return throwError(404, "NOT_FOUND", `${resource} not found`);
  }

  static unauthorized(message = "Unauthorized"): never {
    return throwError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Forbidden"): never {
    return throwError(403, "FORBIDDEN", message);
  }

  static badRequest(message: string, details?: Record<string, unknown>): never {
    return throwError(400, "BAD_REQUEST", message, details);
  }

  static internal(message = "Something went wrong"): never {
    return throwError(500, "INTERNAL_ERROR", message);
  }
}
