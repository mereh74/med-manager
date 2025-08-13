import React, { useState } from "react";
import styled from "styled-components";
import type { CreateMedicationAdministrationData } from "../../types/api";

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
  max-width: 500px;
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

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;

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
  $variant: "primary" | "secondary";
}>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `
      : `
    background: #6b7280;
    color: white;
    &:hover {
      background: #4b5563;
    }
  `}
`;

interface AdministrationFormModalProps {
  dose: {
    medicationId: string;
    medicationName: string;
    scheduledDateTime: Date;
    scheduleId: string;
  };
  onClose: () => void;
  onSubmit: (
    administrationData: CreateMedicationAdministrationData
  ) => Promise<void>;
  isSubmitting: boolean;
}

export const AdministrationFormModal: React.FC<
  AdministrationFormModalProps
> = ({ dose, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    actualDateTime: new Date().toISOString().slice(0, 16), // Current date/time
    administeredBy: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format dates to YYYY-MM-DD HH:MM:SS format
    const formatDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const administrationData: CreateMedicationAdministrationData = {
      medication_id: dose.medicationId,
      scheduled_datetime: formatDateTime(dose.scheduledDateTime),
      actual_datetime: formatDateTime(new Date(formData.actualDateTime)),
      administered_by: formData.administeredBy,
      notes: formData.notes,
    };

    await onSubmit(administrationData);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Mark Dose as Taken</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Medication</Label>
            <Input
              type="text"
              value={dose.medicationName}
              disabled
              style={{ background: "#f3f4f6" }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Scheduled Time</Label>
            <Input
              type="text"
              value={dose.scheduledDateTime.toLocaleString()}
              disabled
              style={{ background: "#f3f4f6" }}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="actualDateTime">Actual Time Taken *</Label>
            <Input
              id="actualDateTime"
              type="datetime-local"
              value={formData.actualDateTime}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  actualDateTime: e.target.value,
                }))
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="administeredBy">Administered By *</Label>
            <Input
              id="administeredBy"
              type="text"
              placeholder="Enter name or ID"
              value={formData.administeredBy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  administeredBy: e.target.value,
                }))
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about the administration..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Administration"}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </ModalOverlay>
  );
};
