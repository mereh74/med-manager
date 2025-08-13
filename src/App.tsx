import { BrowserRouter, Route, Routes } from "react-router";
import { PatientList } from "./pages/PatientList/PatientList";
import { MedicationList } from "./pages/MedicationList/MedicationList";
import { MedicationSchedules } from "./pages/MedicationSchedules";
import { QueryProvider } from "./providers/QueryProvider";
import { PatientProvider } from "./contexts/PatientContext";

function App() {
  return (
    <QueryProvider>
      <PatientProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<PatientList />} />
            <Route
              path="/patient/:patientId/medications"
              element={<MedicationList />}
            />
            <Route
              path="/patient/:patientId/schedules"
              element={<MedicationSchedules />}
            />
          </Routes>
        </BrowserRouter>
      </PatientProvider>
    </QueryProvider>
  );
}

export default App;
