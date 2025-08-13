import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationsEndpoints } from "../../api/endpoints/medications";
import type {
  UpdateMedicationData,
  MedicationsResponse,
  Medication,
} from "../../types/api";
import { queryKeys, queryKeyUtils } from "../../utils/queryKeys";

export const useUpdateMedication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationData: UpdateMedicationData) =>
      medicationsEndpoints.updateMedication(medicationData),
    onMutate: async (medicationData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.medications.byPatient(medicationData.patient_id),
      });

      // Snapshot the previous value
      const previousMedications = queryClient.getQueryData<MedicationsResponse>(
        queryKeys.medications.byPatient(medicationData.patient_id)
      );

      // Optimistically update to the new value
      if (previousMedications) {
        queryClient.setQueryData(
          queryKeys.medications.byPatient(medicationData.patient_id),
          (old: MedicationsResponse | undefined) => {
            if (old && Array.isArray(old.medications)) {
              return {
                ...old,
                medications: old.medications.map((med: Medication) =>
                  med.medicationId === medicationData.medication_id
                    ? {
                        ...med,
                        name: medicationData.name,
                        genericName: medicationData.generic_name,
                        strength: medicationData.strength,
                        unit: medicationData.unit,
                        form: medicationData.form,
                        dosageAmount: medicationData.dosage_amount,
                        frequencyPerDay: medicationData.frequency_per_day,
                        specialInstructions:
                          medicationData.special_instructions,
                        isActive: medicationData.is_active,
                        updatedAt: new Date().toISOString(),
                      }
                    : med
                ),
              };
            }
            return old;
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousMedications };
    },
    onError: (err, medicationData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMedications) {
        queryClient.setQueryData(
          queryKeys.medications.byPatient(medicationData.patient_id),
          context.previousMedications
        );
      }
    },
    onSettled: async (data, error, medicationData) => {
      // Always refetch after error or success
      const patientId = medicationData.patient_id;

      // Use the utility function to invalidate all patient-related queries
      await queryKeyUtils.invalidatePatientQueries(queryClient, patientId);

      // Force refetch of medication schedules to ensure immediate update
      await queryClient.refetchQueries({
        queryKey: queryKeys.medicationSchedules.byPatient(patientId),
      });
    },
  });
};
