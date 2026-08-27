import { describe, expect, it } from "vitest";
import { assertScoreNotPunitive, computePassportScore, recomputeStreak, resolveDispute, tierFor } from "@/lib/domain/passport";
import { vehicles } from "@/lib/mock/seed";

describe("passport rules", () => {
  it("computes score with reasons", () => {
    const result = computePassportScore(vehicles[0]);
    expect(result.score).toBeGreaterThan(70);
    expect(result.reasons.length).toBeGreaterThanOrEqual(4);
  });

  it("handles a vehicle with zero history", () => {
    const result = computePassportScore({ compliance: [], challans: [], events: [] });
    expect(result.score).toBeGreaterThanOrEqual(38);
  });

  it("recomputes a clean streak from events", () => {
    expect(recomputeStreak([{ type: "clean_month", at: "2026-01-01" }, { type: "clean_month", at: "2026-02-01" }])).toBe(2);
  });

  it("restores retroactively when dispute is upheld", () => {
    const events = resolveDispute(vehicles[0].events, "upheld", "2026-08-27");
    expect(recomputeStreak(events)).toBe(14);
  });

  it("restarts when dispute is rejected", () => {
    const events = resolveDispute(vehicles[0].events, "rejected", "2026-08-27");
    expect(recomputeStreak(events)).toBe(0);
  });

  it("does not punish pending disputes before resolution", () => {
    const before = computePassportScore(vehicles[0]);
    const after = computePassportScore({ ...vehicles[0], events: resolveDispute(vehicles[0].events, "pending", "2026-08-27") });
    expect(assertScoreNotPunitive(before, after)).toBe(true);
  });

  it("sets tier boundaries", () => {
    expect(tierFor(93, 38)).toBe("Exemplary");
    expect(tierFor(80, 18)).toBe("Steady");
    expect(tierFor(66, 6)).toBe("Clear");
  });
});
