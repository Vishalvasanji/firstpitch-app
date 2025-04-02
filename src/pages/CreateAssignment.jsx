import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function CreateAssignment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 pb-24">
      {/* Title at the top */}
      <div className="pt-6 px-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">Create Assignment</h1>
      </div>

      {/* Cards aligned to top with spacing */}
      <div className="px-4 mt-6 flex flex-col space-y-6">
        <div
          onClick={() => navigate("/create-drill")}
          className="w-full max-w-md h-32 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800">📘 Create Drill</h2>
          <p className="text-sm text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        <div
          onClick={() => navigate("/create-quiz")}
          className="w-full max-w-md h-32 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-800">📝 Create Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}