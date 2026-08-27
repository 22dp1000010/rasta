import { z } from "zod";
import { explainWithRules } from "@/lib/llm/RuleBasedProvider";

const bodySchema = z.object({ term: z.string().max(80) });
const cache = new Map<string, string>();

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const key = parsed.data.term.toLowerCase();
  if (!cache.has(key)) cache.set(key, explainWithRules(key));
  return Response.json({ explanation: cache.get(key) });
}
