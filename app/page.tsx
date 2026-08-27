import Link from "next/link";
import { vehicles } from "@/lib/mock/seed";
import { MockChip } from "@/ui/MockChip";
import { LookupForm } from "@/features/passport/LookupForm";
import { ButtonLink } from "@/ui/ButtonLink";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Vehicle Compliance Passport <MockChip /></p>
        <h1>Fight the wrong fine before it quietly becomes accepted.</h1>
        <p className="lead">Rasta turns scattered challan, document and dispute steps into one plain-language journey. The citizen explains what happened; the system classifies, shows deadlines, drafts paperwork and lets the citizen decide.</p>
        <div className="actions">
          <ButtonLink href="/passport/veh-ts09xx4477">Open primary demo</ButtonLink>
          <ButtonLink href="/about/honesty" tone="ghost">See what is mocked</ButtonLink>
        </div>
      </div>
      <div className="lookup-panel">
        <h2>Check a vehicle</h2>
        <p>Use a fictional registration number. No login, OTP, payment or government system is used.</p>
        <LookupForm />
        <div className="demo-grid">
          <h3>Try a demo vehicle</h3>
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} className="demo-card" href={`/passport/${vehicle.id}`}>
              <strong>{vehicle.registration}</strong>
              <span>{vehicle.ownerName} - {vehicle.notes ?? `${vehicle.cleanMonths} month clean streak`}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="road-visual" aria-hidden="true">
        <div className="road-card">
          <h3>What changes?</h3>
          <p>Rasta makes hidden choices visible: paying means accepting, dispute windows expire, and camera evidence can disappear.</p>
        </div>
      </div>
    </section>
  );
}
