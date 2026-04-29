import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiError } from "@/utils/ApiError";

export const validateRequest =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsedData.body !== undefined) req.body = parsedData.body;
      if (parsedData.query !== undefined) req.query = parsedData.query;
      if (parsedData.params !== undefined) req.params = parsedData.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(400, "Validation failed", error.issues));
      }

      next(error);
    }
  };
