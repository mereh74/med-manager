import React from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router";
import { useMedicationScheduleProfile } from "../../hooks/useMedicationScheduleProfile";
import { usePatientContext } from "../../contexts/PatientContext";
import { MedicationCalendar } from "../../components/MedicationCalendar";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

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

export const MedicationSchedules: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { currentPatient } = usePatientContext();

  const {
    schedulesData,
    isLoading: isSchedulesLoading,
    error: schedulesError,
  } = useMedicationScheduleProfile(patientId || "");

  // Debug logging to understand data structure
  console.log("MedicationSchedules - patientId:", patientId);
  console.log("MedicationSchedules - schedulesData:", schedulesData);
  console.log("MedicationSchedules - isSchedulesLoading:", isSchedulesLoading);
  console.log("MedicationSchedules - schedulesError:", schedulesError);

  if (!patientId) {
    return <div>Patient ID not found</div>;
  }

  if (isSchedulesLoading) return <LoadingSpinner />;

  if (schedulesError) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorContainer>
            <ErrorMessage message={schedulesError.message} />
          </ErrorContainer>
        </ContentWrapper>
      </Container>
    );
  }

  if (!schedulesData) {
    console.log("MedicationSchedules - No schedulesData available");
    return <div>No schedule data available</div>;
  }

  console.log(
    "MedicationSchedules - Rendering with schedulesData:",
    schedulesData
  );
  console.log(
    "MedicationSchedules - schedulesData.schedulesByMedication:",
    schedulesData.schedulesByMedication
  );
  console.log(
    "MedicationSchedules - schedulesData keys:",
    Object.keys(schedulesData || {})
  );
  console.log(
    "MedicationSchedules - schedulesData.schedulesByMedication length:",
    schedulesData.schedulesByMedication?.length
  );
  console.log(
    "MedicationSchedules - schedulesData.schedulesByMedication type:",
    typeof schedulesData.schedulesByMedication
  );

  return (
    <Container>
      <ContentWrapper>
        {/* Header Section */}
        <Header>
          <Title>Medication Schedules</Title>
          <Subtitle>
            {currentPatient
              ? `${currentPatient.firstName} ${currentPatient.lastName}`
              : schedulesData.patient
              ? `${schedulesData.patient.first_name} ${schedulesData.patient.last_name}`
              : "Patient"}
          </Subtitle>
          <HeaderAccent />
        </Header>

        {/* Back Button */}
        <BackButton
          onClick={() => navigate(`/patient/${patientId}/medications`)}
        >
          ← Back to Medications
        </BackButton>

        {/* Medication Calendar */}
        <MedicationCalendar
          schedulesData={schedulesData}
          patientId={patientId}
        />
      </ContentWrapper>
    </Container>
  );
};
