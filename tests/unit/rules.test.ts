import { describe, expect, it } from "vitest";
import { classifyWithRules } from "@/lib/llm/RuleBasedProvider";
import { vehicles } from "@/lib/mock/seed";

const challan = vehicles[0].challans[0];

describe("rule based provider", () => {
  it("classifies plate misread by plate distance", () => {
    expect(classifyWithRules({ text: "This is wrong", challan, locale: "en" }).ground).toBe("PLATE_MISREAD");
  });

  it("classifies not driving", () => {
    expect(classifyWithRules({ text: "My brother was driving", challan: vehicles[0].challans[2], locale: "en" }).ground).toBe("NOT_DRIVING");
  });

  it("classifies wrong location", () => {
    expect(classifyWithRules({ text: "The vehicle was in a different city", challan: vehicles[0].challans[3], locale: "en" }).ground).toBe("WRONG_LOCATION_TIME");
  });

  it("classifies sold vehicle", () => {
    expect(classifyWithRules({ text: "I sold this to the new owner", challan: vehicles[1].challans[0], locale: "en" }).ground).toBe("VEHICLE_SOLD");
  });

  it("classifies Hindi transliterated input", () => {
    expect(classifyWithRules({ text: "maine gaadi bech di", challan: vehicles[1].challans[0], locale: "hi" }).ground).toBe("VEHICLE_SOLD");
  });

  it("classifies appears valid", () => {
    expect(classifyWithRules({ text: "This looks correct", challan: vehicles[0].challans[1], locale: "en" }).ground).toBe("APPEARS_VALID");
  });

  it("returns unclear when it cannot know", () => {
    const clearPlate = { ...vehicles[0].challans[1], cameraPlate: "TS09XX4477", registeredPlate: "TS09XX4477" };
    expect(classifyWithRules({ text: "Please help", challan: clearPlate, locale: "en" }).ground).toBe("UNCLEAR");
  });
});
