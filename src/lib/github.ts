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

// In-memory server cache (10 min TTL) to eliminate serverless GitHub rate limits
let serverCache: { timestamp: number; data: GitHubStatsData } | null = null;
const SERVER_CACHE_TTL = 10 * 60 * 1000;

export const fetchGitHubStatsServer = createServerFn({ method: "GET" }).handler(
  async (): Promise<GitHubStatsData> => {
    // 1. Return server memory cache if fresh
    if (serverCache && Date.now() - serverCache.timestamp < SERVER_CACHE_TTL) {
      return serverCache.data;
    }

    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      "User-Agent": "ImmPappu-Portfolio-App",
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      headers["Authorization"] = `token ${token}`;
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

      if (uRes && uRes.ok) {
        user = (await uRes.json()) as GhUser;
      } else if (uRes) {
        console.warn(`[GitHub API Server User Error] Status: ${uRes.status}`);
      }

      if (rRes && rRes.ok) {
        repos = (await rRes.json()) as GhRepo[];
      } else if (rRes) {
        console.warn(`[GitHub API Server Repos Error] Status: ${rRes.status}`);
      }

      if (cRes && cRes.ok) {
        const cData = (await cRes.json()) as { contributions?: ContribDay[] };
        contrib = cData?.contributions ?? [];
      }

      const data: GitHubStatsData = { user, repos, contrib };

      if (user || repos) {
        serverCache = { timestamp: Date.now(), data };
      }

      return data;
    } catch (err) {
      console.error("[GitHub API Server Error]", err);
      return serverCache?.data ?? { user: null, repos: null, contrib: [] };
    }
  },
);
