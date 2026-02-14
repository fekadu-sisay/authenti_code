import * as z from "zod";
import { createAgent, tool } from "langchain";
import { ChatGoogle } from "@langchain/google";
import env from "../../config/env"

function AvgLinesAddedPerCommit(url: string) { }
function AvgLinesDeletedPerCommit(url: string) { }
function LinesAddedInFirstCommitRatio(url: string) { }
function MedianTimeBetweenCommits(url: string) { }
function AvgFunctionLength(url: string) { }
function CommentDensity(url: string) { }
function RedundantCommentScore(url: string) { }
function NavigateCodeBase(url: string) { }


function isValidate(url: string) {
  return true
}


const avgLinesAddedPerCommit = tool(
  ({ url }) => {
    AvgLinesAddedPerCommit(url)
  }, {
  name: "avgLinesAddedPerCommit",
  schema: z.object({
    url: z.string()
  })
})
const avgLinesDeletedPerCommit = tool(
  ({ url }) => {
    avgLinesDeletedPerCommit(url)
  }, {
  name: "avgLinesDeletedPerCommit",
  schema: z.object({
    url: z.string()
  })
})
const linesAddedInFirstCommitRatio = tool(
  ({ url }) => {
    LinesAddedInFirstCommitRatio(url)
  }, {
  name: "linesAddedInFirstCommitRatio",
  schema: z.object({
    url: z.string()
  })
})
const medianTimeBetweenCommits = tool(
  ({ url }) => {
    MedianTimeBetweenCommits(url)
  }, {
  name: "medianTimeBetweenCommits",
  schema: z.object({
    url: z.string()
  }
  )
})
const avgFunctionLength = tool(
  ({ url }) => {
    AvgFunctionLength(url)
  }, {
  name: "avgFunctionLength",
  schema: z.object({
    url: z.string()
  }
  )
})

const commentDensity = tool(
  ({ url }) => {
  }, {
  name: "commentDensity",
  schema: z.object({
    url: z.string()
  }
  )
})

const redundantCommentScore = tool(
  ({ url }) => {
  }, {
  name: "redundantCommentScore",
  schema: z.object({
    url: z.string()
  }
  )
})
const navigateCodeBase = tool(
  ({ url }) => {
    NavigateCodeBase(url)
  }, {
  name: "navigateCodeBase",
  schema: z.object({
    url: z.string()
  })
}
)


const model = new ChatGoogle({ model: "gemini-2.5-flash", apiKey: env.GOOGLE_API_KEY })
const agent = createAgent({
  model,
  tools: [
    navigateCodeBase,
    redundantCommentScore,
    commentDensity,
    avgFunctionLength,
    avgLinesAddedPerCommit,
    avgLinesDeletedPerCommit,
    medianTimeBetweenCommits,
    linesAddedInFirstCommitRatio
  ],
});


export async function analyze(url: string) {
  if (!isValidate(url)) return
  const resp = await agent.invoke({
    messages: [{ role: "human", content: url }]
  })
  console.log(resp)
}
analyze("https://github.com/fekadu-sisay/authenti_code.git")
