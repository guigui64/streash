import { configAndScoreSchema, MatchConfig, Score } from "./lib/types";

export async function start(cfg: MatchConfig): Promise<string> {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cfg),
  });
  const { id } = await res.json();
  return id;
}

export async function getConfigAndScore(matchId: string) {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/match/" + matchId,
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  const { config, score } = configAndScoreSchema.parse(data);
  return { config, score } as { config: MatchConfig; score: Score };
}

export async function updateScore(matchId: string, score: Score) {
  fetch(import.meta.env.VITE_SERVER_URL + "/score/" + matchId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(score),
  });
}
