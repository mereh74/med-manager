import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationsEndpoints } from "../../api/endpoints/medications";
import type {
  CreateMedicationData,
  MedicationsResponse,
} from "../../types/api";
import { queryKeys, queryKeyUtils } from "../../utils/queryKeys";

export const useCreateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMedicationData: CreateMedicationData) =>
      medicationsEndpoints.createMedication(newMedicationData),
    onMutate: async (newMedicationData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.medications.byPatient(newMedicationData.patient_id),
      });

      // Snapshot the previous value
      const previousMedications = queryClient.getQueryData<MedicationsResponse>(
        queryKeys.medications.byPatient(newMedicationData.patient_id)
      );

      // Optimistically update to the new value
      if (previousMedications) {
        queryClient.setQueryData(
          queryKeys.medications.byPatient(newMedicationData.patient_id),
          (old: MedicationsResponse | undefined) => {
            if (old && Array.isArray(old.medications)) {
              return {
                ...old,
                medications: [
                  ...old.medications,
                  {
                    medication_id: `temp-${Date.now()}`,
                    patient_id: newMedicationData.patient_id,
                    name: newMedicationData.name,
                    generic_name: newMedicationData.generic_name,
                    strength: newMedicationData.strength,
                    unit: newMedicationData.unit,
                    form: newMedicationData.form,
                    dosage_amount: newMedicationData.dosage_amount,
                    frequency_per_day: newMedicationData.frequency_per_day,
                    special_instructions:
                      newMedicationData.special_instructions,
                    is_active: newMedicationData.is_active,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  },
                ],
              };
            }
            return old;
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousMedications };
    },
    onError: (err, newMedicationData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMedications) {
        queryClient.setQueryData(
          queryKeys.medications.byPatient(newMedicationData.patient_id),
          context.previousMedications
        );
      }
    },
    onSettled: async (data, error, variables) => {
      // Always refetch after error or success
      const patientId = variables.patient_id;

      // Use the utility function to invalidate all patient-related queries
      await queryKeyUtils.invalidatePatientQueries(queryClient, patientId);
    },
  });
};
