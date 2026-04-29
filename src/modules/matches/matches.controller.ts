import { Request, Response } from "express";
import { matchesService } from "./matches.service";
import { ApiResponse } from "@/utils/ApiResponse";

export class MatchesController {
  async listMatches(req: Request, res: Response) {
    const limit = Math.min((req.query.limit as unknown as number) || 10, 100);
    const data = await matchesService.listMatches(limit);

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Matches fetched successfully"));
  }

  async createMatch(req: Request, res: Response) {
    const data = await matchesService.createMatch(req.body);

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated({ type: "match_created", data });
    }

    return res
      .status(201)
      .json(new ApiResponse(201, data, "Match created successfully"));
  }
}

export const matchesController = new MatchesController();
