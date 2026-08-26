import { createServerFn } from "@tanstack/react-start";

export type GfgStats = {
  totalSolved: number | null;
  codingScore?: number | null;
  instituteRank?: number | null;
  currentStreak?: number | null;
  maxStreak?: number | null;
  monthlyScore?: number | null;
  easy?: number | null;
  medium?: number | null;
  hard?: number | null;
};

let serverCache: { timestamp: number; data: GfgStats } | null = null;
const SERVER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const fetchGfgStatsServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<GfgStats> => {
    if (serverCache && Date.now() - serverCache.timestamp < SERVER_CACHE_TTL) {
      console.log("[GFG API Server Cache Hit]");
      return serverCache.data;
    }

    console.log("[GFG API Server Fetch Started]");
    const GFG_USER = "immpappu";

    const endpoints = [
      `https://gfg-stats-api.vercel.app/${GFG_USER}`,
      `https://geeks-for-geeks-api.vercel.app/${GFG_USER}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        });
        if (!res.ok) continue;
        const raw = await res.json();
        if (raw?.error) continue;

        const totalSolved = raw.totalProblemsSolved ?? raw.totalSolved ?? raw.data?.totalSolved ?? raw.problemsSolved;
        if (totalSolved != null) {
          const stats: GfgStats = {
            totalSolved: Number(totalSolved),
            easy: raw.easySolved ?? raw.easy ?? null,
            medium: raw.mediumSolved ?? raw.medium ?? null,
            hard: raw.hardSolved ?? raw.hard ?? null,
            codingScore: raw.overallCodingScore ?? raw.codingScore ?? null,
            monthlyScore: raw.monthlyScore ?? null,
            instituteRank: raw.instituteRank ?? null,
            currentStreak: raw.currentStreak ?? raw.totalActiveDays ?? null,
            maxStreak: raw.maxStreak ?? null,
          };

          console.log("[GFG Server Fetch Success] Total Solved:", stats.totalSolved);
          serverCache = { timestamp: Date.now(), data: stats };
          return stats;
        }
      } catch (err) {
        console.warn(`[GFG API Error: ${url}]`, err);
      }
    }

    // Fallback cache or default baseline if external scraper fails
    if (serverCache) return serverCache.data;

    return {
      totalSolved: 115,
      easy: 60,
      medium: 45,
      hard: 10,
      codingScore: 320,
      currentStreak: 45,
      instituteRank: null,
      maxStreak: null,
      monthlyScore: null,
    };
  },
);
