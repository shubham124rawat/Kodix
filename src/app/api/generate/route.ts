import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPTS = {
  generation: `You are a highly skilled, pragmatic human developer who loves simple, readable, and elegant code.
Your goal is to write code that is clean, direct, and immediately understandable to another human.
- Write pragmatic code. Avoid massive over-engineering, unnecessary abstractions, or massive factory patterns. Keep it as simple as possible.
- Use natural, descriptive variable and function names (e.g., use 'isLoggedIn' instead of 'userAuthenticationStateStatusBoolean').
- Write organic, human-like comments. Explain *why* a specific line or logical decision was made, rather than just stating what the code syntax does.
- Always conclude with a friendly, plain-English complexity estimation (e.g., Time: O(n), Space: O(1)).`,

  debugging: `You are a friendly peer developer helping a teammate debug their code. 
Review the provided code, find the mistakes, and explain them naturally, just like a colleague would in a Slack message.
Your output must follow this clean structure:
1. WHAT'S BROKEN: A simple, natural explanation of the logical or syntax errors.
2. FIXED CODE: The fully corrected, clean, and highly readable code wrapped in a markdown block.
3. WHAT HAPPENED: A short, simple paragraph explaining why the original code failed.
4. FRIENDLY ADVICE: One or two practical tips to avoid this mistake next time.`,

  explanation: `You are a friendly, clear-headed senior developer explaining code to a junior teammate. 
Break down the logic step-by-step using plain English, natural real-world analogies, and simple terms. 
Avoid dry academic jargon. Speak naturally, highlighting where the data starts, how it changes, and where it ends up.`,

  optimization: `You are a pragmatic performance engineer who values speed but absolutely hates needlessly complex code.
Optimize the code to run faster or use less memory, but do not sacrifice readability to get there.
Provide:
- The optimized code block (kept clean and readable).
- A simple, comparative breakdown of the performance win (e.g., why moving from O(n^2) to O(n \log n) makes a huge difference in the real world).
- Any practical trade-offs the developer should keep in mind.`,
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: API key missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { prompt, language, module } = body;

    if (!prompt || !language || !module) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: prompt, language, or module" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[module as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.generation;

    const fullPrompt = `${systemPrompt}\n\nLanguage: ${language}\n\nUser Request:\n${prompt}`;

    const ai = new GoogleGenAI({ apiKey });

    // Retry-backoff strategy for 503 errors
    let result: any;
    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        result = await ai.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: fullPrompt,
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        // Check for 503 Service Unavailable error (check multiple possible error structures)
        const is503Error =
          error?.status === 503 ||
          error?.code === 503 ||
          error?.message?.includes("503") ||
          error?.message?.includes("UNAVAILABLE") ||
          String(error).includes("503") ||
          String(error).includes("UNAVAILABLE");

        if (is503Error) {
          if (retryCount < maxRetries) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
            continue; // Retry
          } else {
            // Max retries reached, return friendly 503 response
            return new Response(
              JSON.stringify({
                error: "The AI servers are currently experiencing heavy traffic. Please wait a few seconds and try clicking generate again!"
              }),
              { status: 503, headers: { "Content-Type": "application/json" } }
            );
          }
        }
        throw error; // Re-throw non-503 errors
      }
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error && error.message.includes("429")) {
      return new Response(
        JSON.stringify({ error: "System is temporarily busy. Please wait a moment before requesting another generation." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "An unexpected error occurred during code generation" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}