import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { DisclosureBar } from "@/ui/DisclosureBar";

export const metadata: Metadata = {
  title: "Rasta - Vehicle Compliance Passport",
  description: "Independent hackathon prototype for disputing wrong traffic challans with fictional data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <DisclosureBar />
        <header className="topbar">
          <Link className="brand" href="/">
            <span className="brand-mark">R</span>
            <span>
              <strong>Rasta</strong>
              <small>Know where you stand with your vehicle.</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link href="/">Lookup</Link>
            <Link href="/about/honesty">Honesty</Link>
            <Link href="/about/scale">Scale</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
