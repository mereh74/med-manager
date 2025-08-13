import React, { useState, useRef } from "react";
import styled from "styled-components";
import type { CreateMedicationData, Medication } from "../../types/api";

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
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
  resize: vertical;
  min-height: 80px;
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

const Button = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    &:hover {
      background: #e5e7eb;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface AddMedicationFormProps {
  patientId: string;
  onClose: () => void;
  onSubmit: (data: CreateMedicationData) => Promise<Medication>;
  isSubmitting: boolean;
}

export const AddMedicationForm: React.FC<AddMedicationFormProps> = ({
  patientId,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<CreateMedicationData>({
    name: "",
    generic_name: "",
    strength: "",
    unit: "",
    form: "",
    dosage_amount: 1,
    frequency_per_day: 1,
    special_instructions: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitSelectRef = useRef<HTMLSelectElement>(null);
  const formSelectRef = useRef<HTMLSelectElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          name === "dosage_amount" || name === "frequency_per_day"
            ? Number(value)
            : value,
      };
      return newData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Medication name is required";
    if (!formData.generic_name.trim())
      newErrors.generic_name = "Generic name is required";
    if (!formData.strength.trim()) newErrors.strength = "Strength is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.form.trim()) newErrors.form = "Form is required";
    if (formData.dosage_amount <= 0)
      newErrors.dosage_amount = "Dosage amount must be greater than 0";
    if (formData.frequency_per_day <= 0)
      newErrors.frequency_per_day = "Frequency must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const medicationData: CreateMedicationData = {
        patient_id: patientId,
        name: formData.name || "",
        generic_name: formData.generic_name || "",
        strength: formData.strength || "",
        unit: formData.unit || "",
        form: formData.form || "",
        dosage_amount: formData.dosage_amount || 1,
        frequency_per_day: formData.frequency_per_day || 1,
        special_instructions: formData.special_instructions || "",
        is_active: formData.is_active,
      };

      await onSubmit(medicationData);
      onClose();
    } catch (error) {
      console.error("Error submitting medication:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Add New Medication</Title>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Medication Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Lisinopril"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="generic_name">Generic Name *</Label>
            <Input
              id="generic_name"
              name="generic_name"
              type="text"
              value={formData.generic_name}
              onChange={handleInputChange}
              placeholder="e.g., Lisinopril"
            />
            {errors.generic_name && (
              <ErrorMessage>{errors.generic_name}</ErrorMessage>
            )}
          </FormGroup>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormGroup>
              <Label htmlFor="strength">Strength *</Label>
              <Input
                id="strength"
                name="strength"
                type="text"
                value={formData.strength}
                onChange={handleInputChange}
                placeholder="e.g., 10"
              />
              {errors.strength && (
                <ErrorMessage>{errors.strength}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="unit">Unit *</Label>
              <div style={{ position: "relative" }}>
                <select
                  ref={unitSelectRef}
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    background: "white",
                    cursor: "pointer",
                    minHeight: "48px",
                    width: "100%",
                    appearance: "auto",
                  }}
                >
                  <option value="">Select unit</option>
                  <option value="mg">mg</option>
                  <option value="mcg">mcg</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="units">units</option>
                </select>
                {/* Force display of selected value */}
                {formData.unit && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      pointerEvents: "none",
                      fontSize: "0.875rem",
                      color: "#374151",
                      zIndex: 1,
                    }}
                  >
                    {formData.unit}
                  </div>
                )}
              </div>
              {errors.unit && <ErrorMessage>{errors.unit}</ErrorMessage>}
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="form">Form *</Label>
            <div style={{ position: "relative" }}>
              <select
                ref={formSelectRef}
                id="form"
                name="form"
                value={formData.form}
                onChange={handleInputChange}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  background: "white",
                  cursor: "pointer",
                  minHeight: "48px",
                  width: "100%",
                  appearance: "auto",
                }}
              >
                <option value="">Select form</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="liquid">Liquid</option>
                <option value="injection">Injection</option>
                <option value="cream">Cream</option>
                <option value="inhaler">Inhaler</option>
              </select>
              {/* Force display of selected value */}
              {formData.form && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    pointerEvents: "none",
                    fontSize: "0.875rem",
                    color: "#374151",
                    zIndex: 1,
                  }}
                >
                  {formData.form}
                </div>
              )}
            </div>
            {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
          </FormGroup>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormGroup>
              <Label htmlFor="dosage_amount">Dosage Amount *</Label>
              <Input
                id="dosage_amount"
                name="dosage_amount"
                type="number"
                min="0.1"
                step="0.1"
                value={formData.dosage_amount}
                onChange={handleInputChange}
                placeholder="e.g., 1"
              />
              {errors.dosage_amount && (
                <ErrorMessage>{errors.dosage_amount}</ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="frequency_per_day">Times Per Day *</Label>
              <Input
                id="frequency_per_day"
                name="frequency_per_day"
                type="number"
                min="1"
                value={formData.frequency_per_day}
                onChange={handleInputChange}
                placeholder="e.g., 2"
              />
              {errors.frequency_per_day && (
                <ErrorMessage>{errors.frequency_per_day}</ErrorMessage>
              )}
            </FormGroup>
          </div>

          <FormGroup>
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              name="special_instructions"
              value={formData.special_instructions}
              onChange={handleInputChange}
              placeholder="e.g., Take with food, Avoid alcohol"
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Medication"}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </ModalOverlay>
  );
};
