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
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-center text-4xl font-bold text-blue-800">Coach {coachName}</p>
          <h1 className="text-center text-lg font-bold text-gray-800">{teamName}</h1>
        </div>

        {/* Drill Summary */}
        <div className="mt-6 space-y-6">
          <div
            className="bg-white shadow rounded-xl p-4 space-y-2 cursor-pointer hover:shadow-lg"
            onClick={() => navigate("/drills")}
          >
            <div className="flex items-center justify-between">
  <p className="text-lg font-semibold text-gray-800">Drill Progress</p>
  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
    {drillStatus.total > 0 ? drillStatus.total : 0}
  </span>
</div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {drillStatus.completed} of {drillStatus.total} completed
            </p>
          </div>

          {/* Quiz Summary Placeholder */}
          <div className="bg-white shadow rounded-xl p-4 space-y-2">
            <p className="text-lg font-semibold text-gray-800">Quiz Progress</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `0%` }}></div>
            </div>
            <p className="text-sm text-gray-600">0 of 0 completed</p>
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

        {/* Bottom Spacer */}
        <div className="h-24" />
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
