import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/test-utils";
import ErrorMessage from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message correctly", () => {
    const errorMessage = "This is a test error message";
    render(<ErrorMessage message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    const errorMessage = "Test error";
    const customClass = "custom-error-class";

    render(<ErrorMessage message={errorMessage} className={customClass} />);

    const errorElement = screen
      .getByText(errorMessage)
      .closest(".error-container");
    expect(errorElement).toHaveClass(customClass);
  });

  it("renders without className when not provided", () => {
    const errorMessage = "Test error";

    render(<ErrorMessage message={errorMessage} />);

    const errorElement = screen
      .getByText(errorMessage)
      .closest(".error-container");
    expect(errorElement).toHaveClass("error-container");
  });

  it("handles empty message", () => {
    render(<ErrorMessage message="" />);

    // Find the error container by its class
    const errorContainer = document.querySelector(".error-container");
    expect(errorContainer).toBeInTheDocument();

    // Check that the error message paragraph exists but has no content
    const errorMessage = errorContainer?.querySelector(".error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("");
  });
});
