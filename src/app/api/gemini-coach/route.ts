import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * Server-only Gemini proxy. The browser never sees `GEMINI_API_KEY`.
 *
 * POST JSON body:
 *   { "context": "string" } — short pre-computed summary from your UI (scores, grams, categories).
 *
 * Response: { "text": "..." } or { "error": "..." } with non-2xx status.
 */
export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is missing. Add it to .env.local (see .env.example)." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const context =
    typeof body === "object" && body !== null && "context" in body && typeof (body as { context: unknown }).context === "string"
      ? (body as { context: string }).context.trim()
      : "";

  if (!context) {
    return NextResponse.json({ error: 'Body must include a non-empty "context" string.' }, { status: 400 });
  }

  const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelId,
    systemInstruction:
      "You are a brief, friendly eco coach for the app VITALITY. All CO2 numbers in the user message are authoritative and computed by the app—do not change, contradict, or re-estimate them. Reply in 3–5 short sentences. Plain text, no headings.",
  });

  const prompt = `User impact summary (trust these figures exactly):\n\n${context.slice(0, 12_000)}\n\nGive a warm, practical coaching reply.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
