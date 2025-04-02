import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoachAuthPage from "./pages/CoachAuthPage";
import CreateTeam from "./pages/CreateTeam";
import CoachDashboard from "./pages/CoachDashboard";
import PrivateRoute from "./components/PrivateRoute";
import JoinTeam from "./pages/JoinTeam";
import PlayerRegister from "./pages/PlayerRegister";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachAuthPage />} />
        <Route path="/join" element={<JoinTeam />} />
        <Route path="/player-register" element={<PlayerRegister />} />

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
