import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoachAuthPage from "./pages/CoachAuthPage";
import CreateTeam from "./pages/CreateTeam";
import CoachDashboard from "./pages/CoachDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachAuthPage />} />
        <Route
          path="/create-team"
          element={
            <PrivateRoute>
              <CreateTeam />
            </PrivateRoute>
          }
        />
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
