import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LightCard } from "./LightCard";

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

import React from "react";

describe("LightCard", () => {
  it("shows status OFF on initial mount when isOn=false", () => {
    render(<LightCard isOn={false} />);
    const status = screen.getByTestId("light-status");
    expect(status.textContent).toBe("OFF");
  });

  it("has no glow filter when isOn=false", () => {
    render(<LightCard isOn={false} />);
    // The motion.span renders with data-animate containing the animate prop
    const bulb = document.querySelector("[data-animate]");
    expect(bulb).not.toBeNull();
    const animateData = JSON.parse(bulb!.getAttribute("data-animate") || "{}");
    // When OFF, filter should be the no-glow value
    expect(animateData.filter).toContain("0px");
  });

  it("has glow animation props when isOn=true", () => {
    render(<LightCard isOn={true} />);
    const bulb = document.querySelector("[data-animate]");
    expect(bulb).not.toBeNull();
    const animateData = JSON.parse(bulb!.getAttribute("data-animate") || "{}");
    // When ON, filter should contain the amber glow
    expect(animateData.filter).toContain("12px");
    expect(animateData.filter).toContain("#fbbf24");
  });

  it("shows status ON when isOn=true", () => {
    render(<LightCard isOn={true} />);
    const status = screen.getByTestId("light-status");
    expect(status.textContent).toBe("ON");
  });

  it("toggle button is disabled when onToggle is not provided", () => {
    render(<LightCard isOn={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("toggle button is enabled when onToggle is provided", () => {
    render(<LightCard isOn={false} onToggle={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled();
  });
});
