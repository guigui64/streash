import { z } from "zod";

const playerIdx = z.union([z.literal(0), z.literal(1)]);

export const matchConfigSchema = z
  .object({
    players: z.array(z.string()),
    toss: playerIdx,
    umpire: z.string(),
    format: z
      .object({
        nbSets: z.union([z.literal(1), z.literal(3), z.literal(5)]),
        pointsPerSet: z.number(),
        finish: z.union([
          z.literal("twoDifference"),
          z.literal("oneDifference"),
          z.literal("time"),
          z.literal("noEnd"),
        ]),
      })
      .strict(),
  })
  .strict();

export type MatchConfig = z.infer<typeof matchConfigSchema>;

const pointSchema = z
  .object({
    score: z.tuple([z.number(), z.number()]),
    server: playerIdx,
    serveSide: z.union([
      z.literal("L"),
      z.literal("R"),
      z.literal("L?"),
      z.literal("R?"),
    ]),
    extra: z.union([z.literal("let"), z.literal("stroke")]).optional(),
  })
  .strict();
export const setSchema = z
  .object({
    points: z.array(pointSchema),
    winner: playerIdx.optional(),
  })
  .strict();
export const scoreSchema = z
  .object({
    sets: z.array(setSchema),
    winner: playerIdx.optional(),
  })
  .strict();

export type Score = z.infer<typeof scoreSchema>;
export type Set = z.infer<typeof setSchema>;
export type Point = z.infer<typeof pointSchema>;

export const configAndScoreSchema = z
  .object({
    config: matchConfigSchema,
    score: scoreSchema.nullable(),
  })
  .strict();
