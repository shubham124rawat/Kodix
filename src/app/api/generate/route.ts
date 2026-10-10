import Groq from "groq-sdk";

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
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: Groq API key missing" }),
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

    // Initialize the Groq SDK client
    const groq = new Groq({ apiKey });

    // Request a real-time streaming completion via Qwen 3.8 27B
    const responseStream = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Language: ${language}\n\nUser Request:\n${prompt}` }
      ],
      stream: true,
    });

    // Pipe the incoming Groq data chunks through Next.js ReadableStream response framework
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.choices[0]?.delta?.content || "";
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
    console.error("Groq API Error:", error);

    // Gracefully catch standard free-tier rate limits (429) if triggered
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 429
    ) {
      return new Response(
        JSON.stringify({ error: "System is temporarily busy handling requests. Please wait a few seconds before trying again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "An unexpected error occurred during code generation." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}