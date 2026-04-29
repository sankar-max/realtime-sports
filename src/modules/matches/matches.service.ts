import { matchesRepository } from "./matches.repository";

export class MatchesService {
  async listMatches(limit: number) {
    const data = await matchesRepository.listMatches(limit);
    return data;
  }

  async createMatch(matchData: any) {
    const event = await matchesRepository.createMatch(matchData);
    return event;
  }
}

export const matchesService = new MatchesService();
