import { z } from "zod";
import { mockRepository } from "@/lib/mock/MockVehicleRepository";
import { classifyWithRules } from "@/lib/llm/RuleBasedProvider";
import { CLASSIFY_SYSTEM_PROMPT } from "@/lib/llm/prompts/classify";
import { completeSafely, getLlm } from "@/lib/llm";

const bodySchema = z.object({
  challanId: z.string(),
  text: z.string().max(1200),
  locale: z.enum(["en", "hi"]).default("en"),
});

const resultSchema = z.object({
  ground: z.enum(["PLATE_MISREAD", "NOT_DRIVING", "WRONG_LOCATION_TIME", "VEHICLE_SOLD", "APPEARS_VALID", "UNCLEAR"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  evidenceNeeded: z.array(z.string()),
  clarifyingQuestion: z.string().nullable(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const challan = await mockRepository.getChallan(parsed.data.challanId);
  if (!challan) return Response.json({ error: "Challan not found" }, { status: 404 });

  const provider = getLlm();
  const modelText = await completeSafely(provider, {
    system: CLASSIFY_SYSTEM_PROMPT,
    json: true,
    user: JSON.stringify({ text: parsed.data.text, challan, locale: parsed.data.locale }),
  });
  if (modelText && provider.name !== "rules") {
    const checked = resultSchema.safeParse(JSON.parse(modelText));
    if (checked.success) {
      console.info(`Classified by ${provider.name}`);
      return Response.json({ ...checked.data, provider: "model" });
    }
  }

  console.info("Classified by rules");
  return Response.json(classifyWithRules({ text: parsed.data.text, challan, locale: parsed.data.locale }));
}
