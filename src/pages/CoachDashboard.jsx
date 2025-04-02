import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import BottomNav from "../components/BottomNav";

export default function CoachDashboard() {
  const [coachName, setCoachName] = useState("Coach");
  const [teamName, setTeamName] = useState("Your Team");
  const [drillProgress, setDrillProgress] = useState({ completed: 3, total: 5 });
  const [quizProgress, setQuizProgress] = useState({ completed: 1, total: 3 });
  const [activity, setActivity] = useState([
    { id: 1, type: "completed", name: "Aiden R", message: "completed 'Throwing Basics'" },
    { id: 2, type: "joined", name: "Emma K", message: "joined the team" },
    { id: 3, type: "quiz", name: "Noah M", message: "started 'Pitching Quiz #1'" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const coachRef = collection(db, "coaches");
      const coachQuery = query(coachRef, where("uid", "==", user.uid));
      const coachSnap = await getDocs(coachQuery);
      const coachData = coachSnap.docs[0]?.data();
      setCoachName(coachData?.firstName || "Coach");
      setTeamName(coachData?.teamName || "Your Team");
    };

    fetchData();
  }, []);

  const ProgressCard = ({ title, completed, total }) => (
    <div className="bg-white shadow rounded-xl p-4 space-y-2 w-full">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${(completed / total) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600">{completed} of {total} completed</p>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white to-blue-50 flex flex-col justify-between pb-20">
      {/* Header */}
      <div className="px-4 pt-6 space-y-1">
        <p className="text-xl font-semibold text-gray-800 text-left">Coach {coachName}</p>
        <h1 className="text-center text-2xl font-bold text-blue-800">{teamName}</h1>
      </div>

      {/* Progress Section */}
      <div className="px-4 py-4 space-y-4">
        <ProgressCard title="Drills Progress" completed={drillProgress.completed} total={drillProgress.total} />
        <ProgressCard title="Quizzes Progress" completed={quizProgress.completed} total={quizProgress.total} />
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h2 className="text-md font-semibold text-gray-700 mb-2">Recent Activity</h2>
        <div className="space-y-2">
          {activity.map((item) => (
            <div key={item.id} className="flex items-start space-x-3 bg-white p-3 rounded-xl shadow">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                {item.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 text-sm text-gray-800">
                <span className="font-medium">{item.name}</span> {item.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

