import { useQuery } from "@tanstack/react-query";
import { patientsEndpoints } from "../../api/endpoints/patients";
import { createQueryKey } from "../../utils/queryKeys";

export const useMedications = (patientId: string) => {
  return useQuery({
    queryKey: createQueryKey.patient(patientId, "medications"),
    queryFn: () => patientsEndpoints.getPatientMedications(patientId),
  });
};
