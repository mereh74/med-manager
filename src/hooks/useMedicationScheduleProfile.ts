import { useQuery } from "@tanstack/react-query";
import { patientsEndpoints } from "../api/endpoints/patients";
import { createQueryKey } from "../utils/queryKeys";

export const useMedicationScheduleProfile = (patientId: string) => {
  const {
    data: schedulesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: createQueryKey.patient(patientId, "medicationSchedules"),
    queryFn: () => patientsEndpoints.getPatientMedicationSchedules(patientId),
  });

  // Debug logging
  console.log("useMedicationScheduleProfile - patientId:", patientId);
  console.log("useMedicationScheduleProfile - schedulesData:", schedulesData);
  console.log("useMedicationScheduleProfile - isLoading:", isLoading);
  console.log("useMedicationScheduleProfile - error:", error);

  return { schedulesData, isLoading, error };
};
