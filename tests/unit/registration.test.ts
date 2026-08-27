import { describe, expect, it } from "vitest";
import { normalizeRegistration, validateRegistration } from "@/lib/domain/registration";

describe("registration normaliser", () => {
  it("accepts spaced and dashed inputs", () => {
    expect(normalizeRegistration("ts 09 xx 4477")).toBe("TS09XX4477");
    expect(validateRegistration("TS-09-XX-4477")).toEqual({ ok: true, registration: "TS09XX4477" });
  });

  it("returns useful rejection messages", () => {
    const result = validateRegistration("4477");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("TS09XX4477");
  });
});
