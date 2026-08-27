import { describe, expect, it } from "vitest";
import { daysUntilIst, deadlineSeverity } from "@/features/deadlines";

describe("deadline engine", () => {
  it("counts normal future days in IST", () => {
    expect(daysUntilIst("2026-09-04", "2026-08-27T00:00:00+05:30")).toBe(8);
  });

  it("handles expiring today", () => {
    expect(daysUntilIst("2026-08-27", "2026-08-27T22:00:00+05:30")).toBe(0);
  });

  it("handles expired dates", () => {
    expect(daysUntilIst("2026-08-26", "2026-08-27T00:00:00+05:30")).toBe(-1);
  });

  it("handles leap year dates", () => {
    expect(daysUntilIst("2028-03-01", "2028-02-28T10:00:00+05:30")).toBe(2);
  });

  it("stays stable at UTC boundaries", () => {
    expect(daysUntilIst("2026-08-28", "2026-08-27T20:00:00Z")).toBe(0);
  });

  it("maps severity", () => {
    expect(deadlineSeverity(3)).toBe("bad");
    expect(deadlineSeverity(8)).toBe("warn");
    expect(deadlineSeverity(20)).toBe("good");
  });
});
