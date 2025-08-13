import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { AddMedicationForm } from "./AddMedicationForm";

// Mock the useCreateMedication hook
vi.mock("../../hooks/mutations/useCreateMedication", () => ({
  useCreateMedication: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("AddMedicationForm", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn().mockResolvedValue({});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    render(
      <AddMedicationForm
        patientId="test-patient-id"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/medication name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/generic name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/strength/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dosage amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/times per day/i)).toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    const user = userEvent.setup();

    render(
      <AddMedicationForm
        patientId="test-patient-id"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    // Fill out the form
    await user.type(
      screen.getByLabelText(/medication name/i),
      "Test Medication"
    );
    await user.type(screen.getByLabelText(/generic name/i), "Test Generic");
    await user.type(screen.getByLabelText(/strength/i), "10");
    await user.selectOptions(screen.getByLabelText(/unit/i), "mg");
    await user.selectOptions(screen.getByLabelText(/form/i), "tablet");
    await user.type(screen.getByLabelText(/dosage amount/i), "1");
    await user.type(screen.getByLabelText(/times per day/i), "2");

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /add medication/i,
    });
    await user.click(submitButton);

    // Verify form submission
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("closes modal when cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <AddMedicationForm
        patientId="test-patient-id"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();

    render(
      <AddMedicationForm
        patientId="test-patient-id"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    // Try to submit without filling required fields
    const submitButton = screen.getByRole("button", {
      name: /add medication/i,
    });
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(
        screen.getByText(/medication name is required/i)
      ).toBeInTheDocument();
    });
  });

  it("shows submitting state when isSubmitting is true", () => {
    render(
      <AddMedicationForm
        patientId="test-patient-id"
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    );

    expect(screen.getByRole("button", { name: /adding/i })).toBeInTheDocument();
  });
});
