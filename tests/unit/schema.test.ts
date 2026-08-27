import { describe, expect, it } from "vitest";
import { z } from "zod";

const classifyResultSchema = z.object({
  ground: z.enum(["PLATE_MISREAD", "NOT_DRIVING", "WRONG_LOCATION_TIME", "VEHICLE_SOLD", "APPEARS_VALID", "UNCLEAR"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
  evidenceNeeded: z.array(z.string()),
  clarifyingQuestion: z.string().nullable(),
});

describe("classification schema", () => {
  it("rejects malformed model output", () => {
    expect(classifyResultSchema.safeParse({ ground: "MAKE_UP", confidence: 3 }).success).toBe(false);
  });
});
