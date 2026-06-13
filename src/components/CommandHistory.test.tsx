import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import type { CommandEntry } from "../types";

// Mock framer-motion to avoid animation-related issues in jsdom
vi.mock("framer-motion", () => ({
  motion: {
    span: ({
      children,
      animate,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement> & { animate?: Record<string, unknown> }) => (
      <span data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </span>
    ),
    div: ({
      children,
      animate,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { animate?: Record<string, unknown> }) => (
      <div data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </div>
    ),
    button: ({
      children,
      animate,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { animate?: Record<string, unknown> }) => (
      <button data-animate={JSON.stringify(animate)} {...rest}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { CommandHistory } from "./CommandHistory";

describe("CommandHistory", () => {
  it("shows placeholder text when entries is empty", () => {
    render(<CommandHistory entries={[]} />);
    expect(
      screen.getByText("No commands yet. Start listening to control your home.")
    ).toBeInTheDocument();
  });

  it("does not show placeholder when entries are present", () => {
    const entries: CommandEntry[] = [
      { id: "1", text: "turn on light", timestamp: "12:00:00", status: "matched" },
    ];
    render(<CommandHistory entries={entries} />);
    expect(
      screen.queryByText("No commands yet. Start listening to control your home.")
    ).not.toBeInTheDocument();
  });

  it("renders the most recent entry (index 0) at the top", () => {
    const entries: CommandEntry[] = [
      { id: "1", text: "most recent command", timestamp: "12:00:01", status: "matched" },
      { id: "2", text: "older command", timestamp: "12:00:00", status: "matched" },
    ];
    render(<CommandHistory entries={entries} />);

    // Get all entry text spans (they are inside the scrollable list, not the heading)
    const mostRecent = screen.getByText("most recent command");
    const older = screen.getByText("older command");

    // The most recent entry should appear before the older one in the DOM
    expect(
      mostRecent.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("renders timestamp in HH:MM:SS format", () => {
    const entries: CommandEntry[] = [
      { id: "1", text: "turn on fan", timestamp: "14:35:07", status: "matched" },
    ];
    render(<CommandHistory entries={entries} />);
    expect(screen.getByText("14:35:07")).toBeInTheDocument();
  });

  it("renders multiple entries", () => {
    const entries: CommandEntry[] = [
      { id: "1", text: "turn on light", timestamp: "12:00:01", status: "matched" },
      { id: "2", text: "open door", timestamp: "12:00:00", status: "matched" },
    ];
    render(<CommandHistory entries={entries} />);
    expect(screen.getByText("turn on light")).toBeInTheDocument();
    expect(screen.getByText("open door")).toBeInTheDocument();
  });

  it("renders not_recognized entries", () => {
    const entries: CommandEntry[] = [
      { id: "1", text: "gibberish command", timestamp: "09:00:00", status: "not_recognized" },
    ];
    render(<CommandHistory entries={entries} />);
    expect(screen.getByText("gibberish command")).toBeInTheDocument();
  });
});
