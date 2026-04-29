import { MATCH_STATUS } from "@/validation/matches";

export function getMatchStatus(
  startTime: string,
  endTime: string,
  now = new Date(),
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }
  if (now >= start && now <= end) {
    return MATCH_STATUS.LIVE;
  }
  return MATCH_STATUS.FINISHED;
}

export async function syncMatchStats(match: any, updateStatus: any) {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) {
    return match.status;
  }
  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
  }
  return match.status;
}
