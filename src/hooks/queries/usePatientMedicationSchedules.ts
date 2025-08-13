import { useQuery } from "@tanstack/react-query";
import { patientsEndpoints } from "../../api/endpoints/patients";
import { createQueryKey } from "../../utils/queryKeys";

export const usePatientMedicationSchedules = (patientId: string) => {
  return useQuery({
    queryKey: createQueryKey.patient(patientId, "medicationSchedules"),
    queryFn: () => patientsEndpoints.getPatientMedicationSchedules(patientId),
  });
};
