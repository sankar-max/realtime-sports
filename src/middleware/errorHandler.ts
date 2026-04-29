import { Request, Response, NextFunction } from "express";
import { ApiError } from "@/utils/ApiError";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let apiError: ApiError;

  if (err instanceof ApiError) {
    apiError = err;
  } else {
    const statusCode = (err as any)?.statusCode || 500;
    const message = (err as any)?.message || "Internal Server Error";

    apiError = new ApiError(
      statusCode,
      message,
      (err as any)?.errors,
      (err as Error)?.stack,
    );
  }

  const response = {
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    ...(apiError.errors && { errors: apiError.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: apiError.stack }),
  };

  return res.status(apiError.statusCode).json(response);
};
