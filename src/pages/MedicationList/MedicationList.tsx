import React, { useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router";
import { useMedicationProfile } from "../../hooks/useMedicationProfile";
import { useUpdateMedication } from "../../hooks/mutations/useUpdateMedication";
import { useCreateMedicationSchedule } from "../../hooks/mutations/useCreateMedicationSchedule";
import { usePatientContext } from "../../contexts/PatientContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { AddMedicationForm } from "../../components/AddMedicationForm";
import { CreateMedicationScheduleForm } from "../../components/CreateMedicationScheduleForm";
import type { Medication } from "../../types/api";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.h2`
  font-size: 1.25rem;
  color: #4b5563;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const HeaderAccent = styled.div`
  width: 6rem;
  height: 0.25rem;
  background: #3b82f6;
  margin: 1rem auto 0;
  border-radius: 9999px;
`;

const BackButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: #2563eb;
  }
`;

const ErrorContainer = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
`;

const UpdateIndicator = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const UpdateBanner = styled.div`
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UpdateDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background: #3b82f6;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const UpdateText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const MedicationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MedicationCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  padding: 1.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MedicationIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconText = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
`;

const MedicationId = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const MedicationName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  ${MedicationCard}:hover & {
    color: #059669;
  }
`;

const GenericName = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 1rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InfoIcon = styled.div<{ $bgColor: string; $iconColor: string }>`
  width: 1.25rem;
  height: 1.25rem;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.span`
  color: #4b5563;
  font-size: 0.875rem;
`;

const ActionSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: "primary" | "secondary" }>`
  flex: 1;
  background: ${(props) =>
    props.$variant === "primary" ? "#ecfdf5" : "#f0f9ff"};
  color: ${(props) => (props.$variant === "primary" ? "#059669" : "#0284c7")};
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === "primary" ? "#d1fae5" : "#e0f2fe"};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  width: 100%;
`;

const EmptyIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #6b7280;
`;

export const MedicationList: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);

  const {
    medications: medicationsData,
    isLoading: isMedicationsLoading,
    error: medicationsError,
    updateMedication,
    isUpdatingMedication: isMedicationUpdating,
  } = useMedicationProfile(patientId || "");

  const { currentPatient } = usePatientContext();
  const updateMedicationMutation = useUpdateMedication();
  const createScheduleMutation = useCreateMedicationSchedule(patientId || "");

  if (!patientId) {
    return <div>Patient ID not found</div>;
  }

  if (isMedicationsLoading) return <LoadingSpinner />;

  return (
    <Container>
      <ContentWrapper>
        {/* Header Section */}
        <Header>
          <Title>Medication Management</Title>
          <Subtitle>
            {currentPatient
              ? `Medications for ${currentPatient.firstName} ${currentPatient.lastName}`
              : "Patient Medications"}
          </Subtitle>
          <HeaderAccent />
        </Header>

        {/* Back Button */}
        <BackButton onClick={() => navigate("/")}>
          ← Back to Patient List
        </BackButton>

        {/* Add Medication Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              background: "#10b981",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Medication
          </button>
        </div>

        {/* Error Display */}
        {medicationsError && (
          <ErrorContainer>
            <ErrorMessage message={medicationsError.message} />
          </ErrorContainer>
        )}

        {/* Update Indicator */}
        {isMedicationUpdating && (
          <UpdateIndicator>
            <UpdateBanner>
              <UpdateDot />
              <UpdateText>Updating medication data...</UpdateText>
            </UpdateBanner>
          </UpdateIndicator>
        )}

        {/* Medication Grid */}
        {medicationsData?.medications &&
        medicationsData.medications.length > 0 ? (
          <MedicationGrid>
            {medicationsData.medications
              .filter((medication: Medication) => medication.isActive !== false)
              .map((medication: Medication) => (
                <MedicationCard key={medication.medicationId}>
                  {/* Medication Card Header */}
                  <CardHeader>
                    <HeaderContent>
                      <MedicationIcon>
                        <IconText>💊</IconText>
                      </MedicationIcon>
                      <MedicationId>
                        ID: {medication.medicationId?.slice(0, 8) || "Unknown"}
                        ...
                      </MedicationId>
                    </HeaderContent>
                  </CardHeader>

                  {/* Medication Information */}
                  <CardBody>
                    <MedicationName>
                      {medication.name || "Unnamed Medication"}
                    </MedicationName>
                    <GenericName>
                      {medication.genericName || "No generic name"}
                    </GenericName>

                    <InfoSection>
                      <InfoRow>
                        <InfoIcon $bgColor="#dbeafe" $iconColor="#2563eb">
                          <svg
                            width="12"
                            height="12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </InfoIcon>
                        <InfoText>
                          {medication.dosageAmount || 0}{" "}
                          {medication.unit || "unit"}{" "}
                          {medication.form || "form"}
                        </InfoText>
                      </InfoRow>

                      <InfoRow>
                        <InfoIcon $bgColor="#dcfce7" $iconColor="#16a34a">
                          <svg
                            width="12"
                            height="12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </InfoIcon>
                        <InfoText>
                          {medication.frequencyPerDay || 0}x per day
                        </InfoText>
                      </InfoRow>

                      <InfoRow>
                        <InfoIcon $bgColor="#fef3c7" $iconColor="#d97706">
                          <svg
                            width="12"
                            height="12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </InfoIcon>
                        <InfoText>
                          Strength: {medication.strength || "Unknown"}{" "}
                          {medication.unit || "unit"}
                        </InfoText>
                      </InfoRow>

                      {medication.specialInstructions && (
                        <InfoRow>
                          <InfoIcon $bgColor="#fce7f3" $iconColor="#be185d">
                            <svg
                              width="12"
                              height="12"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </InfoIcon>
                          <InfoText>{medication.specialInstructions}</InfoText>
                        </InfoRow>
                      )}
                    </InfoSection>

                    {/* Action Buttons */}
                    <ActionSection>
                      <ActionButton
                        $variant="primary"
                        onClick={() => {
                          updateMedicationMutation.mutate({
                            medication_id: medication.medicationId,
                            patient_id: medication.patientId,
                            name: medication.name,
                            generic_name: medication.genericName,
                            strength: medication.strength,
                            unit: medication.unit,
                            form: medication.form,
                            dosage_amount: medication.dosageAmount,
                            frequency_per_day: medication.frequencyPerDay,
                            special_instructions:
                              medication.specialInstructions || "",
                            is_active: false,
                          });
                        }}
                        disabled={updateMedicationMutation.isPending}
                      >
                        {updateMedicationMutation.isPending
                          ? "Deactivating..."
                          : "Deactivate Medication"}
                      </ActionButton>
                      <ActionButton
                        $variant="secondary"
                        onClick={() => {
                          console.log(
                            "MedicationList - Setting selectedMedication:",
                            medication
                          );
                          console.log(
                            "MedicationList - medication.medicationId:",
                            medication.medicationId
                          );
                          setSelectedMedication(medication);
                          setShowScheduleForm(true);
                        }}
                      >
                        Create Schedule
                      </ActionButton>
                      <ActionButton
                        $variant="secondary"
                        onClick={() =>
                          navigate(`/patient/${patientId}/schedules`)
                        }
                      >
                        View Schedule
                      </ActionButton>
                    </ActionSection>
                  </CardBody>
                </MedicationCard>
              ))}
          </MedicationGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </EmptyIcon>
            <EmptyTitle>
              {medicationsData?.medications &&
              medicationsData.medications.length > 0
                ? "No active medications found"
                : "No medications found"}
            </EmptyTitle>
            <EmptyText>
              {medicationsData?.medications &&
              medicationsData.medications.length > 0
                ? "This patient doesn't have any active medications assigned."
                : "This patient doesn't have any medications assigned yet."}
            </EmptyText>
          </EmptyState>
        )}

        {/* Add Medication Form Modal */}
        {showAddForm && (
          <AddMedicationForm
            patientId={patientId || ""}
            onClose={() => setShowAddForm(false)}
            onSubmit={updateMedication}
            isSubmitting={isMedicationUpdating}
          />
        )}

        {/* Create Schedule Form Modal */}
        {showScheduleForm && selectedMedication && (
          <>
            {console.log(
              "MedicationList - Rendering CreateMedicationScheduleForm with props:",
              {
                medicationId: selectedMedication.medicationId,
                medicationName: selectedMedication.name,
                selectedMedication,
              }
            )}
            <CreateMedicationScheduleForm
              key={selectedMedication.medicationId} // Force re-render when medicationId changes
              medicationId={selectedMedication.medicationId}
              medicationName={selectedMedication.name}
              onClose={() => {
                setShowScheduleForm(false);
                setSelectedMedication(null);
              }}
              onSubmit={async (schedulesData) => {
                console.log(
                  "MedicationList - onSubmit received schedulesData:",
                  schedulesData
                );
                await createScheduleMutation.mutateAsync(schedulesData);
              }}
              isSubmitting={createScheduleMutation.isPending}
            />
          </>
        )}
      </ContentWrapper>
    </Container>
  );
};
