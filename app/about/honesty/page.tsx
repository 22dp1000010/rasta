import { ButtonLink } from "@/ui/ButtonLink";

export default function HonestyPage() {
  return (
    <>
      <section className="section">
        <p className="eyebrow">Honesty page</p>
        <h1>What is real and what is mocked</h1>
        <div className="grid-3">
          <div className="card"><h3>Real</h3><p>The citizen journey, validation, offline classification, draft editing, print flow, deadline display and status simulation work in the browser.</p></div>
          <div className="card"><h3>Mocked</h3><p>All vehicles, challans, owners, evidence images, rewards, accounts and backend responses are fictional synthetic data.</p></div>
          <div className="card"><h3>Not used</h3><p>No live government site, payment gateway, real user data, OTP, official mark, Aadhaar, PAN or private identifier is used.</p></div>
        </div>
      </section>
      <section className="panel section">
        <h2>Why this matters</h2>
        <p>The prototype does not pretend to be an authority. It helps a citizen understand choices before acting, especially when the default action hides consequences.</p>
        <ButtonLink href="/">Return to demo</ButtonLink>
      </section>
    </>
  );
}
