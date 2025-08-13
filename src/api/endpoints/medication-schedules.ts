import { apiClient } from "../clients/apiClient";
import type {
  CreateMedicationScheduleData,
  MedicationSchedule,
} from "../../types/api";

export const medicationSchedulesEndpoints = {
  // POST /medication-schedules
  createMedicationSchedule: async (
    scheduleData: CreateMedicationScheduleData
  ): Promise<MedicationSchedule> => {
    const response = await apiClient.post(
      `/medication-schedules`,
      scheduleData
    );
    return response.json();
  },

  // POST /medication-schedules/bulk
  createMedicationSchedulesBulk: async (
    schedulesData: CreateMedicationScheduleData[]
  ): Promise<MedicationSchedule[]> => {
    console.log(
      "medication-schedules API - Sending schedules data:",
      schedulesData
    );
    console.log(
      "medication-schedules API - Each schedule medication_id:",
      schedulesData.map((s) => s.medication_id)
    );

    const payload = { schedules: schedulesData };
    console.log("medication-schedules API - Final payload:", payload);

    const response = await apiClient.post(
      `/medication-schedules/bulk`,
      payload
    );
    return response.json();
  },
};
