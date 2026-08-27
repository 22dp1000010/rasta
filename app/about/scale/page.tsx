import { ButtonLink } from "@/ui/ButtonLink";

export default function ScalePage() {
  return (
    <section className="section">
      <p className="eyebrow">Safe scale plan</p>
      <h1>How this could work beyond a demo</h1>
      <div className="grid-2">
        <div className="panel">
          <h2>Backend shape</h2>
          <ul>
            <li>Use approved public sandboxes or formal integrations only.</li>
            <li>Keep model calls behind a server adapter with redaction, timeout and fallback.</li>
            <li>Store citizen drafts separately from official records until the citizen sends.</li>
          </ul>
        </div>
        <div className="panel">
          <h2>Failure modes named upfront</h2>
          <ul>
            <li>Bad classification must ask a clarifying question instead of guessing.</li>
            <li>Missing evidence should never become a dead end.</li>
            <li>Compliance score must never block a dispute.</li>
          </ul>
        </div>
      </div>
      <div className="actions"><ButtonLink href="/">Return to demo</ButtonLink></div>
    </section>
  );
}
