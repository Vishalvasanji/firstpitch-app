import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoachAuthPage from "./pages/CoachAuthPage";
import CoachDashboard from "./pages/CoachDashboard"; // placeholder for now
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachAuthPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <CoachDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

