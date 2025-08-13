import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { PatientProvider } from "../contexts/PatientContext";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PatientProvider>{children}</PatientProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };

// Mock data for tests
export const mockPatient = {
  patientId: "test-patient-id",
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  email: "john.doe@example.com",
  phone: "555-1234",
  address: "123 Main St",
  city: "Anytown",
  state: "CA",
  zipCode: "12345",
};

export const mockMedication = {
  medicationId: "test-medication-id",
  patientId: "test-patient-id",
  name: "Test Medication",
  genericName: "Test Generic",
  strength: "10",
  unit: "mg",
  form: "tablet",
  dosageAmount: "1.00",
  frequencyPerDay: 1,
  isActive: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

export const mockMedicationSchedule = {
  scheduleId: "test-schedule-id",
  medicationId: "test-medication-id",
  patientId: "test-patient-id",
  dayOfWeek: 1,
  timeOfDay: "08:00:00",
  isActive: 1,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

export const mockMedicationAdministration = {
  administrationId: "test-administration-id",
  medicationId: "test-medication-id",
  scheduledDateTime: "2025-01-01T08:00:00.000Z",
  actualDateTime: "2025-01-01T08:15:00.000Z",
  administeredBy: "Nurse",
  notes: "Patient took medication",
  createdAt: "2025-01-01T08:15:00.000Z",
  updatedAt: "2025-01-01T08:15:00.000Z",
};
