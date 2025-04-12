import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function CoachDashboard() {
  const [activity, setActivity] = useState([]);
  const [drillStatus, setDrillStatus] = useState({ completed: 0, total: 0 });
  const navigate = useNavigate();

  const teamId = sessionStorage.getItem("currentTeamId");
  const teamName = sessionStorage.getItem("currentTeamName") || "Team Name";
  const coachName = sessionStorage.getItem("coachName") || "coach";

  useEffect(() => {
    if (!teamId) return;

    const q = query(
      collection(db, "assignments"),
      where("type", "==", "drill"),
      where("teamId", "==", teamId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      let allStatuses = [];
      for (let assignment of assignments) {
        const statusSnap = await onSnapshot(
          collection(db, "assignments", assignment.id, "assignmentStatuses"),
          (subSnap) => {
            const statuses = subSnap.docs.map(d => d.data());
            allStatuses.push(...statuses);
            const completed = allStatuses.filter(s => s.status === "completed").length;
            const total = allStatuses.length;
            setDrillStatus({ completed, total });
          }
        );
      }
    });

    return () => unsubscribe();
  }, [teamId]);

  const percentComplete = drillStatus.total > 0 ? (drillStatus.completed / drillStatus.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Coach {coachName}</h1>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {teamName}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Drills</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {drillStatus.total}
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {drillStatus.completed} of {drillStatus.total} completed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Quizzes</h3>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                0
              </span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full w-0" />
              </div>
              <p className="text-sm text-gray-600">0 of 0 completed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/create-drill")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Drill
          </button>
          <button
            onClick={() => navigate("/create-quiz")}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            New Quiz
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((a) => (
                <div key={a.id} className="flex items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold rounded-full flex items-center justify-center mr-3">
                    {a.player.split(" ").map(n => n[0]).join("")}
                  </div>
                  <p className="text-gray-700">{a.action}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
