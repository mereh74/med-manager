import { useQuery } from "@tanstack/react-query";
import { patientsEndpoints } from "../../api/endpoints/patients";
import { createQueryKey } from "../../utils/queryKeys";

export const usePatients = () => {
  return useQuery({
    queryKey: createQueryKey.entity("patients"),
    queryFn: patientsEndpoints.getPatients,
  });
};
