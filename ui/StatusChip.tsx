import type { Severity } from "@/lib/domain/types";

export function StatusChip({ children, severity = "good" }: { children: React.ReactNode; severity?: Severity }) {
  return <span className={`status-chip ${severity}`}>{children}</span>;
}
