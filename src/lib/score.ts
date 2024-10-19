import { MatchConfig, Point, Score, Set } from "./types";
import { produce } from "immer";

function otherSide(side: Point["serveSide"]) {
  switch (side) {
    case "L":
      return "R";
    case "R":
      return "L";
    case "L?":
      return "R?";
    case "R?":
      return "L?";
  }
}

export function changeServerSide(score: Score) {
  const newScore = produce(score, (draft) => {
    const set = draft.sets[draft.sets.length - 1];
    const point = set.points[set.points.length - 1];
    const newPoint = {
      ...point,
      serveSide: otherSide(point.serveSide).replace("?", "") as "L" | "R",
    } as const;
    set.points.push(newPoint);
  });
  return newScore;
}

export function setPointWon(config: MatchConfig, score: Score, by: string) {
  const idx = config.players.indexOf(by);
  if (idx !== 0 && idx !== 1) {
    throw new Error("Unexpected player: " + by);
  }
  const newScore = produce(score, (draft) => {
    const set = draft.sets[draft.sets.length - 1];
    const prevPoint = set.points[set.points.length - 1];
    const newPoint = {
      ...prevPoint,
      server: idx,
      serveSide:
        idx === prevPoint.server ? otherSide(prevPoint.serveSide) : "R?",
      score: [
        prevPoint.score[0] + (idx === 0 ? 1 : 0),
        prevPoint.score[1] + (idx === 1 ? 1 : 0),
      ] as [number, number],
    } as const;
    set.points.push(newPoint);
    const { won: setIsWon, wonBy: setIsWonBy } = isSetWon(config, set);
    if (setIsWon) {
      set.winner = setIsWonBy;
      const { won: matchIsWon, wonBy: matchIsWonBy } = isMatchWon(
        config,
        draft,
      );
      if (matchIsWon) {
        draft.winner = matchIsWonBy;
      } else {
        draft.sets.push({
          points: [{ score: [0, 0], server: idx, serveSide: "R?" }],
          winner: undefined,
        } as Set);
      }
    }
  });
  return newScore;
}

export function isSetWon(config: MatchConfig, set: Set) {
  if (["oneDifference", "twoDifference"].includes(config.format.finish)) {
    const lastPoint = set.points[set.points.length - 1];
    if (lastPoint.score.some((p) => p >= config.format.pointsPerSet)) {
      if (config.format.finish === "oneDifference") {
        return {
          won: true,
          wonBy: lastPoint.score[0] > lastPoint.score[1] ? 0 : 1,
        } as const;
      } else {
        if (lastPoint.score[0] >= lastPoint.score[1] + 2) {
          return { won: true, wonBy: 0 } as const;
        } else if (lastPoint.score[1] >= lastPoint.score[0] + 2) {
          return { won: true, wonBy: 1 } as const;
        }
      }
    }
  }
  return { won: false };
}

export function matchScoreAsSets(score: Score) {
  return score.sets.reduce(
    (acc, set) => {
      if (set.winner !== undefined) {
        acc[set.winner] += 1;
      }
      return acc;
    },
    [0, 0] as [number, number],
  );
}

export function isMatchWon(config: MatchConfig, score: Score) {
  const matchScore = matchScoreAsSets(score);
  const goal =
    config.format.nbSets === 5 ? 3 : config.format.nbSets === 3 ? 2 : 1;
  if (matchScore[0] >= goal) {
    return { won: true, wonBy: 0 } as const;
  } else if (matchScore[1] >= goal) {
    return { won: true, wonBy: 1 } as const;
  }
  return { won: false } as const;
}
