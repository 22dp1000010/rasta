import Link from "next/link";

export function ButtonLink({ href, children, tone = "primary" }: { href: string; children: React.ReactNode; tone?: "primary" | "ghost" | "danger" }) {
  return (
    <Link className={`button ${tone}`} href={href as never}>
      {children}
    </Link>
  );
}
