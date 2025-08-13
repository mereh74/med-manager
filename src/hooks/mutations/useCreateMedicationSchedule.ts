import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationSchedulesEndpoints } from "../../api/endpoints/medication-schedules";
import type { CreateMedicationScheduleData } from "../../types/api";
import { queryKeys, queryKeyUtils } from "../../utils/queryKeys";

export const useCreateMedicationSchedule = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedules: CreateMedicationScheduleData[]) => {
      console.log(
        "useCreateMedicationSchedule - Received schedules:",
        schedules
      );
      console.log(
        "useCreateMedicationSchedule - Each schedule medication_id:",
        schedules.map((s) => s.medication_id)
      );
      return medicationSchedulesEndpoints.createMedicationSchedulesBulk(
        schedules
      );
    },
    onMutate: async (schedules) => {
      const medicationId = schedules[0]?.medication_id;
      if (!medicationId) return;

      // Cancel any outgoing refetches using utility functions
      await queryKeyUtils.cancelPatientQueries(queryClient, patientId);
      await queryClient.cancelQueries({
        queryKey: queryKeys.medicationSchedules.byMedication(medicationId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.medicationSchedules.all,
      });

      // Snapshot the previous values
      const previousMedicationSchedules = queryClient.getQueryData(
        queryKeys.medicationSchedules.byMedication(medicationId)
      );
      const previousAllSchedules = queryClient.getQueryData(
        queryKeys.medicationSchedules.all
      );
      const previousPatientSchedules = queryClient.getQueryData(
        queryKeys.medicationSchedules.byPatient(patientId)
      );

      // Return a context object with the snapshotted values
      return {
        previousMedicationSchedules,
        previousAllSchedules,
        previousPatientSchedules,
      };
    },
    onError: (err, schedules, context) => {
      const medicationId = schedules[0]?.medication_id;
      if (!medicationId) return;

      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMedicationSchedules) {
        queryClient.setQueryData(
          queryKeys.medicationSchedules.byMedication(medicationId),
          context.previousMedicationSchedules
        );
      }
      if (context?.previousAllSchedules) {
        queryClient.setQueryData(
          queryKeys.medicationSchedules.all,
          context.previousAllSchedules
        );
      }
      if (context?.previousPatientSchedules) {
        queryClient.setQueryData(
          queryKeys.medicationSchedules.byPatient(patientId),
          context.previousPatientSchedules
        );
      }
    },
    onSettled: async (data, error, schedules) => {
      const medicationId = schedules[0]?.medication_id;
      if (!medicationId) return;

      // Always refetch after error or success
      await queryClient.invalidateQueries({
        queryKey: queryKeys.medicationSchedules.byMedication(medicationId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.medicationSchedules.all,
      });

      // Use utility function to invalidate all patient-related queries
      await queryKeyUtils.invalidatePatientQueries(queryClient, patientId);

      // Force refetch of patient medication schedules to ensure immediate update
      await queryKeyUtils.refetchPatientQueries(queryClient, patientId);
    },
  });
};
