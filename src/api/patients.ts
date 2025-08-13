import { apiClient } from "./clients/apiClient";
import type { CreatePatientData } from "../types/api";

export const patientsAPI = {
  getAll: () => apiClient.get("/patients"),
  getById: (id: string) => apiClient.get(`/patients/${id}`),
  create: (patientData: CreatePatientData) =>
    apiClient.post("/patients", patientData),
  getMedications: (patientId: string) =>
    apiClient.get(`/patients/${patientId}/medications`),
};
