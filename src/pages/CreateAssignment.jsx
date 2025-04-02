import { useNavigate } from "react-router-dom";

export default function CreateAssignment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-xl font-bold text-center text-blue-800 mb-4">Create Assignment</h1>

        {/* Drill Card */}
        <div
          onClick={() => navigate("/create-drill")}
          className="cursor-pointer bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">📘 Create Drill</h2>
          <p className="text-sm text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        {/* Quiz Card */}
        <div
          onClick={() => navigate("/create-quiz")}
          className="cursor-pointer bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-gray-800">📝 Create Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>
    </div>
  );
}
