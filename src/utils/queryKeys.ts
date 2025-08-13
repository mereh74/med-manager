// Type-safe query key factory
type QueryKeyFactory<T extends string> = {
  all: readonly [T];
  byPatient: (patientId: string) => readonly [string, T];
  byId?: (id: string) => readonly [string, T];
  byMedication?: (medicationId: string) => readonly [string, T];
};

// Base query key constants for consistency
const ENTITIES = {
  PATIENTS: "patients",
  MEDICATIONS: "medications",
  MEDICATION_SCHEDULES: "medication-schedules",
  MEDICATION_ADMINISTRATIONS: "medication-administrations",
} as const;

// Type-safe query keys with consistent patterns
export const queryKeys = {
  patients: {
    all: [ENTITIES.PATIENTS] as const,
    byId: (patientId: string) => [patientId, ENTITIES.PATIENTS] as const,
    byPatient: (patientId: string) => [patientId, ENTITIES.PATIENTS] as const,
  } satisfies QueryKeyFactory<typeof ENTITIES.PATIENTS>,

  medications: {
    all: [ENTITIES.MEDICATIONS] as const,
    byPatient: (patientId: string) =>
      [patientId, ENTITIES.MEDICATIONS] as const,
    byId: (medicationId: string) =>
      [medicationId, ENTITIES.MEDICATIONS] as const,
  } satisfies QueryKeyFactory<typeof ENTITIES.MEDICATIONS>,

  medicationSchedules: {
    all: [ENTITIES.MEDICATION_SCHEDULES] as const,
    byPatient: (patientId: string) =>
      [patientId, ENTITIES.MEDICATION_SCHEDULES] as const,
    byMedication: (medicationId: string) =>
      [medicationId, ENTITIES.MEDICATION_SCHEDULES] as const,
  } satisfies QueryKeyFactory<typeof ENTITIES.MEDICATION_SCHEDULES>,

  medicationAdministrations: {
    all: [ENTITIES.MEDICATION_ADMINISTRATIONS] as const,
    byPatient: (patientId: string) =>
      [patientId, ENTITIES.MEDICATION_ADMINISTRATIONS] as const,
  } satisfies QueryKeyFactory<typeof ENTITIES.MEDICATION_ADMINISTRATIONS>,
} as const;

// Utility functions for common query operations
export const queryKeyUtils = {
  // Get all query keys for a specific patient
  getPatientQueries: (patientId: string) => ({
    medications: queryKeys.medications.byPatient(patientId),
    schedules: queryKeys.medicationSchedules.byPatient(patientId),
    administrations: queryKeys.medicationAdministrations.byPatient(patientId),
  }),

  // Get all query keys for a specific medication
  getMedicationQueries: (medicationId: string) => ({
    schedules: queryKeys.medicationSchedules.byMedication(medicationId),
  }),

  // Invalidate all patient-related queries
  invalidatePatientQueries: (
    queryClient: {
      invalidateQueries: (options: {
        queryKey: readonly unknown[];
      }) => Promise<unknown>;
    },
    patientId: string
  ) => {
    const patientQueries = queryKeyUtils.getPatientQueries(patientId);
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: patientQueries.medications }),
      queryClient.invalidateQueries({ queryKey: patientQueries.schedules }),
      queryClient.invalidateQueries({
        queryKey: patientQueries.administrations,
      }),
    ]);
  },

  // Refetch all patient-related queries
  refetchPatientQueries: (
    queryClient: {
      refetchQueries: (options: {
        queryKey: readonly unknown[];
      }) => Promise<unknown>;
    },
    patientId: string
  ) => {
    const patientQueries = queryKeyUtils.getPatientQueries(patientId);
    return Promise.all([
      queryClient.refetchQueries({ queryKey: patientQueries.medications }),
      queryClient.refetchQueries({ queryKey: patientQueries.schedules }),
      queryClient.refetchQueries({ queryKey: patientQueries.administrations }),
    ]);
  },

  // Cancel all patient-related queries
  cancelPatientQueries: (
    queryClient: {
      cancelQueries: (options: {
        queryKey: readonly unknown[];
      }) => Promise<unknown>;
    },
    patientId: string
  ) => {
    const patientQueries = queryKeyUtils.getPatientQueries(patientId);
    return Promise.all([
      queryClient.cancelQueries({ queryKey: patientQueries.medications }),
      queryClient.cancelQueries({ queryKey: patientQueries.schedules }),
      queryClient.cancelQueries({ queryKey: patientQueries.administrations }),
    ]);
  },

  // Invalidate all medication-related queries
  invalidateMedicationQueries: (
    queryClient: {
      invalidateQueries: (options: {
        queryKey: readonly unknown[];
      }) => Promise<unknown>;
    },
    medicationId: string
  ) => {
    const medicationQueries = queryKeyUtils.getMedicationQueries(medicationId);
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: medicationQueries.schedules }),
    ]);
  },
};

// Type exports for external use
export type QueryKeys = typeof queryKeys;
export type PatientQueries = ReturnType<typeof queryKeyUtils.getPatientQueries>;
export type MedicationQueries = ReturnType<
  typeof queryKeyUtils.getMedicationQueries
>;

// Helper function to create consistent query key patterns
export const createQueryKey = {
  // Create a patient-specific query key
  patient: (patientId: string, entity: keyof Omit<QueryKeys, "patients">) => {
    return queryKeys[entity].byPatient(patientId);
  },

  // Create a medication-specific query key
  medication: (
    medicationId: string,
    entity: keyof Pick<QueryKeys, "medicationSchedules">
  ) => {
    return queryKeys[entity].byMedication?.(medicationId);
  },

  // Create a general entity query key
  entity: (entity: keyof QueryKeys) => {
    return queryKeys[entity].all;
  },
};
