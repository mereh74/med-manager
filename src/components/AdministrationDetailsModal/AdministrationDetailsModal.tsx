import React from "react";
import styled from "styled-components";
import { format, parseISO } from "date-fns";
import type { MedicationAdministrationResponse } from "../../types/api";

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

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
`;

const DetailTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
`;

const Button = styled.button`
  background: #6b7280;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background: #4b5563;
  }
`;

const NoAdministrationsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 1rem;
`;

interface AdministrationDetailsModalProps {
  dose: {
    medicationId: string;
    medicationName: string;
    scheduledDateTime: Date;
    scheduleId: string;
  };
  administrations: MedicationAdministrationResponse[] | undefined;
  isLoading: boolean;
  onClose: () => void;
  onCreateNew: () => void;
}

export const AdministrationDetailsModal: React.FC<
  AdministrationDetailsModalProps
> = ({ dose, administrations, isLoading, onClose, onCreateNew }) => {
  // Ensure administrations is always an array and add safety checks
  const safeAdministrations = Array.isArray(administrations)
    ? administrations
    : [];

  // Find administrations for this specific medication and scheduled time
  const relevantAdministrations = safeAdministrations.filter((admin) => {
    const medicationMatch = admin.medicationId === dose.medicationId;

    return medicationMatch;
  });

  const formatDateTime = (dateString: string | Date) => {
    try {
      if (dateString instanceof Date) {
        return format(dateString, "MMM d, yyyy h:mm:ss a");
      }

      if (typeof dateString === "string") {
        const date = parseISO(dateString);
        return format(date, "MMM d, yyyy h:mm:ss a");
      }

      return "Invalid Date";
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <ModalOverlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Title>Loading Administration Details...</Title>
          <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
        </Modal>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Administration Details</Title>
        <DetailsContainer>
          <DetailSection>
            <DetailTitle>Medication Information</DetailTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Medication</DetailLabel>
                <DetailValue>{dose.medicationName}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Scheduled Time</DetailLabel>
                <DetailValue>
                  {formatDateTime(dose.scheduledDateTime)}
                </DetailValue>
              </DetailItem>
            </DetailGrid>
          </DetailSection>

          {relevantAdministrations && relevantAdministrations.length > 0 ? (
            <DetailSection>
              <DetailTitle>Administration Records</DetailTitle>
              {relevantAdministrations.map((admin, index) => (
                <DetailGrid
                  key={index}
                  style={{
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.25rem",
                  }}
                >
                  <DetailItem>
                    <DetailLabel>Actual Time</DetailLabel>
                    <DetailValue>{formatDateTime(admin.createdAt)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Administered By</DetailLabel>
                    <DetailValue>{admin.administeredBy}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Notes</DetailLabel>
                    <DetailValue>{admin.notes || "No notes"}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Recorded At</DetailLabel>
                    <DetailValue>{formatDateTime(admin.createdAt)}</DetailValue>
                  </DetailItem>
                </DetailGrid>
              ))}
            </DetailSection>
          ) : (
            <DetailSection>
              <DetailTitle>No Administration Records</DetailTitle>
              <NoAdministrationsMessage>
                This dose has not been marked as administered yet.
              </NoAdministrationsMessage>
            </DetailSection>
          )}

          <Button onClick={onCreateNew}>
            {relevantAdministrations && relevantAdministrations.length > 0
              ? "Add Another Administration Record"
              : "Mark as Administered"}
          </Button>
        </DetailsContainer>
      </Modal>
    </ModalOverlay>
  );
};
