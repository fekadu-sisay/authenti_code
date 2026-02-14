import { Octokit } from "@octokit/rest";
import env from "../../config/env";

const octokit = new Octokit({
  auth: env.GITHUB_TOKEN, // set your token in the environment
});
const EXCLUDED_DIRS = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".cache",
  ".turbo",
  "out",
  "vendor"
]

const EXCLUDED_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml"
];

export async function getContent(
  owner: string,
  repo: string,
  path: string
) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (!Array.isArray(response.data) && response.data.type === "file") {
      return Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");
    }

    return null;
  } catch (err) {
    console.log(`Failed to fetch ${path}`);
    return null;
  }
}


function shouldExclude(path: string): boolean {
  // Exclude directories
  for (const dir of EXCLUDED_DIRS) {
    if (path.includes(`/${dir}/`) || path.startsWith(`${dir}/`)) {
      return true;
    }
  }

  // Exclude lock files
  for (const file of EXCLUDED_FILES) {
    if (path.endsWith(file)) {
      return true;
    }
  }

  // Exclude binary files
  if (/\.(png|jpg|jpeg|gif|svg|ico|mp4|mp3|woff|woff2|ttf|eot|zip|tar|gz)$/i.test(path)) {
    return true;
  }

  return false;
}
export async function GetTechstack(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;
  const languages = await octokit.repos.listLanguages({ owner, repo });
  return languages;
}

async function getAllCommits(owner: string, repo: string) {
  const commits: any[] = [];
  let page = 1;
  const per_page = 100;

  while (true) {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page,
      page,
    });
    if (data.length === 0) break;
    commits.push(...data);
    page++;
  }

  return commits;
}

export async function AvgLinesAddedPerCommit(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  const commits = await getAllCommits(owner, repo);
  console.log("commits", commits)

  let totalAdded = 0;
  for (const commit of commits) {
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    });
    totalAdded += data.stats?.additions || 0;
  }

  return totalAdded / commits.length;
}

export async function AvgLinesDeletedPerCommit(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  const commits = await getAllCommits(owner, repo);

  let totalDeleted = 0;
  for (const commit of commits) {
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    });
    totalDeleted += data?.stats?.deletions || 0;
  }

  return totalDeleted / commits.length;
}
function median(values: number[]) {
  values.sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return (values[mid - 1] + values[mid]) / 2;
  }
  return values[mid];
}

export async function MedianTimeBetweenCommits(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  const commits = await getAllCommits(owner, repo);
  if (commits.length < 2) return 0;

  const times = commits.map((c) =>
    new Date(c.commit.author?.date || 0).getTime(),
  );
  const diffs = [];
  for (let i = 1; i < times.length; i++) {
    diffs.push(times[i] - times[i - 1]);
  }

  return median(diffs) / (1000 * 60 * 60); // in hours
}

export async function getAllFiles(
  owner: string,
  repo: string,
  path = "",
): Promise<string[]> {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  let files: string[] = [];

  for (const item of data as any) {
    if (item.type === "file" && item.name.endsWith(".ts")) {
      // or .js/.py
      files.push(item.path);
    } else if (item.type === "dir") {
      const subFiles = await getAllFiles(owner, repo, item.path);
      files.push(...subFiles);
    }
  }

  return files;
}

async function getFileContent(owner: string, repo: string, path: string) {
  const { data } = await octokit.repos.getContent({ owner, repo, path });
  const content = Buffer.from((data as any).content, "base64").toString();
  return content;
}
export async function LinesAddedInFirstCommitRatio(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  const commits = await getAllCommits(owner, repo);
  commits.reverse(); // Oldest first
  if (commits.length === 0) return 0;

  const first = commits[0];
  const { data } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: first.sha,
  });

  const totalAdded = commits.reduce(async (sumP, commit) => {
    const sum = await sumP;
    const { data } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: commit.sha,
    });
    return sum + data.stats?.additions || 0;
  }, Promise.resolve(0));

  return data.stats?.additions || 0 / (await totalAdded) || 0;
}

export async function NavigateCodeBase(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;

  const { owner, repo } = parsed;

  const files = await getAllFiles(owner, repo);

  const filteredFiles = files.filter((file) => !shouldExclude(file));

  const fileContents = await Promise.all(
    filteredFiles.map(async (file) => {
      const content = await getContent(owner, repo, file);
      return content ? { path: file, content } : null;
    })
  );

  // remove null results
  const cleaned = fileContents.filter(Boolean);

  return cleaned;
}

export function parseGitHubUrl(url: string) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean); // remove empty parts

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repo URL");
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, ""); // remove .git if present
    return { owner, repo };
  } catch (err) {
    console.error("Invalid URL:", err);
    return null;
  }
}

export async function getRepoInfo(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null;
  const { owner, repo } = parsed;

  try {
    const response = await octokit.repos.get({
      owner,
      repo,
    });

    const languages = await octokit.repos.listLanguages({ owner, repo });
    console.log("Repository Info:");
    console.log(languages.data);
    console.log({
      full_name: response.data.full_name,
      description: response.data.description,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      open_issues: response.data.open_issues_count,
      default_branch: response.data.default_branch,
      created_at: response.data.created_at,
      updated_at: response.data.updated_at,
    });
  } catch (error) {
    console.error("Error fetching repo info:", error);
  }
}
export async function GetPackageAuthor(url: string) {
  const parsed = parseGitHubUrl(url)
  if (!parsed) return
  const { owner, repo } = parsed
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: "package.json",
    });

    if (!Array.isArray(response.data) && response.data.type === "file") {
      const content = Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");

      const packageJson = JSON.parse(content);

      return packageJson.author || null;
    }

    return null;
  } catch (err) {
    console.log("package.json not found");
    return null;
  }
}
async function testRun(url: string) {
  const parsed = parseGitHubUrl(url)
  if (!parsed) return
  const { owner, repo } = parsed
  const author = await GetPackageAuthor(url)
  const code = await NavigateCodeBase(url)
  const commits = await getAllCommits(owner, repo)
  console.log("author", author)
  console.log("commit", commits)
  console.log("code", code)
}
testRun("https://github.com/fekadu-sisay/authenti_code")
