import { apiClient } from "../clients/apiClient";
import type {
  CreateMedicationData,
  Medication,
  UpdateMedicationData,
} from "../../types/api";

export const medicationsEndpoints = {
  // POST /medications
  createMedication: async (
    medicationData: CreateMedicationData
  ): Promise<Medication> => {
    const response = await apiClient.post(`/medications`, medicationData);
    return response.json();
  },

  // PUT /medications/:id
  updateMedication: async (
    medicationData: UpdateMedicationData
  ): Promise<Medication> => {
    const response = await apiClient.put(
      `/medications/${medicationData.medication_id}`,
      medicationData
    );
    return response.json();
  },
};
