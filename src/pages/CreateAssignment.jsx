import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function CreateAssignment() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Title */}
      <div className="py-4 px-4">
        <h1 className="text-2xl font-bold text-center text-blue-800">Create Assignment</h1>
      </div>

      {/* Cards wrapper - flex-1 fills remaining height */}
      <div className="flex-1 flex flex-col justify-center items-center space-y-8 px-4">
        {/* Drill Card */}
        <div
          onClick={() => navigate("/create-drill")}
          className="w-full max-w-md h-64 bg-white shadow-lg rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📘 Create Drill</h2>
          <p className="text-sm text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        {/* Quiz Card */}
        <div
          onClick={() => navigate("/create-quiz")}
          className="w-full max-w-md h-64 bg-white shadow-lg rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📝 Create Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>

      {/* Bottom Navigation (persistent) */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
