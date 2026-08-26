import { createServerFn } from "@tanstack/react-start";

export type LcStats = {
  status: "success" | "fallback";
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
};

let serverCache: { timestamp: number; data: LcStats } | null = null;
const SERVER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export const fetchLeetCodeStatsServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<LcStats> => {
    // Return server memory cache if fresh
    if (serverCache && Date.now() - serverCache.timestamp < SERVER_CACHE_TTL) {
      console.log("[LeetCode API Server Cache Hit]");
      return serverCache.data;
    }

    console.log("[LeetCode API Server Fetch Started]");
    const LEETCODE_USER = "immpappu";

    // Method 1: Official LeetCode GraphQL API
    try {
      const query = `
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            submissionCalendar
            profile {
              ranking
              reputation
            }
          }
          allQuestionsCount {
            difficulty
            count
          }
        }
      `;

      const res = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://leetcode.com",
        },
        body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
      });

      if (res.ok) {
        const json = await res.json();
        const matched = json?.data?.matchedUser;
        const allQuestions = json?.data?.allQuestionsCount ?? [];

        if (matched) {
          const acSubmissions = matched.submitStatsGlobal?.acSubmissionNum ?? [];
          const getCount = (diff: string) =>
            acSubmissions.find((item: { difficulty: string; count: number }) => item.difficulty === diff)?.count ?? 0;
          const getTotal = (diff: string) =>
            allQuestions.find((item: { difficulty: string; count: number }) => item.difficulty === diff)?.count ?? 0;

          let calendarObj: Record<string, number> = {};
          if (matched.submissionCalendar) {
            try {
              calendarObj = typeof matched.submissionCalendar === "string"
                ? JSON.parse(matched.submissionCalendar)
                : matched.submissionCalendar;
            } catch {
              calendarObj = {};
            }
          }

          const stats: LcStats = {
            status: "success",
            totalSolved: getCount("All"),
            totalQuestions: getTotal("All"),
            easySolved: getCount("Easy"),
            totalEasy: getTotal("Easy"),
            mediumSolved: getCount("Medium"),
            totalMedium: getTotal("Medium"),
            hardSolved: getCount("Hard"),
            totalHard: getTotal("Hard"),
            acceptanceRate: 0,
            ranking: matched.profile?.ranking ?? 0,
            contributionPoints: 0,
            reputation: matched.profile?.reputation ?? 0,
            submissionCalendar: calendarObj,
          };

          console.log("[LeetCode Server Fetch Success] Total Solved:", stats.totalSolved);
          serverCache = { timestamp: Date.now(), data: stats };
          return stats;
        }
      }
    } catch (err) {
      console.warn("[LeetCode GraphQL Fetch Error]", err);
    }

    // Method 2: Backup REST APIs (alfa-leetcode-api / faisalshohag)
    const backupEndpoints = [
      `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`,
      `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`,
    ];

    for (const url of backupEndpoints) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const raw = await res.json();
        if (raw?.errors || raw?.error) continue;

        const totalSolved = raw.totalSolved ?? raw.solvedProblem ?? 0;
        if (!totalSolved && !raw.easySolved) continue;

        const stats: LcStats = {
          status: "success",
          totalSolved,
          totalQuestions: raw.totalQuestions ?? 0,
          easySolved: raw.easySolved ?? 0,
          totalEasy: raw.totalEasy ?? 0,
          mediumSolved: raw.mediumSolved ?? 0,
          totalMedium: raw.totalMedium ?? 0,
          hardSolved: raw.hardSolved ?? 0,
          totalHard: raw.totalHard ?? 0,
          acceptanceRate: 0,
          ranking: raw.ranking ?? 0,
          contributionPoints: raw.contributionPoint ?? raw.contributionPoints ?? 0,
          reputation: raw.reputation ?? 0,
          submissionCalendar: raw.submissionCalendar ?? {},
        };

        console.log("[LeetCode Server Backup Fetch Success] Total Solved:", stats.totalSolved);
        serverCache = { timestamp: Date.now(), data: stats };
        return stats;
      } catch (e) {
        console.warn(`[LeetCode Backup API Error: ${url}]`, e);
      }
    }

    // Fallback if all external requests fail
    if (serverCache) return serverCache.data;

    return {
      status: "fallback",
      totalSolved: 113,
      totalQuestions: 3400,
      easySolved: 58,
      totalEasy: 850,
      mediumSolved: 44,
      totalMedium: 1750,
      hardSolved: 11,
      totalHard: 800,
      acceptanceRate: 65,
      ranking: 0,
      contributionPoints: 0,
      reputation: 0,
      submissionCalendar: {},
    };
  },
);
