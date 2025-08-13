import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMedicationAdministrations } from "./useMedicationAdministrations";
import { mockMedicationAdministration } from "../../test/test-utils";

// Mock the medication administration endpoints
vi.mock("../../api/endpoints/medication-administrations", () => ({
  medicationAdministrationEndpoints: {
    getPatientMedicationAdministrations: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMedicationAdministrations", () => {
  const mockGetPatientMedicationAdministrations = vi.mocked(
    require("../../api/endpoints/medication-administrations")
      .medicationAdministrationEndpoints.getPatientMedicationAdministrations
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches medication administrations successfully", async () => {
    const mockData = [mockMedicationAdministration];
    mockGetPatientMedicationAdministrations.mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useMedicationAdministrations("test-patient-id"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.administrations).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it("handles empty administrations array", async () => {
    mockGetPatientMedicationAdministrations.mockResolvedValue([]);

    const { result } = renderHook(
      () => useMedicationAdministrations("test-patient-id"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.administrations).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("handles API errors", async () => {
    const mockError = new Error("API Error");
    mockGetPatientMedicationAdministrations.mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useMedicationAdministrations("test-patient-id"),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.administrations).toEqual([]);
    expect(result.current.error).toBeDefined();
  });

  it("returns empty array when patientId is empty", () => {
    const { result } = renderHook(() => useMedicationAdministrations(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.administrations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("calls API with correct patientId", async () => {
    mockGetPatientMedicationAdministrations.mockResolvedValue([]);

    renderHook(() => useMedicationAdministrations("test-patient-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetPatientMedicationAdministrations).toHaveBeenCalledWith(
        "test-patient-id"
      );
    });
  });
});
