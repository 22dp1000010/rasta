import { notFound } from "next/navigation";
import { computePassportScore, canDispute } from "@/lib/domain/passport";
import { vehicles } from "@/lib/mock/seed";
import { MockChip } from "@/ui/MockChip";
import { StatusChip } from "@/ui/StatusChip";
import { ButtonLink } from "@/ui/ButtonLink";
import { RewardDisclaimer } from "@/ui/RewardDisclaimer";

export default async function PassportPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = await params;
  const vehicle = vehicles.find((item) => item.id === vehicleId);
  if (!vehicle) notFound();
  const score = computePassportScore(vehicle);
  const firstOpen = vehicle.challans.find((challan) => canDispute(score, challan));

  return (
    <>
      <section className="section passport-head">
        <div className="panel">
          <p className="eyebrow">Vehicle passport <MockChip /></p>
          <h1>{vehicle.ownerName}</h1>
          <div className="plate">{vehicle.registration}</div>
          <p>{vehicle.modelClass} in {vehicle.city}. {vehicle.notes ?? "Fictional owner record for demo only."}</p>
          <div className="actions">
            {firstOpen ? <ButtonLink href={`/challan/${firstOpen.id}`}>Review open challan</ButtonLink> : <ButtonLink href="/" tone="ghost">Choose another vehicle</ButtonLink>}
            <ButtonLink href="/" tone="ghost">Choose another vehicle</ButtonLink>
          </div>
        </div>
        <div className="panel score">
          <StatusChip severity={score.score > 90 ? "good" : score.score > 75 ? "warn" : "bad"}>{score.tier}</StatusChip>
          <strong>{score.score}</strong>
          <p>Compliance score with reasons, never a gate to dispute.</p>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${score.score}%` }} /></div>
        </div>
      </section>

      <section className="grid-2 section">
        <div className="panel">
          <h2>Documents</h2>
          <ul className="list">
            {vehicle.compliance.map((item) => (
              <li className="row" key={item.id}>
                <span>{item.label} <MockChip /></span>
                <StatusChip severity={item.severity}>{item.status}</StatusChip>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>Clean streak</h2>
          <p><strong>{vehicle.cleanMonths} months</strong> without an upheld violation or lapsed document.</p>
          <p>{vehicle.challans.length ? "Open challans place the streak at risk until resolved." : "This vehicle qualifies for proposed exemplary rewards."}</p>
          <div className="mini-card">
            <strong>Proposed reward</strong>
            <p>{score.tier === "Exemplary" ? "Illustrative insurance premium discount tier." : "Priority document-renewal appointment after a clean record."}</p>
            <RewardDisclaimer />
          </div>
        </div>
      </section>

      <section className="panel section">
        <h2>Challans</h2>
        {vehicle.challans.length ? (
          <ul className="list">
            {vehicle.challans.map((challan) => (
              <li className="row" key={challan.id}>
                <span><strong>{challan.kind}</strong><br /><small>{challan.violation} - {challan.location} <MockChip /></small></span>
                <span className="actions">
                  <StatusChip severity={challan.status === "paid" ? "good" : "warn"}>{challan.status}</StatusChip>
                  <ButtonLink href={`/challan/${challan.id}`} tone="ghost">Open</ButtonLink>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No open challans. The passport still helps track renewals and proposed rewards.</p>
        )}
      </section>
    </>
  );
}
