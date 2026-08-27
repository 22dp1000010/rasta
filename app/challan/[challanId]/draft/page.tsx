import { notFound } from "next/navigation";
import { vehicles } from "@/lib/mock/seed";
import type { DisputeGround } from "@/lib/domain/types";
import { draftWithRules } from "@/lib/llm/RuleBasedProvider";
import { DraftEditor } from "@/features/dispute/DraftEditor";
import { MockChip } from "@/ui/MockChip";
import { ButtonLink } from "@/ui/ButtonLink";

const grounds = ["PLATE_MISREAD", "NOT_DRIVING", "WRONG_LOCATION_TIME", "VEHICLE_SOLD", "APPEARS_VALID", "UNCLEAR"];

export default async function DraftPage({ params, searchParams }: { params: Promise<{ challanId: string }>; searchParams: Promise<{ ground?: string; lang?: string }> }) {
  const { challanId } = await params;
  const query = await searchParams;
  const challan = vehicles.flatMap((vehicle) => vehicle.challans).find((item) => item.id === challanId);
  if (!challan) notFound();
  const vehicle = vehicles.find((item) => item.id === challan.vehicleId);
  if (!vehicle) notFound();
  const ground = grounds.includes(query.ground ?? "") ? query.ground as DisputeGround : challan.groundHint;
  const locale = query.lang === "hi" ? "hi" : "en";
  const draft = draftWithRules({ ground, challan, ownerName: vehicle.ownerName, registration: vehicle.registration, locale });
  const payment = ground === "APPEARS_VALID";

  return (
    <section className="grid-2 section">
      <div className="panel">
        <p className="eyebrow">{payment ? "Payment note" : "Editable draft"} <MockChip /></p>
        <h1>{payment ? "Pause before paying." : "Paperwork without the maze."}</h1>
        <p>{payment ? "This path explains the consequence of payment. It does not connect to any payment system." : "Rasta drafts; the citizen reviews and sends. No auto-submission exists in this prototype."}</p>
        <ul>
          <li>Challan: <span className="mono">{challan.id}</span> <MockChip /></li>
          <li>Vehicle: <span className="mono">{vehicle.registration}</span> <MockChip /></li>
          <li>Ground: {ground.replaceAll("_", " ")}</li>
        </ul>
        <div className="actions">
          <ButtonLink href={`/challan/${challan.id}/status?outcome=pending`} tone="ghost">{payment ? "Close as paid in demo" : "I filed this in demo"}</ButtonLink>
          <ButtonLink href={`/challan/${challan.id}/evidence?ground=${ground}&lang=${locale}`} tone="ghost">Back to evidence</ButtonLink>
        </div>
      </div>
      <DraftEditor grievanceLetter={draft.grievanceLetter} recordRequest={draft.recordRequest} />
    </section>
  );
}
