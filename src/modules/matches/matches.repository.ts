import { db } from "@/db";
import { matches } from "@/db/schema";
import { asc } from "drizzle-orm";

export class MatchesRepository {
  async listMatches(limit: number) {
    return await db
      .select()
      .from(matches)
      .orderBy(asc(matches.createdAt))
      .limit(limit);
  }

  async createMatch(matchData: any) {
    const [event] = await db.insert(matches).values(matchData).returning();
    return event;
  }
}

export const matchesRepository = new MatchesRepository();
