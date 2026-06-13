import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";

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

import { DoorCard } from "./DoorCard";

describe("DoorCard", () => {
  it("shows status CLOSED on initial render when isOpen=false", () => {
    render(<DoorCard isOpen={false} />);
    const status = screen.getByTestId("door-status");
    expect(status.textContent).toBe("CLOSED");
  });

  it("has rotateY=0 (closed position) when isOpen=false", () => {
    render(<DoorCard isOpen={false} />);
    const doorPanel = document.querySelector("[data-animate]");
    expect(doorPanel).not.toBeNull();
    const animateData = JSON.parse(doorPanel!.getAttribute("data-animate") || "{}");
    expect(animateData.rotateY).toBe(0);
  });

  it("has rotateY=-75 when isOpen=true", () => {
    render(<DoorCard isOpen={true} />);
    const doorPanel = document.querySelector("[data-animate]");
    expect(doorPanel).not.toBeNull();
    const animateData = JSON.parse(doorPanel!.getAttribute("data-animate") || "{}");
    expect(animateData.rotateY).toBe(-75);
  });

  it("shows status OPEN when isOpen=true", () => {
    render(<DoorCard isOpen={true} />);
    const status = screen.getByTestId("door-status");
    expect(status.textContent).toBe("OPEN");
  });

  it("toggle button is disabled when onToggle is not provided", () => {
    render(<DoorCard isOpen={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("toggle button is enabled when onToggle is provided", () => {
    render(<DoorCard isOpen={false} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });
});
