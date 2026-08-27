import type { Challan, ComplianceItem, DisputeOutcome, PassportEvent, Vehicle } from "./types";

export interface PassportScore {
  score: number;
  tier: "At risk" | "Clear" | "Steady" | "Exemplary";
  reasons: string[];
}

export function computePassportScore(vehicle: Pick<Vehicle, "compliance" | "challans" | "events">): PassportScore {
  const reasons: string[] = [];
  const currentDocs = vehicle.compliance.filter((item) => item.severity !== "bad").length;
  const documents = Math.round((currentDocs / Math.max(vehicle.compliance.length, 1)) * 40);
  reasons.push(`${currentDocs} of ${vehicle.compliance.length} documents are current.`);

  const staleOpen = vehicle.challans.filter((challan) => challan.status === "open" && daysUntil(challan.actionDueAt) < 0);
  const challansResolved = staleOpen.length === 0 ? 30 : 12;
  reasons.push(staleOpen.length === 0 ? "No unresolved challan is beyond its action window." : "One or more challans need urgent action.");

  const earlyRenewals = vehicle.compliance.filter((item) => item.renewedEarly).length;
  const proactive = Math.round((earlyRenewals / Math.max(vehicle.compliance.length, 1)) * 20);
  reasons.push(`${earlyRenewals} renewals were handled before expiry.`);

  const rejected = vehicle.events.filter((event) => event.type === "violation_upheld").length;
  const upheld = vehicle.events.filter((event) => event.type === "dispute_upheld").length;
  const goodFaith = rejected === 0 && upheld > 0 ? 10 : rejected === 0 ? 8 : 4;
  reasons.push(rejected === 0 ? "Pending disputes do not reduce the score." : "An upheld violation reduces only the good-faith component.");

  const score = Math.min(100, documents + challansResolved + proactive + goodFaith);
  return { score, tier: tierFor(score, recomputeStreak(vehicle.events)), reasons };
}

export function recomputeStreak(events: PassportEvent[]): number {
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));
  let streak = 0;
  for (const event of sorted) {
    if (event.type === "clean_month") streak += 1;
    if (event.type === "document_lapsed" || event.type === "violation_upheld") streak = 0;
    if (event.type === "dispute_upheld") {
      continue;
    }
  }
  return streak;
}

export function resolveDispute(events: PassportEvent[], outcome: DisputeOutcome, at: string): PassportEvent[] {
  if (outcome === "upheld") return [...events, { type: "dispute_upheld", at }];
  if (outcome === "rejected") return [...events, { type: "violation_upheld", at }];
  return [...events, { type: "challan_pending", at }];
}

export function assertScoreNotPunitive(before: PassportScore, afterPending: PassportScore): true {
  if (afterPending.score < before.score) {
    throw new Error("Pending or disputed challans must not reduce the passport score before resolution.");
  }
  return true;
}

export function canDispute(_score: PassportScore, challan: Challan): boolean {
  return challan.status !== "paid" && challan.status !== "resolved";
}

export function tierFor(score: number, streakMonths: number): PassportScore["tier"] {
  if (score >= 92 && streakMonths >= 36) return "Exemplary";
  if (score >= 78 && streakMonths >= 18) return "Steady";
  if (score >= 65 && streakMonths >= 6) return "Clear";
  return "At risk";
}

function daysUntil(date: string): number {
  const now = new Date("2026-08-27T00:00:00+05:30").getTime();
  const target = new Date(`${date}T00:00:00+05:30`).getTime();
  return Math.ceil((target - now) / 86_400_000);
}
