import { RuleBasedProvider } from "./RuleBasedProvider";
import type { LlmProvider } from "./types";

let failures = 0;
let circuitOpenUntil = 0;

export function getLlm(): LlmProvider {
  const configured = process.env.LLM_PROVIDER ?? "groq";
  if (Date.now() < circuitOpenUntil) return new RuleBasedProvider();
  if (configured === "openai" && process.env.OPENAI_API_KEY) return new OpenAiProvider();
  if (configured === "groq" && process.env.GROQ_API_KEY) return new GroqProvider();
  return new RuleBasedProvider();
}

export async function completeSafely(provider: LlmProvider, input: { system: string; user: string; json?: boolean }): Promise<string | null> {
  if (provider.name === "rules") return provider.complete(input);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await withTimeout(provider.complete(input), Number(process.env.LLM_TIMEOUT_MS ?? 6000));
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  failures += 1;
  if (failures >= 2) circuitOpenUntil = Date.now() + 60_000;
  return null;
}

class OpenAiProvider implements LlmProvider {
  readonly name = "openai";

  async complete(input: { system: string; user: string; json?: boolean }): Promise<string> {
    return postOpenAiCompatible("https://api.openai.com/v1/chat/completions", process.env.OPENAI_API_KEY ?? "", process.env.OPENAI_MODEL ?? "gpt-4o-mini", input);
  }
}

class GroqProvider implements LlmProvider {
  readonly name = "groq";

  async complete(input: { system: string; user: string; json?: boolean }): Promise<string> {
    return postOpenAiCompatible("https://api.groq.com/openai/v1/chat/completions", process.env.GROQ_API_KEY ?? "", process.env.GROQ_MODEL ?? "openai/gpt-oss-120b", input);
  }
}

async function postOpenAiCompatible(url: string, key: string, model: string, input: { system: string; user: string; json?: boolean }): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: input.json ? { type: "json_object" } : undefined,
      messages: [
        { role: "system", content: input.system },
        { role: "user", content: input.user.slice(0, 1200) },
      ],
    }),
  });
  if (!response.ok) throw new Error("LLM request failed");
  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? "";
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out")), ms);
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }, (error: unknown) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}
