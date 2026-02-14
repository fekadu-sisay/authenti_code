import { Octokit } from "@octokit/rest";

// No auth needed for public repos
const octokit = new Octokit();

function parseGitHubUrl(url: string) {
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
    console.error("Invalid URL:", err.message);
    return null;
  }
}

async function getRepoInfo(url: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) return null
  const { owner, repo } = parsed

  try {
    const response = await octokit.repos.get({
      owner, // GitHub username/org
      repo,  // Repository name
    });

    const languages = await octokit.repos.listLanguages({ owner, repo });
    console.log("Repository Info:");
    console.log(languages.data)
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

getRepoInfo("https://github.com/fekadu-sisay/authenti_code");

