import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import GenerateQuizModal from "../components/GenerateQuizModal";
import CreateDrillModal from "../components/CreateDrillModal";

export default function CreateAssignment() {
  const navigate = useNavigate();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    const storedAgeGroup = sessionStorage.getItem("currentTeamAgeGroup");
    if (storedAgeGroup) {
      setAgeGroup(storedAgeGroup);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50 pb-24">
      {/* Title at the top */}
      <div className="pt-6 px-4">
        <h1 className="text-lg font-bold text-blue-800 text-center">Create Assignment</h1>
      </div>

      {/* Cards aligned to top with spacing */}
      <div className="px-4 mt-6 flex flex-col space-y-6">
        <div
          onClick={() => setShowDrillModal(true)}
          className="w-full max-w-md h-32 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition mx-auto"
        >
          <h2 className="text-xl font-semibold text-gray-800">Create Drill</h2>
          <p className="text-md text-gray-500 mt-1">Upload or link a video-based drill</p>
        </div>

        <div
          onClick={() => setShowQuizModal(true)}
          className="w-full max-w-md h-32 bg-white shadow-md rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:shadow-lg transition mx-auto"
        >
          <h2 className="text-xl font-semibold text-gray-800">Create Quiz</h2>
          <p className="text-md text-gray-500 mt-1">Build a knowledge-based quiz for players</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>

      {/* Generate Quiz Modal */}
      {showQuizModal && (
        <GenerateQuizModal
          handleClose={() => setShowQuizModal(false)}
          handleGenerate={(data) => {
            console.log("Generate quiz with:", data);
            setShowQuizModal(false);
          }}
          ageGroup={ageGroup}
        />
      )}

      {/* Create Drill Modal */}
      {showDrillModal && (
        <CreateDrillModal
          handleClose={() => setShowDrillModal(false)}
        />
      )}
    </div>
  );
}
