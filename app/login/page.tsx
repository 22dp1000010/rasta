import { mockCredentials } from "@/lib/mock/credentials";
import { MockChip } from "@/ui/MockChip";

export default function LoginPage() {
  return (
    <section className="grid-2 section">
      <div className="panel">
        <p className="eyebrow">Optional demo login <MockChip /></p>
        <h1>No login needed for the main journey.</h1>
        <p>This page exists only so a submission form can include mock consumer credentials. The prototype does not contain a real account system.</p>
      </div>
      <div className="panel">
        <h2>Mock credentials</h2>
        <ul className="list">
          {mockCredentials.map((item) => (
            <li className="row" key={item.username}>
              <span><strong>{item.purpose}</strong><br /><span className="mono">{item.username}</span></span>
              <span className="mono">{item.password}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
