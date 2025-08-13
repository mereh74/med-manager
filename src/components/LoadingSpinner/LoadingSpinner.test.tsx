import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders loading spinner correctly", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByText("Loading...");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveTextContent("Loading...");
  });

  it("renders with custom message", () => {
    const customMessage = "Please wait...";
    render(<LoadingSpinner message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("renders with custom size", () => {
    const customSize = "large";
    render(<LoadingSpinner size={customSize} />);

    const spinner = screen
      .getByText("Loading...")
      .closest(".loading-container")
      ?.querySelector(".spinner");
    expect(spinner).toHaveClass(`spinner-${customSize}`);
  });

  it("renders with custom className", () => {
    const customClass = "custom-spinner";
    render(<LoadingSpinner className={customClass} />);

    const spinner = screen
      .getByText("Loading...")
      .closest(".loading-container");
    expect(spinner).toHaveClass(customClass);
  });

  it("has correct accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen
      .getByText("Loading...")
      .closest(".loading-container");
    expect(spinner).toBeInTheDocument();
  });
});
