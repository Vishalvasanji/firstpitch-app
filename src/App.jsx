import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoachAuthPage from "./pages/CoachAuthPage";
import CreateTeam from "./pages/CreateTeam";
import CoachDashboard from "./pages/CoachDashboard";
import PrivateRoute from "./components/PrivateRoute";
import JoinTeam from "./pages/JoinTeam";
import PlayerRegister from "./pages/PlayerRegister";
import VerifyCode from "./pages/VerifyCode";
import CreateAssignment from "./pages/CreateAssignment";
import CreateDrill from "./pages/CreateDrill";
import Drills from "./pages/Drills";
import CreateQuiz from "./pages/CreateQuiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachAuthPage />} />
        <Route path="/join" element={<JoinTeam />} />
        <Route path="/player-register" element={<PlayerRegister />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        
        <Route
          path="/create-team"
          element={
              <CreateTeam />
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
        <Route
          path="/create-assignment"
          element={
            <PrivateRoute>
              <CreateAssignment />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-drill"
          element={
            <PrivateRoute>
              <CreateDrill />
            </PrivateRoute>
          }
        />
        <Route 
          path="/drills" 
          element={
            <PrivateRoute>
              <Drills />
            </PrivateRoute>
          }
        />
        <Route 
          path="/create-quiz"
          element={
            <PrivateRoute>
              <CreateQuiz />
            <PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
