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
      { id: 3, player: "Leo B", action: "Completed quiz: Rules of the Game" },
      { id: 4, player: "Leo B", action: "Completed quiz: Rules of the Game" },
      { id: 5, player: "Leo B", action: "Completed quiz: Rules of the Game" },
      { id: 6, player: "Leo B", action: "Completed quiz: Rules of the Game" },
    ]);
  }, []);

  const totalDrills = drills.reduce((sum, d) => sum + d.total, 0);
  const completedDrills = drills.reduce((sum, d) => sum + d.completed, 0);
  const drillPercent = totalDrills > 0 ? (completedDrills / totalDrills) * 100 : 0;

  const totalQuizzes = quizzes.reduce((sum, q) => sum + q.total, 0);
  const completedQuizzes = quizzes.reduce((sum, q) => sum + q.completed, 0);
  const quizPercent = totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-center text-4xl font-bold text-blue-800">Coach {coachName}</p>
          <h1 className="text-center text-lg font-bold text-gray-800">{teamName}</h1>
        </div>

        {/* Drill Summary */}
        <div className="mt-6 space-y-6">
          <div className="bg-white shadow rounded-xl p-4 space-y-2">
            <p className="text-lg font-semibold text-gray-800">Drill Progress</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${drillPercent}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">{completedDrills} of {totalDrills} completed</p>
          </div>

          {/* Quiz Summary */}
          <div className="bg-white shadow rounded-xl p-4 space-y-2">
            <p className="text-lg font-semibold text-gray-800">Quiz Progress</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${quizPercent}%` }}></div>
            </div>
            <p className="text-sm text-gray-600">{completedQuizzes} of {totalQuizzes} completed</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="space-y-4">
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

        {/* Bottom Spacer to prevent clipping */}
        <div className="h-24" />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
