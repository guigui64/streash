import { describe, expect, test } from "vitest";
import { isMatchWon, isSetWon, matchScoreAsSets } from "./score";
import type { Set } from "./types";

function cfg(bo: 1 | 3 | 5 = 5, p: number = 11, diff: 1 | 2 = 2) {
  return {
    players: ["p1", "p2"],
    toss: 0 as const,
    umpire: "u1",
    format: {
      nbSets: bo,
      pointsPerSet: p,
      finish: diff === 1 ? "oneDifference" : "twoDifference",
    } as const,
  };
}

function pts(n1: number, n2: number) {
  return {
    server: 0,
    serveSide: "R?",
    score: [n1, n2] as [number, number],
  } as const;
}

describe("isSetWon", () => {
  test("11 points 2 diff", () => {
    const set = {
      points: [pts(0, 0)],
    };
    const c = cfg();
    expect(isSetWon(c, set)).toEqual({ won: false });
    set.points.push(pts(11, 10));
    expect(isSetWon(c, set)).toEqual({ won: false });
    set.points.push(pts(12, 10));
    expect(isSetWon(c, set)).toEqual({ won: true, wonBy: 0 });
    set.points.push(pts(12, 14));
    expect(isSetWon(c, set)).toEqual({ won: true, wonBy: 1 });
  });

  test("4 points 1 diff", () => {
    const set = {
      points: [pts(0, 0)],
    };
    const c = cfg(3, 4, 1);
    expect(isSetWon(c, set)).toEqual({ won: false });
    set.points.push(pts(1, 3));
    expect(isSetWon(c, set)).toEqual({ won: false });
    set.points.push(pts(4, 3));
    expect(isSetWon(c, set)).toEqual({ won: true, wonBy: 0 });
    set.points.push(pts(3, 4));
    expect(isSetWon(c, set)).toEqual({ won: true, wonBy: 1 });
  });
});

describe("isMatchWon", () => {
  test("bo5", () => {
    const c = cfg(5);

    const sets: Set[] = [{ points: [], winner: 0 }];

    expect(matchScoreAsSets({ sets })).toEqual([1, 0]);
    expect(isMatchWon(c, { sets })).toEqual({ won: false });

    sets.push({ points: [], winner: 1 }); // tie: 1 - 1

    expect(matchScoreAsSets({ sets })).toEqual([1, 1]);
    expect(isMatchWon(c, { sets })).toEqual({ won: false });

    sets.push({ points: [], winner: 0 }); // 2 - 1

    expect(matchScoreAsSets({ sets })).toEqual([2, 1]);
    expect(isMatchWon(c, { sets })).toEqual({ won: false });

    sets.push({ points: [], winner: 0 }); // 3 - 1

    expect(matchScoreAsSets({ sets })).toEqual([3, 1]);
    expect(isMatchWon(c, { sets })).toEqual({ won: true, wonBy: 0 });
  });

  test("bo3", () => {
    const c = cfg(3);

    const sets: Set[] = [{ points: [], winner: 0 }];

    expect(matchScoreAsSets({ sets })).toEqual([1, 0]);
    expect(isMatchWon(c, { sets })).toEqual({ won: false });

    sets.push({ points: [], winner: 1 }); // tie: 1 - 1

    expect(matchScoreAsSets({ sets })).toEqual([1, 1]);
    expect(isMatchWon(c, { sets })).toEqual({ won: false });

    sets.push({ points: [], winner: 1 }); // 1 - 2

    expect(matchScoreAsSets({ sets })).toEqual([1, 2]);
    expect(isMatchWon(c, { sets })).toEqual({ won: true, wonBy: 1 });
  });

  test("bo1", () => {
    const c = cfg(1);

    const sets: Set[] = [{ points: [], winner: 0 }];

    expect(matchScoreAsSets({ sets })).toEqual([1, 0]);
    expect(isMatchWon(c, { sets })).toEqual({ won: true, wonBy: 0 });
  });
});
