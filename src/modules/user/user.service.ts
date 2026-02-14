import axios from "axios";
import { ApiError } from "../../utils/api/ApiError";

const GITHUB_API = "https://api.github.com";

function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
	try {
		const u = new URL(repoUrl);
		const parts = u.pathname.replace("/(^\/+|\/+$/g", "").split("/");
		if (parts.length < 2) throw new Error("Invalid repo url");
		return { owner: parts[0], repo: parts[1].replace(/.git$/, "") };
	} catch (err) {
		// try raw owner/repo
		const parts = repoUrl.replace("/(^\/+|\/+$/g", "").split("/");
		if (parts.length >= 2) return { owner: parts[0], repo: parts[1].replace(/.git$/, "") };
		throw new Error("Invalid repository URL or owner/repo string");
	}
}

export async function fetchRepoStats(repoUrl: string, token?: string) {
	if (!repoUrl) throw new ApiError(400, "`repoUrl` is required");

	const { owner, repo } = parseRepoUrl(repoUrl);
	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
	};
	if (token) headers["Authorization"] = `token ${token}`;

	// fetch repo metadata
	const repoResp = await axios
		.get(`${GITHUB_API}/repos/${owner}/${repo}`, { headers })
		.catch(() => {
			throw new ApiError(404, `Repository not found: ${owner}/${repo}`);
		});

	const repoData = repoResp.data;

	// paginate commits to compute total commits and active days
	let page = 1;
	const perPage = 100;
	let commitsCount = 0;
	const daySet = new Set<string>();

	while (true) {
		const commitsResp = await axios.get(
			`${GITHUB_API}/repos/${owner}/${repo}/commits`,
			{
				headers,
				params: { per_page: perPage, page },
			},
		);

		const commits = commitsResp.data as Array<any>;
		if (!commits || commits.length === 0) break;

		commitsCount += commits.length;
		for (const c of commits) {
			const date = c?.commit?.author?.date || c?.commit?.committer?.date;
			if (date) daySet.add(date.slice(0, 10));
		}

		if (commits.length < perPage) break;
		page += 1;
	}


	page = 1;
	let contributorsCount = 0;
	while (true) {
		const contribResp = await axios.get(
			`${GITHUB_API}/repos/${owner}/${repo}/contributors`,
			{ headers, params: { per_page: perPage, page, anon: true } },
		);
		const contribs = contribResp.data as Array<any>;
		if (!contribs || contribs.length === 0) break;
		contributorsCount += contribs.length;
		if (contribs.length < perPage) break;
		page += 1;
	}

	return {
		fullName: repoData.full_name,
		description: repoData.description,
		commitsCount,
		activeDays: daySet.size,
		contributorsCount,
		openIssues: repoData.open_issues_count,
		stars: repoData.stargazers_count,
		forks: repoData.forks_count,
		url: repoData.html_url,
	};
}

export default { fetchRepoStats };
