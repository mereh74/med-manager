import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { CreateMedicationScheduleData } from "../../types/api";

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{
  $variant: "primary" | "secondary" | "tertiary";
}>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background: #3b82f6;
          color: white;
          &:hover {
            background: #2563eb;
          }
        `;
      case "secondary":
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover {
            background: #e5e7eb;
          }
        `;
      case "tertiary":
        return `
          background: #10b981;
          color: white;
          &:hover {
            background: #059669;
          }
        `;
      default:
        return "";
    }
  }}
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ScheduleItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9fafb;
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ScheduleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AddScheduleButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    background: #059669;
  }
`;

interface CreateMedicationScheduleFormProps {
  medicationId: string;
  medicationName: string;
  onClose: () => void;
  onSubmit: (data: CreateMedicationScheduleData[]) => Promise<void>;
  isSubmitting: boolean;
}

const DayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const CreateMedicationScheduleForm: React.FC<
  CreateMedicationScheduleFormProps
> = ({ medicationId, medicationName, onClose, onSubmit, isSubmitting }) => {
  const [schedules, setSchedules] = useState<CreateMedicationScheduleData[]>([
    {
      medication_id: medicationId,
      day_of_week: 1, // Default to Monday
      time_of_day: "08:00:00",
      is_active: true,
    },
  ]);

  // Debug: Log when medicationId changes
  useEffect(() => {
    console.log(
      "CreateMedicationScheduleForm - medicationId changed to:",
      medicationId
    );
    console.log("CreateMedicationScheduleForm - Current schedules:", schedules);

    // Update all schedules to ensure they have the correct medication_id
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule) => ({
        ...schedule,
        medication_id: medicationId,
      }))
    );
  }, [medicationId]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addSchedule = () => {
    const newSchedule = {
      medication_id: medicationId,
      day_of_week: 1,
      time_of_day: "08:00:00",
      is_active: true,
    };

    console.log(
      "CreateMedicationScheduleForm - Adding new schedule:",
      newSchedule
    );

    setSchedules((prev) => [...prev, newSchedule]);
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSchedule = (
    index: number,
    field: keyof CreateMedicationScheduleData,
    value: string | number | boolean
  ) => {
    console.log(
      `CreateMedicationScheduleForm - Updating schedule ${index}, field: ${field}, value:`,
      value
    );

    setSchedules((prev) =>
      prev.map((schedule, i) => {
        if (i === index) {
          const updatedSchedule = { ...schedule, [field]: value };
          console.log(
            `CreateMedicationScheduleForm - Updated schedule ${index}:`,
            updatedSchedule
          );
          return updatedSchedule;
        }
        return schedule;
      })
    );

    // Clear error when user starts typing
    if (errors[`${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`${index}_${field}`]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    schedules.forEach((schedule, index) => {
      if (schedule.day_of_week === undefined && schedule.day_of_week !== 0) {
        newErrors[`${index}_day_of_week`] = "Day of week is required";
      }

      if (!schedule.time_of_day) {
        newErrors[`${index}_time_of_day`] = "Time is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Format time to HH:MM:SS before sending to API
      const formattedSchedules = schedules.map((schedule) => {
        console.log(`Original time: "${schedule.time_of_day}"`);
        let formattedTime = schedule.time_of_day;

        // If time is in hh:mm format, convert to hh:mm:ss
        if (schedule.time_of_day.match(/^\d{1,2}:\d{2}$/)) {
          formattedTime = `${schedule.time_of_day}:00`;
        }
        // If time is already in hh:mm:ss format, keep it
        else if (schedule.time_of_day.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
          formattedTime = schedule.time_of_day;
        }

        console.log(`Formatted time: "${formattedTime}"`);

        return {
          ...schedule,
          medication_id: medicationId, // Ensure medication_id is always set correctly
          time_of_day: formattedTime,
        };
      });

      // Debug: Log the final schedules data being sent
      console.log(
        "CreateMedicationScheduleForm - Final schedules data:",
        formattedSchedules
      );
      console.log(
        "CreateMedicationScheduleForm - medicationId prop:",
        medicationId
      );
      console.log(
        "CreateMedicationScheduleForm - Each schedule medication_id:",
        formattedSchedules.map((s) => s.medication_id)
      );

      await onSubmit(formattedSchedules);
      onClose();
    } catch (error) {
      console.error("Error submitting schedules:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Create Schedules for {medicationName}</Title>

        <Form onSubmit={handleSubmit}>
          <AddScheduleButton type="button" onClick={addSchedule}>
            + Add Another Schedule
          </AddScheduleButton>

          {schedules.map((schedule, index) => (
            <ScheduleItem key={index}>
              <ScheduleHeader>
                <ScheduleTitle>Schedule {index + 1}</ScheduleTitle>
                {schedules.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeSchedule(index)}
                  >
                    Remove
                  </RemoveButton>
                )}
              </ScheduleHeader>

              <ScheduleGrid>
                <FormGroup>
                  <Label htmlFor={`day_of_week_${index}`}>Day of Week *</Label>
                  <select
                    key={`day_select_${index}_${schedule.day_of_week}`}
                    id={`day_of_week_${index}`}
                    name={`day_of_week_${index}`}
                    value={schedule.day_of_week?.toString() || "1"}
                    onChange={(e) =>
                      updateSchedule(
                        index,
                        "day_of_week",
                        Number(e.target.value)
                      )
                    }
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      background: "white",
                      cursor: "pointer",
                      color: "black",
                    }}
                  >
                    {DayOptions.map((day) => (
                      <option key={day.value} value={String(day.value)}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                  {errors[`${index}_day_of_week`] && (
                    <ErrorMessage>
                      {errors[`${index}_day_of_week`]}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor={`time_of_day_${index}`}>Time of Day *</Label>
                  <Input
                    id={`time_of_day_${index}`}
                    type="time"
                    value={schedule.time_of_day}
                    onChange={(e) =>
                      updateSchedule(index, "time_of_day", e.target.value)
                    }
                  />
                  {errors[`${index}_time_of_day`] && (
                    <ErrorMessage>
                      {errors[`${index}_time_of_day`]}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </ScheduleGrid>
            </ScheduleItem>
          ))}

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" $variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating..."
                : `Create ${schedules.length} Schedule${
                    schedules.length > 1 ? "s" : ""
                  }`}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </ModalOverlay>
  );
};
