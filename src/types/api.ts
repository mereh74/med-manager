export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt: string;
  updatedAt: string;
}

export interface PatientsResponse {
  message: string;
  count: number;
  patients: Patient[];
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export interface Medication {
  medicationId: string;
  patientId: string;
  name: string;
  genericName: string;
  strength: string;
  unit: string;
  form: string;
  dosageAmount: number;
  frequencyPerDay: number;
  specialInstructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationsResponse {
  message: string;
  count: number;
  medications: Medication[];
}

export interface CreateMedicationData {
  patient_id: string;
  name: string;
  generic_name: string;
  strength: string;
  unit: string;
  form: string;
  dosage_amount: number;
  frequency_per_day: number;
  special_instructions: string;
  is_active: boolean;
}

export interface UpdateMedicationData {
  medication_id: string;
  patient_id: string;
  name: string;
  generic_name: string;
  strength: string;
  unit: string;
  form: string;
  dosage_amount: number;
  frequency_per_day: number;
  is_active: boolean;
  special_instructions: string;
}

// Medication Schedule Types
export interface CreateMedicationScheduleData {
  medication_id: string;
  day_of_week: number;
  time_of_day: string;
  is_active: boolean;
}

export interface MedicationSchedule {
  scheduleId: string;
  dayOfWeek: number;
  timeOfDay: string;
  isActive: number;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationScheduleWithDetails extends MedicationSchedule {
  medication_id: string;
  medication_name: string;
  generic_name: string;
  strength: string;
  unit: string;
  form: string;
  dosage_amount: string;
  frequency_per_day: number;
  special_instructions: string;
}

export interface MedicationWithSchedules {
  medicationId: string;
  medicationName: string;
  genericName: string;
  strength: string;
  unit: string;
  form: string;
  dosageAmount: string;
  frequencyPerDay: number;
  specialInstructions: string;
  schedules: MedicationSchedule[];
}

export interface PatientScheduleSummary {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
}

export interface ScheduleSummary {
  total_schedules: number;
  active_schedules: number;
  inactive_schedules: number;
  medications_count: number;
  total_daily_doses: number;
}

export interface SchedulesByDay {
  [key: string]: MedicationScheduleWithDetails[];
}

export interface MedicationSchedulesResponse {
  message: string;
  patient: PatientScheduleSummary;
  summary: ScheduleSummary;
  schedulesByMedication: MedicationWithSchedules[];
  schedulesByDay: SchedulesByDay;
  allSchedules: MedicationScheduleWithDetails[];
  count: number;
}

// Medication Administration Types
export interface MedicationAdministration {
  medicationId: string;
  scheduledDateTime: Date;
  actualDateTime: Date;
  administeredBy: string;
  notes: string;
}

export interface CreateMedicationAdministrationData {
  medication_id: string;
  scheduled_datetime: string;
  actual_datetime: string;
  administered_by: string;
  notes: string;
}

export interface MedicationAdministrationResponse {
  administrationId: string;
  medicationId: string;
  scheduledDateTime: Date;
  actualDateTime: Date;
  administeredBy: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}
