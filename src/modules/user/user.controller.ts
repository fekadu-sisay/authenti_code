import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/api/response";
import userService from "./user.service";

export async function getRepoStats(req: Request, res: Response) {
	const { repoUrl } = req.body;
	const token = process.env.GITHUB_TOKEN || undefined;

	try {
		const stats = await userService.fetchRepoStats(repoUrl, token);
		return sendResponse(res, StatusCodes.OK, "Repo stats fetched", stats);
	} catch (err: any) {
		const status = err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
		return sendResponse(res, status, err?.message || "Error fetching repo stats");
	}
}

export default { getRepoStats };
