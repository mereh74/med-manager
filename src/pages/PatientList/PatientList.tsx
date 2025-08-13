import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { usePatients } from "../../hooks/queries/usePatients";
import { usePatientContext } from "../../contexts/PatientContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import type { Patient } from "../../types/api";

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
`;

const HeaderAccent = styled.div`
  width: 6rem;
  height: 0.25rem;
  background: #3b82f6;
  margin: 1rem auto 0;
  border-radius: 9999px;
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

const PatientGrid = styled.div`
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

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const PatientCard = styled.div`
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
  background: linear-gradient(90deg, #3b82f6 0%, #4f46e5 100%);
  padding: 1.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarText = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
`;

const PatientId = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const PatientName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;

  ${PatientCard}:hover & {
    color: #2563eb;
  }
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
    props.$variant === "primary" ? "#eff6ff" : "#eef2ff"};
  color: ${(props) => (props.$variant === "primary" ? "#2563eb" : "#4f46e5")};
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === "primary" ? "#dbeafe" : "#e0e7ff"};
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

export const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentPatient } = usePatientContext();

  const {
    data: patientsData,
    isLoading: isPatientsLoading,
    error: patientsError,
    isFetching: isPatientsFetching,
  } = usePatients();

  if (isPatientsLoading) return <LoadingSpinner />;

  return (
    <Container>
      <ContentWrapper>
        {/* Header Section */}
        <Header>
          <Title>Medication Management System</Title>
          <Subtitle>Patient Directory</Subtitle>
          <HeaderAccent />
        </Header>

        {/* Error Display */}
        {patientsError && (
          <ErrorContainer>
            <ErrorMessage message={patientsError.message} />
          </ErrorContainer>
        )}

        {/* Update Indicator */}
        {isPatientsFetching && (
          <UpdateIndicator>
            <UpdateBanner>
              <UpdateDot />
              <UpdateText>Updating patient data...</UpdateText>
            </UpdateBanner>
          </UpdateIndicator>
        )}

        {/* Patient Grid */}
        <PatientGrid>
          {patientsData?.patients.map((patient: Patient) => (
            <PatientCard key={patient.patientId}>
              {/* Patient Card Header */}
              <CardHeader>
                <HeaderContent>
                  <Avatar>
                    <AvatarText>
                      {patient.firstName.charAt(0)}
                      {patient.lastName.charAt(0)}
                    </AvatarText>
                  </Avatar>
                  <PatientId>ID: {patient.patientId.slice(0, 8)}...</PatientId>
                </HeaderContent>
              </CardHeader>

              {/* Patient Information */}
              <CardBody>
                <PatientName>
                  {patient.firstName} {patient.lastName}
                </PatientName>

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
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </InfoIcon>
                    <InfoText>
                      DOB:{" "}
                      {new Date(patient.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )}
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
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </InfoIcon>
                    <InfoText>Active Patient</InfoText>
                  </InfoRow>
                </InfoSection>

                {/* Action Buttons */}
                <ActionSection>
                  <ActionButton
                    $variant="primary"
                    onClick={() => {
                      setCurrentPatient(patient);
                      navigate(`/patient/${patient.patientId}/schedules`);
                    }}
                  >
                    View Schedule
                  </ActionButton>
                  <ActionButton
                    $variant="secondary"
                    onClick={() => {
                      setCurrentPatient(patient);
                      navigate(`/patient/${patient.patientId}/medications`);
                    }}
                  >
                    View Medications
                  </ActionButton>
                </ActionSection>
              </CardBody>
            </PatientCard>
          ))}
        </PatientGrid>

        {/* Empty State */}
        {patientsData?.patients.length === 0 && (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </EmptyIcon>
            <EmptyTitle>No patients found</EmptyTitle>
          </EmptyState>
        )}
      </ContentWrapper>
    </Container>
  );
};
