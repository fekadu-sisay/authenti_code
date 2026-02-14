import * as z from "zod";
import { createAgent, tool, providerStrategy } from "langchain";
import { ChatGoogle } from "@langchain/google";
import env from "../../config/env";
import {
  parseGitHubUrl,
  AvgLinesAddedPerCommit,
  LinesAddedInFirstCommitRatio,
  MedianTimeBetweenCommits,
  AvgLinesDeletedPerCommit,
  NavigateCodeBase,
  GetTechstack,
} from "../git/git.service";
import { systemPrompt } from "./systemPrompt";
import { ReviewService } from "../review/review.service";

const reviewService = ReviewService.getInstance();

const avgLinesAddedPerCommit = tool(
  async ({ url }) => {
    return await AvgLinesAddedPerCommit(url);
  },
  {
    name: "avgLinesAddedPerCommit",
    schema: z.object({
      url: z.string(),
    }),
  },
);
const avgLinesDeletedPerCommit = tool(
  async ({ url }) => {
    await AvgLinesDeletedPerCommit(url);
  },
  {
    name: "avgLinesDeletedPerCommit",
    schema: z.object({
      url: z.string(),
    }),
  },
);
const linesAddedInFirstCommitRatio = tool(
  async ({ url }) => {
    return await LinesAddedInFirstCommitRatio(url);
  },
  {
    name: "linesAddedInFirstCommitRatio",
    schema: z.object({
      url: z.string(),
    }),
  },
);
const medianTimeBetweenCommits = tool(
  async ({ url }) => {
    return await MedianTimeBetweenCommits(url);
  },
  {
    name: "medianTimeBetweenCommits",
    schema: z.object({
      url: z.string(),
    }),
  },
);

const commentDensity = tool(({ url }) => {}, {
  name: "commentDensity",
  schema: z.object({
    url: z.string(),
  }),
});

const redundantCommentScore = tool(({ url }) => {}, {
  name: "redundantCommentScore",
  schema: z.object({
    url: z.string(),
  }),
});
const navigateCodeBase = tool(
  async ({ url }) => {
    return await NavigateCodeBase(url);
  },
  {
    name: "navigateCodeBase",
    schema: z.object({
      url: z.string(),
    }),
  },
);
const getTechStack = tool(
  async ({ url }) => {
    return await GetTechstack(url);
  },
  {
    name: "get_techstack",
    schema: z.object({
      url: z.string(),
    }),
  },
);

const model = new ChatGoogle({
  model: "gemini-2.5-flash",
  apiKey: env.GOOGLE_API_KEY,
});
const ResponseFormat = z.object({
  commitConsistency: z.number().min(0).max(100),
  codeEvolution: z.number().min(0).max(100),
  documentation: z.number().min(0).max(100),
  styleConsistency: z.number().min(0).max(100),
  aiPattern: z.number().min(0).max(100),
  report: z.string().describe("give me a detailed code review report here"),
  trustScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "give me value from 0 - 100 this is the avrage score for the above metrics",
    ),
});
const agent = createAgent({
  model,
  systemPrompt,
  responseFormat: ResponseFormat,
  tools: [
    navigateCodeBase,
    redundantCommentScore,
    avgLinesAddedPerCommit,
    avgLinesDeletedPerCommit,
    medianTimeBetweenCommits,
    linesAddedInFirstCommitRatio,
    getTechStack,
  ],
});

export async function analyze(
  url: string,
  techstacks: string[],
  jobId: string,
) {
  if (parseGitHubUrl(url) == null) return;
  const resp = await agent.invoke({
    messages: [
      {
        role: "human",
        content: `url: ${url} techstacks: ${techstacks.join(" ")}`,
      },
    ],
  });

  // save to database

  await reviewService.createReview({
    jobId,
    candidateId: parseGitHubUrl(url)?.owner || "unknown",
    repoUrl: url,
    trustScore: resp.structuredResponse.trustScore,
    signals: {
      commitConsistency: resp.structuredResponse.commitConsistency,
      codeEvolution: resp.structuredResponse.codeEvolution,
      documentation: resp.structuredResponse.documentation,
      styleConsistency: resp.structuredResponse.styleConsistency,
      aiPattern: resp.structuredResponse.aiPattern,
      report: resp.structuredResponse.report,
    },
  });

  console.log(resp.structuredResponse);
  return resp.structuredResponse;
}
