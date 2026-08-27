import Link from "next/link";

export function DisclosureBar() {
  return (
    <aside className="disclosure" aria-label="Prototype disclosure">
      <strong>Independent hackathon prototype.</strong>
      <span>Not a government service. All vehicles, challans, documents and rewards shown here are fictional.</span>
      <Link href="/about/honesty">What&apos;s real and what&apos;s mocked -&gt;</Link>
    </aside>
  );
}
