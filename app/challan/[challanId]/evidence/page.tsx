import Image from "next/image";
import { notFound } from "next/navigation";
import { vehicles } from "@/lib/mock/seed";
import { daysUntilIst, deadlineSeverity } from "@/features/deadlines";
import { MilestoneMarker } from "@/ui/MilestoneMarker";
import { ButtonLink } from "@/ui/ButtonLink";
import { MockChip } from "@/ui/MockChip";

export default async function EvidencePage({ params, searchParams }: { params: Promise<{ challanId: string }>; searchParams: Promise<{ ground?: string; lang?: string }> }) {
  const { challanId } = await params;
  const query = await searchParams;
  const challan = vehicles.flatMap((vehicle) => vehicle.challans).find((item) => item.id === challanId);
  if (!challan) notFound();
  const ground = query.ground ?? challan.groundHint;
  const lang = query.lang === "hi" ? "hi" : "en";
  const actionDays = daysUntilIst(challan.actionDueAt);
  const footageDays = daysUntilIst(challan.footageDueAt);

  return (
    <>
      <section className="section">
        <p className="eyebrow">Evidence and deadlines <MockChip /></p>
        <h1>Two clocks are running. Rasta shows both.</h1>
        <div className="milestone-grid">
          <MilestoneMarker days={actionDays} label="Days left to act" what="After this, escalation can start." severity={deadlineSeverity(actionDays)} />
          <MilestoneMarker days={footageDays} label="Days left for camera record" what="Request the image before it may be unavailable." severity={deadlineSeverity(footageDays)} />
        </div>
      </section>
      <section className="grid-2 section">
        <div className="panel">
          <h2>Plate comparison</h2>
          <div className="evidence">
            <figure>
              <Image src="/mock-evidence/camera-hatchback.svg" alt="Illustrated mock camera image with plate TS09XX4471" width={420} height={220} />
              <figcaption>Camera image <MockChip /></figcaption>
            </figure>
            <figure>
              <Image src="/mock-evidence/registered-hatchback.svg" alt="Illustrated mock registered vehicle with plate TS09XX4477" width={420} height={220} />
              <figcaption>Registered vehicle <MockChip /></figcaption>
            </figure>
          </div>
        </div>
        <div className="panel">
          <h2>The honest choices</h2>
          <div className="mini-card">
            <h3>Dispute this</h3>
            <p>Rasta drafts a factual grievance and a request for the image or enforcement record. Nothing is submitted automatically.</p>
            <ButtonLink href={`/challan/${challan.id}/draft?ground=${ground}&lang=${lang}`}>Draft dispute</ButtonLink>
          </div>
          <div className="mini-card" style={{ marginTop: 12 }}>
            <h3>Pay and close</h3>
            <p>Use this only if the challan looks correct. Paying a disputed challan can be treated as accepting it.</p>
            <ButtonLink href={`/challan/${challan.id}/draft?ground=APPEARS_VALID&lang=${lang}`} tone="ghost">Show payment note</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
