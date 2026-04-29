import z from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

export const listMatchesQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
    //   offset: z.coerce.number().int().positive().default(0),
    //   status: z.enum([
    //     MATCH_STATUS.SCHEDULED,
    //     MATCH_STATUS.LIVE,
    //     MATCH_STATUS.FINISHED,
    //   ]),
  })
});

export const matchIdParamsSchema = z.object({
  params: z.object({
    matchId: z.string().uuid(),
  })
});

export const createMatchBodySchema = z.object({
  body: z.object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  }).superRefine((data, ctx) => {
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be after start time",
        path: ["endTime"],
      });
    }
  })
});

export const updateScoreSchema = z.object({
  body: z.object({
    homeScore: z.coerce.number().int().nonnegative(),
    awayScore: z.coerce.number().int().nonnegative(),
  })
});
