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

import { FanCard } from "./FanCard";

describe("FanCard", () => {
  it("shows status OFF on initial render when isOn=false", () => {
    render(<FanCard isOn={false} />);
    const status = screen.getByTestId("fan-status");
    expect(status.textContent).toBe("OFF");
  });

  it("has no rotation (rotate=0) when isOn=false", () => {
    render(<FanCard isOn={false} />);
    const fanIcon = document.querySelector("[data-animate]");
    expect(fanIcon).not.toBeNull();
    const animateData = JSON.parse(fanIcon!.getAttribute("data-animate") || "{}");
    expect(animateData.rotate).toBe(0);
  });

  it("has rotation animation (rotate=360) when isOn=true", () => {
    render(<FanCard isOn={true} />);
    const fanIcon = document.querySelector("[data-animate]");
    expect(fanIcon).not.toBeNull();
    const animateData = JSON.parse(fanIcon!.getAttribute("data-animate") || "{}");
    expect(animateData.rotate).toBe(360);
  });

  it("shows status ON when isOn=true", () => {
    render(<FanCard isOn={true} />);
    const status = screen.getByTestId("fan-status");
    expect(status.textContent).toBe("ON");
  });

  it("toggle button is disabled when onToggle is not provided", () => {
    render(<FanCard isOn={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("toggle button is enabled when onToggle is provided", () => {
    render(<FanCard isOn={false} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });
});
