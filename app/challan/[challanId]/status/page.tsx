import { notFound } from "next/navigation";
import { vehicles } from "@/lib/mock/seed";
import { resolveDispute } from "@/lib/domain/passport";
import type { DisputeOutcome } from "@/lib/domain/types";
import { MockChip } from "@/ui/MockChip";
import { ButtonLink } from "@/ui/ButtonLink";
import { StatusChip } from "@/ui/StatusChip";

export default async function StatusPage({ params, searchParams }: { params: Promise<{ challanId: string }>; searchParams: Promise<{ outcome?: string }> }) {
  const { challanId } = await params;
  const { outcome } = await searchParams;
  const challan = vehicles.flatMap((vehicle) => vehicle.challans).find((item) => item.id === challanId);
  if (!challan) notFound();
  const vehicle = vehicles.find((item) => item.id === challan.vehicleId);
  if (!vehicle) notFound();
  const selected: DisputeOutcome = outcome === "upheld" || outcome === "rejected" ? outcome : "pending";
  const restored = selected === "upheld";
  const events = resolveDispute(vehicle.events, selected, "2026-08-27");
  const streak = restored ? vehicle.cleanMonths : selected === "rejected" ? 0 : Math.max(vehicle.cleanMonths - 1, 0);

  return (
    <section className="grid-2 section">
      <div className="panel">
        <p className="eyebrow">Dispute status <MockChip /></p>
        <h1>{restored ? "Streak restored." : selected === "rejected" ? "Rejected, with next steps." : "Filed, waiting for review."}</h1>
        <p>{restored ? `The wrong challan is removed from the streak calculation. ${vehicle.ownerName}'s clean record is restored retroactively.` : selected === "rejected" ? "Rasta explains the break and keeps payment or appeal choices visible without hiding the outcome." : "This is a labelled demo state. The citizen filed manually; Rasta did not submit anything."}</p>
        <div className="score">
          <StatusChip severity={restored ? "good" : selected === "rejected" ? "bad" : "warn"}>{selected}</StatusChip>
          <strong>{streak}</strong>
          <p>month clean streak</p>
        </div>
        <p className="fine-print">Event count in recomputation: {events.length}. Pending or disputed challans do not reduce the compliance score before resolution.</p>
        <div className="actions">
          <ButtonLink href={`/challan/${challan.id}/status?outcome=upheld`}>Simulate upheld</ButtonLink>
          <ButtonLink href={`/challan/${challan.id}/status?outcome=rejected`} tone="danger">Simulate rejected</ButtonLink>
          <ButtonLink href={`/passport/${vehicle.id}`} tone="ghost">Back to passport</ButtonLink>
        </div>
      </div>
      <div className="panel">
        <h2>Escalation ladder</h2>
        <div className="timeline">
          <div className="timeline-item"><span className="dot">1</span><p>Citizen files the reviewed draft manually.</p></div>
          <div className="timeline-item"><span className="dot">2</span><p>Record request asks for the camera image before retention ends.</p></div>
          <div className="timeline-item"><span className="dot">3</span><p>{restored ? "If upheld, Rasta marks the challan resolved and restores the streak." : "If rejected, Rasta explains the confirmed break and the next choice."}</p></div>
        </div>
      </div>
    </section>
  );
}
