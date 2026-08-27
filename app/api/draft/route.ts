import { z } from "zod";
import { mockRepository } from "@/lib/mock/MockVehicleRepository";
import { draftWithRules } from "@/lib/llm/RuleBasedProvider";
import { DRAFT_SYSTEM_PROMPT } from "@/lib/llm/prompts/draft";
import { completeSafely, getLlm } from "@/lib/llm";

const bodySchema = z.object({
  challanId: z.string(),
  ground: z.enum(["PLATE_MISREAD", "NOT_DRIVING", "WRONG_LOCATION_TIME", "VEHICLE_SOLD", "APPEARS_VALID", "UNCLEAR"]),
  locale: z.enum(["en", "hi"]).default("en"),
});

const draftSchema = z.object({
  grievanceLetter: z.string(),
  recordRequest: z.string(),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
  const challan = await mockRepository.getChallan(parsed.data.challanId);
  if (!challan) return Response.json({ error: "Challan not found" }, { status: 404 });
  const vehicle = await mockRepository.findVehicle(challan.registeredPlate);
  if (!vehicle) return Response.json({ error: "Vehicle not found" }, { status: 404 });

  const provider = getLlm();
  const modelText = await completeSafely(provider, {
    system: DRAFT_SYSTEM_PROMPT,
    json: true,
    user: JSON.stringify({ challan, vehicle, ground: parsed.data.ground, locale: parsed.data.locale }),
  });
  if (modelText && provider.name !== "rules") {
    const checked = draftSchema.safeParse(JSON.parse(modelText));
    if (checked.success) return Response.json({ ...checked.data, provider: "model" });
  }
  return Response.json(draftWithRules({ ground: parsed.data.ground, challan, ownerName: vehicle.ownerName, registration: vehicle.registration, locale: parsed.data.locale }));
}
