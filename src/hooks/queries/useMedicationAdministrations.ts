import { useQuery } from "@tanstack/react-query";
import { medicationAdministrationEndpoints } from "../../api/endpoints/medication-administrations";
import { createQueryKey } from "../../utils/queryKeys";

export const useMedicationAdministrations = (patientId: string) => {
  const queryResult = useQuery({
    queryKey: createQueryKey.patient(patientId, "medicationAdministrations"),
    queryFn: async () => {
      const result =
        await medicationAdministrationEndpoints.getPatientMedicationAdministrations(
          patientId
        );
      return result;
    },
    enabled: !!patientId && patientId.length > 0,
  });

  const { data: administrations, isLoading, error } = queryResult;

  return {
    administrations: administrations || [],
    isLoading,
    error,
  };
};
