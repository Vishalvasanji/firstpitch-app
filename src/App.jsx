import CoachAuthPage from "./pages/CoachAuthPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CoachAuthPage />} />
        {/* Add player join code screen later */}
      </Routes>
    </Router>
  );
}

export default App;
