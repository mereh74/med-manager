import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test/test-utils";
import { PatientProvider, usePatientContext } from "./PatientContext";
import { mockPatient } from "../test/test-utils";

// Test component that uses the context
const TestComponent = () => {
  const { currentPatient, setCurrentPatient } = usePatientContext();

  return (
    <div>
      <div data-testid="current-patient">
        {currentPatient
          ? `${currentPatient.firstName} ${currentPatient.lastName}`
          : "No patient selected"}
      </div>
      <button
        onClick={() => setCurrentPatient(mockPatient)}
        data-testid="set-patient-button"
      >
        Set Patient
      </button>
      <button
        onClick={() => setCurrentPatient(null)}
        data-testid="clear-patient-button"
      >
        Clear Patient
      </button>
    </div>
  );
};

describe("PatientContext", () => {
  it("provides initial state", () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    expect(screen.getByTestId("current-patient")).toHaveTextContent(
      "No patient selected"
    );
  });

  it("allows setting current patient", () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    const setPatientButton = screen.getByTestId("set-patient-button");
    fireEvent.click(setPatientButton);

    expect(screen.getByTestId("current-patient")).toHaveTextContent("John Doe");
  });

  it("allows clearing current patient", () => {
    render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    // First set a patient
    const setPatientButton = screen.getByTestId("set-patient-button");
    fireEvent.click(setPatientButton);
    expect(screen.getByTestId("current-patient")).toHaveTextContent("John Doe");

    // Then clear the patient
    const clearPatientButton = screen.getByTestId("clear-patient-button");
    fireEvent.click(clearPatientButton);
    expect(screen.getByTestId("current-patient")).toHaveTextContent(
      "No patient selected"
    );
  });

  it("maintains state across re-renders", () => {
    const { rerender } = render(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    // Set a patient
    const setPatientButton = screen.getByTestId("set-patient-button");
    fireEvent.click(setPatientButton);
    expect(screen.getByTestId("current-patient")).toHaveTextContent("John Doe");

    // Re-render the component
    rerender(
      <PatientProvider>
        <TestComponent />
      </PatientProvider>
    );

    // State should persist
    expect(screen.getByTestId("current-patient")).toHaveTextContent("John Doe");
  });
});
