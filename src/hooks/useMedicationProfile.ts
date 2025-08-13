import { useCallback } from "react";
import { useMedications } from "./queries/useMedications";
import { useCreateMedication } from "./mutations/useCreateMedication";
import type { CreateMedicationData } from "../types/api";

export const useMedicationProfile = (patientId: string) => {
  const medicationsQuery = useMedications(patientId);
  const createMedicationMutation = useCreateMedication();

  const updateMedication = useCallback(
    (data: CreateMedicationData) => {
      return createMedicationMutation.mutateAsync({
        ...data,
      });
    },
    [createMedicationMutation]
  );

  return {
    medications: medicationsQuery.data,
    isLoading: medicationsQuery.isLoading,
    error: medicationsQuery.error,
    updateMedication,
    isUpdatingMedication: createMedicationMutation.isPending,
  };
};
