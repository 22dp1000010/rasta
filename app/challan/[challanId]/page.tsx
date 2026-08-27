import { notFound } from "next/navigation";
import { vehicles } from "@/lib/mock/seed";
import { MockChip } from "@/ui/MockChip";
import { TriageForm } from "@/features/challan/TriageForm";

export default async function ChallanPage({ params, searchParams }: { params: Promise<{ challanId: string }>; searchParams: Promise<{ lang?: string }> }) {
  const { challanId } = await params;
  const { lang } = await searchParams;
  const challan = vehicles.flatMap((vehicle) => vehicle.challans).find((item) => item.id === challanId);
  if (!challan) notFound();
  const vehicle = vehicles.find((item) => item.id === challan.vehicleId);
  if (!vehicle) notFound();
  const locale = lang === "hi" ? "hi" : "en";

  return (
    <section className="grid-2 section">
      <div className="panel">
        <p className="eyebrow">Triage <MockChip /></p>
        <h1>{locale === "hi" ? "रास्ता को बताइए क्या हुआ" : "Tell Rasta what happened"}</h1>
        <p><strong>{challan.violation}</strong> at {challan.location}. Camera plate: <span className="plate">{challan.cameraPlate}</span></p>
        <div className="lang-toggle" aria-label="Language">
          <a className={locale === "en" ? "active" : ""} href={`/challan/${challan.id}?lang=en`}>English</a>
          <a className={locale === "hi" ? "active" : ""} href={`/challan/${challan.id}?lang=hi`}>Hindi</a>
        </div>
        <TriageForm challan={challan} locale={locale} />
      </div>
      <div className="panel">
        <h2>Why this screen exists</h2>
        <div className="timeline">
          <div className="timeline-item"><span className="dot">1</span><p>Describe the issue in ordinary language.</p></div>
          <div className="timeline-item"><span className="dot">2</span><p>Rasta identifies the likely dispute ground and shows its reasoning.</p></div>
          <div className="timeline-item"><span className="dot">3</span><p>You review evidence and drafts before taking action. Nothing is auto-submitted.</p></div>
        </div>
      </div>
    </section>
  );
}
