import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

export default function CoachDashboard() {
  const [drills, setDrills] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [activity, setActivity] = useState([]);

  // Pull coach + team info from sessionStorage
  const teamName = sessionStorage.getItem("currentTeamName") || "Team Name";
  const coachName = sessionStorage.getItem("coachName") || "coach";

  useEffect(() => {
    // Example placeholders — replace with Firestore queries
    setDrills([
      { id: 1, title: "Base Running", completed: 2, total: 5 },
      { id: 2, title: "Throwing Accuracy", completed: 4, total: 5 },
    ]);

    setQuizzes([
      { id: 1, title: "Rules of the Game", completed: 3, total: 5 },
    ]);

    setActivity([
      { id: 1, player: "Aiden R", action: "Completed drill: Base Running" },
      { id: 2, player: "Leo B", action: "Completed quiz: Rules of the Game" },
    ]);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-24 px-4">
      {/* Header */}
      <div className="pt-6 space-y-1">
        <h1 className="text-center text-gray-800 font-medium text-sm">{teamName}</h1>
        <p className="text-left text-4xl font-bold text-blue-800">Coach {coachName}</p>
      </div>

      {/* Progress Cards */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Drills</h2>
        {drills.map((drill) => {
          const percent = (drill.completed / drill.total) * 100;
          return (
            <div key={drill.id} className="bg-white shadow rounded-xl p-4 space-y-2">
              <p className="text-lg font-semibold text-gray-800">{drill.title}</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-blue-600 h-2 rounded" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="text-sm text-gray-600">{drill.completed} of {drill.total} completed</p>
            </div>
          );
        })}

        <h2 className="text-xl font-semibold text-gray-700 mt-6">Quizzes</h2>
        {quizzes.map((quiz) => {
          const percent = (quiz.completed / quiz.total) * 100;
          return (
            <div key={quiz.id} className="bg-white shadow rounded-xl p-4 space-y-2">
              <p className="text-lg font-semibold text-gray-800">{quiz.title}</p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-green-600 h-2 rounded" style={{ width: `${percent}%` }}></div>
              </div>
              <p className="text-sm text-gray-600">{quiz.completed} of {quiz.total} completed</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Activity</h2>
        <div className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="flex items-center bg-white shadow rounded-xl p-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center mr-3">
                {a.player.split(" ").map(n => n[0]).join("")}
              </div>
              <p className="text-gray-700 text-sm">{a.action}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
