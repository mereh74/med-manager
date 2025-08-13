import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationAdministrationEndpoints } from "../../api/endpoints/medication-administrations";
import type {
  CreateMedicationAdministrationData,
  MedicationAdministrationResponse,
} from "../../types/api";
import { queryKeys } from "../../utils/queryKeys";

export const useCreateMedicationAdministration = (patientId: string) => {
  const queryClient = useQueryClient();

  const queryKey = queryKeys.medicationAdministrations.byPatient(patientId);

  return useMutation({
    mutationFn: (administrationData: CreateMedicationAdministrationData) =>
      medicationAdministrationEndpoints.createMedicationAdministration(
        administrationData
      ),
    onMutate: async (administrationData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey,
      });

      // Snapshot the previous value
      const previousAdministrations =
        queryClient.getQueryData<MedicationAdministrationResponse[]>(queryKey);

      // Optimistically update to the new value
      if (previousAdministrations) {
        const optimisticUpdate = {
          administrationId: `temp-${Date.now()}`,
          medicationId: administrationData.medication_id,
          scheduledDateTime: new Date(administrationData.scheduled_datetime),
          actualDateTime: new Date(administrationData.actual_datetime),
          administeredBy: administrationData.administered_by,
          notes: administrationData.notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as MedicationAdministrationResponse;

        queryClient.setQueryData(
          queryKey,
          (old: MedicationAdministrationResponse[] | undefined) => {
            if (old && Array.isArray(old)) {
              return [...old, optimisticUpdate];
            }
            return old;
          }
        );
      }

      // Return a context object with the snapshotted value
      return { previousAdministrations };
    },
    onError: (err, administrationData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousAdministrations) {
        queryClient.setQueryData(queryKey, context.previousAdministrations);
      }
    },
    onSettled: async () => {
      // Always refetch after error or success
      await queryClient.invalidateQueries({
        queryKey,
      });

      // Force refetch to ensure immediate update
      await queryClient.refetchQueries({
        queryKey,
      });
    },
  });
};
