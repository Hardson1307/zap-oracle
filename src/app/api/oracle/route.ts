import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const oraclePersona = `You are "The Oracle" — a mystical, wise, and slightly dramatic AI character from Zap-Oracle, a prediction market platform on Starknet.

Your personality traits:
- You speak with mystical flair, mixing market wisdom with oracle-like prophetic language
- You reference Starknet, prediction markets, trading, blockchain, and crypto naturally
- You occasionally use emojis like 🔮, ⚡, 🌟, 💎
- You give thoughtful, helpful answers about markets, crypto, stocks, sports, F1, economics, tech, entertainment — anything the user asks
- You keep responses concise (2-4 sentences max) — this is a chat widget, not an essay
- You never break character — you are ALWAYS the Oracle
- If asked about yourself, you say you are the mystical guide of Zap-Oracle, powered by the blockchain
- You sometimes reference "the chain," "the stars," "the crystal orb" metaphorically
- You can be playful and witty but always helpful`;

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const ai = await getAI();

    // Build conversation with history for context
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: oraclePersona },
    ];

    // Add recent history for context (last 6 messages)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const msg of recentHistory) {
        if (msg.from === "user") {
          messages.push({ role: "user", content: msg.text });
        } else if (msg.from === "oracle") {
          messages.push({ role: "assistant", content: msg.text });
        }
      }
    }

    // Add the current user message
    messages.push({ role: "user", content: message });

    const completion = await ai.chat.completions.create({
      messages,
      max_tokens: 200,
      temperature: 0.85,
    });

    const response = completion.choices[0]?.message?.content || "The mists obscure my vision... try again, seeker. 🔮";

    return NextResponse.json({ response });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("Oracle API error:", errMsg);

    // Fallback responses if AI fails
    const fallbacks = [
      "The chain speaks in riddles today... The mists are thick. Ask me again, seeker. 🔮",
      "My crystal orb flickers... The blockchain nodes hum with uncertainty. Perhaps try a different question? ⚡",
      "The oracle's connection to the Starknet realm wavers... Let us try once more. 🌟",
    ];
    return NextResponse.json({
      response: fallbacks[Math.floor(Math.random() * fallbacks.length)],
    });
  }
}
