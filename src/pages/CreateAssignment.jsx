import { useNavigate } from "react-router-dom";

export default function CreateAssignment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative px-4">
      {/* X Close Button */}
      <button
        className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
        onClick={() => navigate("/dashboard")}
        aria-label="Close"
      >
        ×
      </button>

      {/* Assignment Cards */}
      <div className="w-full max-w-md space-y-8">
        <div
          onClick={() => navigate("/create-drill")}
          className="h-64 bg-gray-50 shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📘 Create Drill</h2>
          <p className="text-sm text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        <div
          onClick={() => navigate("/create-quiz")}
          className="h-64 bg-gray-50 shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800">📝 Create Quiz</h2>
          <p className="text-sm text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>
    </div>
  );
}