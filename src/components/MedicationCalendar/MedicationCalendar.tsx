import React, { useState } from "react";
import styled from "styled-components";
import type {
  MedicationSchedulesResponse,
  MedicationWithSchedules,
  MedicationSchedule,
  CreateMedicationAdministrationData,
} from "../../types/api";
import { useCreateMedicationAdministration } from "../../hooks/mutations/useCreateMedicationAdministration";
import { useMedicationAdministrations } from "../../hooks/queries/useMedicationAdministrations";
import { AdministrationFormModal } from "../AdministrationFormModal";
import { AdministrationDetailsModal } from "../AdministrationDetailsModal";

// Styled Components
const CalendarContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CalendarTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const WeekNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const WeekDisplay = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  min-width: 200px;
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DayHeader = styled.div`
  text-align: center;
  padding: 0.75rem;
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const DayCell = styled.div<{ $isToday: boolean; $isCurrentWeek: boolean }>`
  min-height: 120px;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.$isToday ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  background: ${(props) =>
    props.$isToday ? "#eff6ff" : props.$isCurrentWeek ? "#ffffff" : "#f9fafb"};
  position: relative;
`;

const DayNumber = styled.div<{ $isToday: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isToday ? "700" : "500")};
  color: ${(props) => (props.$isToday ? "#1d4ed8" : "#374151")};
  margin-bottom: 0.5rem;
  text-align: center;
`;

const DoseItem = styled.div<{ $medicationColor: string }>`
  background: ${(props) => props.$medicationColor};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const DoseTime = styled.div`
  font-weight: 600;
  margin-bottom: 0.125rem;
`;

const DoseMedication = styled.div`
  font-size: 0.8rem;
  opacity: 1;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  margin-top: 2px;
`;

interface MedicationCalendarProps {
  schedulesData: MedicationSchedulesResponse;
  patientId: string;
}

const DayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate medication colors for visual distinction
const generateMedicationColors = (medications: MedicationWithSchedules[]) => {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
  ];

  const colorMap: { [key: string]: string } = {};
  medications.forEach((med, index) => {
    colorMap[med.medicationId] = colors[index % colors.length];
  });

  return colorMap;
};

export const MedicationCalendar: React.FC<MedicationCalendarProps> = ({
  schedulesData,
  patientId,
}) => {
  const [currentWeekStart, setCurrentWeekStart] = React.useState(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  });

  // State for administration modals
  const [showAdministrationForm, setShowAdministrationForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDose, setSelectedDose] = useState<{
    medicationId: string;
    medicationName: string;
    scheduledDateTime: Date;
    scheduleId: string;
  } | null>(null);

  // Hooks for medication administrations
  const createAdministrationMutation =
    useCreateMedicationAdministration(patientId);
  const { administrations, isLoading: isAdministrationsLoading } =
    useMedicationAdministrations(patientId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!schedulesData?.schedulesByMedication?.length) {
    return (
      <CalendarContainer>
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          No medication schedules found for this patient.
        </div>
      </CalendarContainer>
    );
  }

  // Filter to only include medications with at least one active schedule
  const activeMedications = schedulesData.schedulesByMedication.filter(
    (medication: MedicationWithSchedules) =>
      medication.schedules?.some(
        (schedule: MedicationSchedule) => schedule.isActive === 1
      )
  );

  if (!activeMedications.length) {
    return (
      <CalendarContainer>
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          No active medication schedules found for this patient.
        </div>
      </CalendarContainer>
    );
  }

  const medicationColors = generateMedicationColors(activeMedications);

  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date(currentWeekStart);

    for (let week = 0; week < 2; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        days.push({
          date: currentDate,
          dayOfWeek: currentDate.getDay(),
          dayNumber: currentDate.getDate(),
          isToday: currentDate.getTime() === today.getTime(),
          isCurrentWeek: week === 0,
        });
      }
    }

    return days;
  };

  const getDosesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const doses: Array<{
      medication_name: string;
      medication_id: string;
      time: string;
      scheduleId: string;
      dayOfWeek: number;
      isActive: number;
      createdAt: string;
      updatedAt: string;
    }> = [];

    (activeMedications || []).forEach((medication: MedicationWithSchedules) => {
      (medication.schedules || []).forEach((schedule: MedicationSchedule) => {
        if (schedule.dayOfWeek === dayOfWeek && schedule.isActive === 1) {
          doses.push({
            ...schedule,
            medication_name: medication.medicationName,
            medication_id: medication.medicationId,
            time: schedule.timeOfDay,
          });
        }
      });
    });

    return doses.sort((a, b) => a.time.localeCompare(b.time));
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newStart = new Date(currentWeekStart);
    if (direction === "prev") {
      newStart.setDate(newStart.getDate() - 14);
    } else {
      newStart.setDate(newStart.getDate() + 14);
    }
    setCurrentWeekStart(newStart);
  };

  const formatWeekRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 13);

    const startFormatted = currentWeekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endFormatted = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const calendarDays = generateCalendarDays();

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>Medication Schedule Calendar</CalendarTitle>
        <WeekNavigation>
          <NavButton
            onClick={() => navigateWeek("prev")}
            disabled={
              currentWeekStart <=
              new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
            }
          >
            ← Previous
          </NavButton>
          <WeekDisplay>{formatWeekRange()}</WeekDisplay>
          <NavButton onClick={() => navigateWeek("next")}>Next →</NavButton>
        </WeekNavigation>
      </CalendarHeader>

      <CalendarGrid>
        {DayNames.map((day) => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            $isToday={day.isToday}
            $isCurrentWeek={day.isCurrentWeek}
          >
            <DayNumber $isToday={day.isToday}>{day.dayNumber}</DayNumber>
            {getDosesForDate(day.date).map((dose, doseIndex) => {
              // Create scheduled date time for this dose
              const scheduledDateTime = new Date(day.date);
              const [hours, minutes] = dose.time.split(":");
              scheduledDateTime.setHours(
                parseInt(hours),
                parseInt(minutes),
                0,
                0
              );

              return (
                <DoseItem
                  key={doseIndex}
                  $medicationColor={medicationColors[dose.medication_id]}
                  title={`${dose.medication_name} - ${dose.time}`}
                  onClick={() => {
                    setSelectedDose({
                      medicationId: dose.medication_id,
                      medicationName: dose.medication_name,
                      scheduledDateTime,
                      scheduleId: dose.scheduleId,
                    });
                    setShowDetailsModal(true);
                  }}
                >
                  <DoseTime>{dose.time.slice(0, 5)}</DoseTime>
                  <DoseMedication>{dose.medication_name}</DoseMedication>
                </DoseItem>
              );
            })}
          </DayCell>
        ))}
      </CalendarGrid>

      {/* Administration Details Modal */}
      {showDetailsModal && selectedDose && (
        <>
          <AdministrationDetailsModal
            dose={selectedDose}
            administrations={
              Array.isArray(administrations) ? administrations : []
            }
            isLoading={isAdministrationsLoading}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedDose(null);
            }}
            onCreateNew={() => {
              setShowDetailsModal(false);
              setShowAdministrationForm(true);
            }}
          />
        </>
      )}

      {/* Administration Form Modal */}
      {showAdministrationForm && selectedDose && (
        <AdministrationFormModal
          dose={selectedDose}
          onClose={() => {
            setShowAdministrationForm(false);
            setSelectedDose(null);
          }}
          onSubmit={async (
            administrationData: CreateMedicationAdministrationData
          ) => {
            try {
              await createAdministrationMutation.mutateAsync(
                administrationData
              );
              setShowAdministrationForm(false);
              setSelectedDose(null);
            } catch (error) {
              console.error("Error creating administration:", error);
            }
          }}
          isSubmitting={createAdministrationMutation.isPending}
        />
      )}
    </CalendarContainer>
  );
};
