import React from "react";
import type { Severity } from "@/lib/domain/types";

export function MilestoneMarker({ days, label, what, severity }: { days: number; label: string; what: string; severity: Severity }) {
  return (
    <div className={`milestone ${severity}`} aria-live="polite">
      <strong>{days < 0 ? "0" : days}</strong>
      <span>{label}</span>
      <small>{days < 0 ? "Expired" : what}</small>
    </div>
  );
}
