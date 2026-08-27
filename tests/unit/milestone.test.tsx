import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";
import { MilestoneMarker } from "@/ui/MilestoneMarker";

describe("MilestoneMarker", () => {
  it("renders normal days", () => {
    render(<MilestoneMarker days={8} label="Days left to act" what="Act soon" severity="warn" />);
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("does not render negative visible days", () => {
    render(<MilestoneMarker days={-1} label="Days left" what="Act soon" severity="bad" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});
