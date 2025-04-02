import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function CreateAssignment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col justify-between pb-24">
      {/* Title */}
      <div className="text-center pt-6 px-4">
        <h1 className="text-2xl font-bold text-blue-800">Create Assignment</h1>
      </div>

      {/* Card Buttons */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 space-y-6 mt-6">
        <div
          onClick={() => navigate("/create-drill")}
          className="w-full max-w-md h-64 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📘 Create Drill</h2>
          <p className="text-sm text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        <div
          onClick={() => navigate("/create-quiz")}
          className="w-full max-w-md h-64 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📝 Create Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
