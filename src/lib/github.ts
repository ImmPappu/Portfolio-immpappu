import { createServerFn } from "@tanstack/react-start";

export type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
};

export type GhRepo = {
  name: string;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
};

export type ContribDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubStatsData = {
  user: GhUser | null;
  repos: GhRepo[] | null;
  contrib: ContribDay[];
};

// In-memory server cache (15 min TTL)
let serverCache: { timestamp: number; data: GitHubStatsData } | null = null;
const SERVER_CACHE_TTL = 15 * 60 * 1000;

export const fetchGitHubStatsServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<GitHubStatsData> => {
    // 1. Return server memory cache if fresh
    if (serverCache && Date.now() - serverCache.timestamp < SERVER_CACHE_TTL) {
      console.log("[GitHub API Server Cache Hit]");
      return serverCache.data;
    }

    console.log("[GitHub API Server Fetch Started]");
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      "User-Agent": "ImmPappu-Portfolio-App",
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `token ${token}`;
      console.log("[GitHub API Server] Authenticated request with GITHUB_TOKEN");
    } else {
      console.log("[GitHub API Server] Unauthenticated request (no GITHUB_TOKEN set)");
    }

    const GITHUB_USER = "ImmPappu";

    try {
      const results = await Promise.allSettled([
        fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers }),
        fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
          headers,
        }),
        fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`),
      ]);

      const uRes = results[0].status === "fulfilled" ? results[0].value : null;
      const rRes = results[1].status === "fulfilled" ? results[1].value : null;
      const cRes = results[2].status === "fulfilled" ? results[2].value : null;

      let user: GhUser | null = null;
      let repos: GhRepo[] | null = null;
      let contrib: ContribDay[] = [];

      if (uRes) {
        console.log(`[GitHub User API] Status: ${uRes.status}`);
        console.log(`[GitHub User API] Rate-Limit Remaining: ${uRes.headers.get("x-ratelimit-remaining") ?? "N/A"}`);
        console.log(`[GitHub User API] Rate-Limit Reset: ${uRes.headers.get("x-ratelimit-reset") ?? "N/A"}`);
        if (uRes.ok) {
          user = (await uRes.json()) as GhUser;
        }
      }

      if (rRes) {
        console.log(`[GitHub Repos API] Status: ${rRes.status}`);
        if (rRes.ok) {
          repos = (await rRes.json()) as GhRepo[];
        }
      }

      if (cRes && cRes.ok) {
        const cData = (await cRes.json()) as { contributions?: ContribDay[] };
        contrib = cData?.contributions ?? [];
      }

      const data: GitHubStatsData = { user, repos, contrib };

      if (user || repos) {
        console.log("[GitHub Server Fetch Success] User:", user?.login, "Repos:", repos?.length);
        serverCache = { timestamp: Date.now(), data };
      } else if (serverCache) {
        console.log("[GitHub Server Fetch Partial Fail] Serving stale cache.");
        return serverCache.data;
      }

      return data;
    } catch (err) {
      console.error("[GitHub API Server Error]", err);
      return serverCache?.data ?? { user: null, repos: null, contrib: [] };
    }
  },
);
