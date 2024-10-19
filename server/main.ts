import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { scoreSchema, Score, matchConfigSchema } from "./types.ts";

const TTL = 1000 * 60 * 60 * 24 * 7; // 1 week

const kv = await Deno.openKv();

const router = new Router();

const initialScore = (server: number) =>
  ({
    sets: [{ points: [{ score: [0, 0], serveSide: "R?", server }] }],
  }) as Score;

router.post("/start", async (ctx) => {
  const cfg = matchConfigSchema.parse(await ctx.request.body.json());
  let id = randomID();
  let i = 10;
  while (await isUsed(id)) {
    id = randomID();
    if (i-- == 0) {
      ctx.response.status = 500;
      return;
    }
  }
  await Promise.all([
    kv.set(["config", id], cfg, { expireIn: TTL }),
    kv.set(["score", id], initialScore(cfg.toss), { expireIn: TTL }),
  ]);
  ctx.response.body = { id };
});

router.get("/match/:id", async (ctx) => {
  const id = ctx.params.id;
  const [cfgRes, scoreRes] = await Promise.all([
    kv.get(["config", id]),
    kv.get(["score", id]),
  ]);
  if (cfgRes.value === null) {
    ctx.response.status = 404;
    return;
  }
  ctx.response.body = { config: cfgRes.value, score: scoreRes.value };
});

const listeners: Map<string, ((score: Score) => void)[]> = new Map();

router.post("/score/:id", async (ctx) => {
  const id = ctx.params.id;
  const res = scoreSchema.safeParse(await ctx.request.body.json());
  if (!res.success) {
    ctx.response.status = 400;
    ctx.response.body = res.error;
    return;
  }
  const score = res.data;
  await kv.set(["score", id], score, { expireIn: TTL });
  listeners.get(id)?.forEach((listener) => listener(score));
  ctx.response.body = { success: true };
});

router.get("/score/:id", async (ctx) => {
  const id = ctx.params.id;
  const res = await kv.get(["score", id]);
  if (res.value === null) {
    ctx.response.status = 404;
    return;
  }
  ctx.response.body = res.value;
});

router.get("/sse/:id", async (ctx) => {
  const id = ctx.params.id;
  const target = await ctx.sendEvents();
  if (!listeners.has(id)) {
    listeners.set(id, []);
  }
  const targetListeners = listeners.get(id)!;
  const listener = (score: Score) => target.dispatchMessage({ score });
  targetListeners.push(listener);
  target.addEventListener("close", () => {
    targetListeners.splice(targetListeners.indexOf(listener), 1);
  });
});

const app = new Application();
app.use(oakCors({ origin: "*" }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randomID() {
  return Array.from(
    { length: 6 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
}

async function isUsed(id: string) {
  const res = await kv.get(["config", id]);
  return res.value !== null;
}
