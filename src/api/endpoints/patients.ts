import { apiClient } from "../clients/apiClient";
import type {
  Patient,
  CreatePatientData,
  PatientsResponse,
  MedicationsResponse,
  MedicationSchedulesResponse,
} from "../../types/api";

export const patientsEndpoints = {
  // GET /patients
  getPatients: async (): Promise<PatientsResponse> => {
    const response = await apiClient.get("/patients");
    return response.json();
  },

  // GET /patients/:id
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.json();
  },

  // POST /patients
  createPatient: async (patientData: CreatePatientData): Promise<Patient> => {
    const response = await apiClient.post("/patients", patientData);
    return response.json();
  },

  // GET /patients/:id/medications
  getPatientMedications: async (
    patientId: string
  ): Promise<MedicationsResponse> => {
    const response = await apiClient.get(`/patients/${patientId}/medications`);
    return response.json();
  },

  // GET /patients/:id/medication-schedules
  getPatientMedicationSchedules: async (
    patientId: string
  ): Promise<MedicationSchedulesResponse> => {
    const response = await apiClient.get(
      `/patients/${patientId}/medication-schedules`
    );
    return response.json();
  },
};
