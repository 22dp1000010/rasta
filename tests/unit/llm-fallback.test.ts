import { describe, expect, it, vi } from "vitest";
import { completeSafely } from "@/lib/llm";
import type { LlmProvider } from "@/lib/llm/types";

describe("LLM fallback wrapper", () => {
  it("never throws to the caller on provider failure", async () => {
    const provider: LlmProvider = {
      name: "broken",
      complete: vi.fn().mockRejectedValue(new Error("network")),
    };
    await expect(completeSafely(provider, { system: "x", user: "y" })).resolves.toBeNull();
  });
});
