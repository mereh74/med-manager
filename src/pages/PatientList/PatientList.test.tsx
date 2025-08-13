import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import { PatientList } from "./PatientList";
import { mockPatient } from "../../test/test-utils";

// Mock the usePatients hook
vi.mock("../../hooks/queries/usePatients", () => ({
  usePatients: () => ({
    patients: [mockPatient],
    isLoading: false,
    error: null,
  }),
}));

// Mock the usePatientContext hook
vi.mock("../../contexts/PatientContext", () => ({
  usePatientContext: () => ({
    currentPatient: null,
    setCurrentPatient: vi.fn(),
  }),
}));

describe("PatientList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders patient list correctly", async () => {
    render(<PatientList />);

    await waitFor(() => {
      expect(screen.getByText(/patients/i)).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("displays patient information correctly", async () => {
    render(<PatientList />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
      expect(screen.getByText("555-1234")).toBeInTheDocument();
    });
  });

  it("shows view medications button for each patient", async () => {
    render(<PatientList />);

    await waitFor(() => {
      const viewMedicationsButton = screen.getByRole("button", {
        name: /view medications/i,
      });
      expect(viewMedicationsButton).toBeInTheDocument();
    });
  });

  it("shows view schedule button for each patient", async () => {
    render(<PatientList />);

    await waitFor(() => {
      const viewScheduleButton = screen.getByRole("button", {
        name: /view schedule/i,
      });
      expect(viewScheduleButton).toBeInTheDocument();
    });
  });

  it("handles loading state", () => {
    // Mock loading state
    vi.mocked(
      require("../../hooks/queries/usePatients").usePatients
    ).mockReturnValue({
      patients: [],
      isLoading: true,
      error: null,
    });

    render(<PatientList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("handles error state", () => {
    // Mock error state
    vi.mocked(
      require("../../hooks/queries/usePatients").usePatients
    ).mockReturnValue({
      patients: [],
      isLoading: false,
      error: "Failed to fetch patients",
    });

    render(<PatientList />);

    expect(screen.getByText(/failed to fetch patients/i)).toBeInTheDocument();
  });

  it("handles empty patient list", () => {
    // Mock empty state
    vi.mocked(
      require("../../hooks/queries/usePatients").usePatients
    ).mockReturnValue({
      patients: [],
      isLoading: false,
      error: null,
    });

    render(<PatientList />);

    expect(screen.getByText(/no patients found/i)).toBeInTheDocument();
  });
});
