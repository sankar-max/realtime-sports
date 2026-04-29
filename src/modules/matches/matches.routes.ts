import { Router } from "express";
import { matchesController } from "./matches.controller";
import { validateRequest } from "@/middleware/validate";
import { asyncHandler } from "@/middleware/asyncHandler";
import { listMatchesQuerySchema, createMatchBodySchema } from "@/validation/matches";

export const matchRouter = Router();

matchRouter.get(
  "/",
  validateRequest(listMatchesQuerySchema),
  asyncHandler(matchesController.listMatches)
);

matchRouter.post(
  "/",
  validateRequest(createMatchBodySchema),
  asyncHandler(matchesController.createMatch)
);
