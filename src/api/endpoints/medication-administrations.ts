import { apiClient } from "../clients/apiClient";
import type {
  CreateMedicationAdministrationData,
  MedicationAdministrationResponse,
} from "../../types/api";

export const medicationAdministrationEndpoints = {
  // POST /medication-administrations
  createMedicationAdministration: async (
    administrationData: CreateMedicationAdministrationData
  ): Promise<MedicationAdministrationResponse> => {
    const response = await apiClient.post(
      `/medication-administrations`,
      administrationData
    );
    return response.json();
  },

  // GET /patients/{patientId}/medication-administrations
  getPatientMedicationAdministrations: async (
    patientId: string
  ): Promise<MedicationAdministrationResponse[]> => {
    try {
      const endpoint = `/patients/${patientId}/medication-administrations`;

      const response = await apiClient.get(endpoint);
      const data = await response.json();

      // Extract the administrations array from the response
      const administrations = data.administrations;

      // Return the administrations array, not the full response
      return Array.isArray(administrations) ? administrations : [];
    } catch (error) {
      console.error("medication-administrations API - Error occurred:", error);
      throw error;
    }
  },
};
