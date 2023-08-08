import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";

import { NextResponse } from "next/server";

function isRateLimitExceeded(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof err["response"] === "object" &&
    err["response"] !== null &&
    "status" in err["response"] &&
    err["response"]?.["status"] === 429
  );
}

const chat = new ChatOpenAI({
  temperature: 0.5,
  openAIApiKey: process.env.OPENAI_API_KEY ?? "",
  maxRetries: 1,
});

export async function GET() {
  return NextResponse.json({ text: "Use POST method to send a query" });
}

export async function POST(req: Request) {
  const { prompt, schema } = await req.json();
  if (!prompt || !schema) {
    return NextResponse.json({ text: "Empty query or schema" });
  }

  try {
    const chatResponse = await chat.call([
      new SystemMessage(`
      You only speak GraphQL. You need to construct a valid GraphQL query. If you can't construct a valid query reply nicely asking for more instructions. This is information about the GraphQL schema: ${JSON.stringify(
        schema
      )},
        `),
      new HumanMessage(`Give me a query based on the instruction: ${prompt}`),
    ]);

    const gqlResponse = chatResponse.content
      .match(/```\n[(query|mutation|subscription)\s*\{[\s\S]*?```/)
      ?.join()
      .replace("```\n", "")
      .replace("```", "");

    console.log({ gqlResponse });

    if (gqlResponse) {
      return NextResponse.json({ text: gqlResponse });
    }

    return NextResponse.json({
      errorMessage: "Couldn't construct a valid query.",
      text: chatResponse.content,
    });
  } catch (err) {
    if (isRateLimitExceeded(err)) {
      return NextResponse.json({
        errorMessage: "OpenAI limit exceeded. Try again later 🙏",
      });
    }

    console.error(err);
    return NextResponse.json({
      errorMessage: "Something went wrong. Try again later 🙏",
    });
  }
}
