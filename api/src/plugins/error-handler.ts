import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@src/errors";

export function errorHandler(
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // Our custom errors
  if (error instanceof AppError) {
    return reply.status(error.status).send({
      type: `https://rehearsal.ai/errors/${error.title.toLowerCase()}`,
      title: error.title,
      status: error.status,
      detail: error.message,
      instance: request.url,
      ...(error.details && { details: error.details }),
    });
  }

  // Zod validation errors
  if (error.name === "ZodError") {
    const messages = (error as any).issues.map((issue: any) => issue.message);
    return reply.status(400).send({
      type: "https://rehearsal.ai/errors/validation",
      title: "VALIDATION_ERROR",
      status: 400,
      detail: "Request validation failed",
      instance: request.url,
      errors: messages,
    });
  }

  // Unknown errors
  return reply.status(500).send({
    type: "https://rehearsal.ai/errors/internal",
    title: "INTERNAL_ERROR",
    status: 500,
    detail: "Something went wrong",
    instance: request.url,
  });
}
