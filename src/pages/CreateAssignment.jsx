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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Assignment</h1>
          <p className="text-gray-600">Choose the type of assignment to create</p>
        </div>

        {/* Assignment Types Grid */}
        <div className="grid gap-4">
          <button
            onClick={() => setShowDrillModal(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Video Drill</h2>
                <p className="text-gray-600">Create a video-based training drill</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowQuizModal(true)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Knowledge Quiz</h2>
                <p className="text-gray-600">Test players' baseball knowledge</p>
              </div>
            </div>
          </button>
        </div>

        {/* Quick Tips Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Tips</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Keep video drills under 5 minutes
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Use age-appropriate language
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Set reasonable due dates
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
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

      {showDrillModal && (
        <CreateDrillModal
          handleClose={() => setShowDrillModal(false)}
        />
      )}

      <BottomNav />
    </div>
  );
}
