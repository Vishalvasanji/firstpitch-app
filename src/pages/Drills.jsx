import { useEffect, useState } from "react";
import DrillDetailsModal from "../components/DrillDetailsModal";
import CreateDrillModal from "../components/CreateDrillModal";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import BottomNav from "../components/BottomNav";
import { useUser } from "../hooks/useUser";

export default function CoachDrillsPage() {
  const navigate = useNavigate();
  const { user, teamId } = useUser();
  const [drills, setDrills] = useState([]);
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [showClosed, setShowClosed] = useState(false);
  const [showDrillModal, setShowDrillModal] = useState(false);

  useEffect(() => {
    async function fetchDrills() {
      if (!teamId) return;
      const assignmentQuery = query(
        collection(db, "assignments"),
        where("teamId", "==", teamId),
        where("type", "==", "drill")
      );
      const assignmentSnap = await getDocs(assignmentQuery);

      const drillPromises = assignmentSnap.docs.map(async (assignmentDoc) => {
        const assignment = { id: assignmentDoc.id, ...assignmentDoc.data() };
        const drillRef = doc(db, "drills", assignment.contentId);
        const drillSnap = await getDoc(drillRef);

        let drill = drillSnap.exists()
          ? {
              id: drillSnap.id,
              ...drillSnap.data(),
              assignmentId: assignment.id,
              dueDate: assignment.dueDate,
            }
          : null;

        const statusSnap = await getDocs(
          collection(db, "assignments", assignment.id, "assignmentStatuses")
        );

        const total = statusSnap.size;
        const completed = statusSnap.docs.filter(
          (doc) => doc.data().status === "completed"
        ).length;

        return drill ? { ...drill, total, completed } : null;
      });

      const results = await Promise.all(drillPromises);
      setDrills(results.filter(Boolean));
    }

    fetchDrills();
  }, [teamId]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const openDrills = drills.filter((drill) => new Date(drill.dueDate) >= new Date());
  const closedDrills = drills.filter((drill) => new Date(drill.dueDate) < new Date());

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
        <div className="relative mb-4">
          <h1 className="text-lg font-bold text-blue-800 text-center">Drills</h1>
          <button
            onClick={() => setShowDrillModal(true)}
            className="absolute right-0 top-0 w-10 h-10 rounded-full bg-blue-600 text-white shadow-md flex items-center justify-center text-xl hover:bg-blue-700"
            aria-label="Add Drill"
          >
            +
          </button>
        </div>

        <div className="space-y-4">
          {openDrills.map((drill) => {
            const completionPercent = drill.total
              ? Math.round((drill.completed / drill.total) * 100)
              : 0;

            return (
              <div
                key={drill.id}
                className="bg-white rounded-xl shadow-md p-4 space-y-2 cursor-pointer"
                onClick={() => setSelectedDrill(drill)}
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-800">{drill.title}</h2>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Open</span>
                </div>
                <p className="text-sm text-gray-600">Due: {formatDate(drill.dueDate)}</p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {drill.completed} of {drill.total} completed
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowClosed(!showClosed)}
          >
            <p className="text-xl font-semibold text-gray-600">Closed</p>
            <span className="text-xl text-gray-600">{showClosed ? "▲" : "▼"}</span>
          </div>
          {showClosed && (
            <div className="space-y-4 mt-4">
              {closedDrills.map((drill) => {
                const completionPercent = drill.total
                  ? Math.round((drill.completed / drill.total) * 100)
                  : 0;

                return (
                  <div
                    key={drill.id}
                    className="bg-white rounded-xl shadow-md p-4 space-y-2 cursor-pointer"
                    onClick={() => setSelectedDrill(drill)}
                  >
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-800">{drill.title}</h2>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-700">Closed</span>
                    </div>
                    <p className="text-sm text-gray-600">Due: {formatDate(drill.dueDate)}</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {drill.completed} of {drill.total} completed
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-24" />

        {selectedDrill && (
          <DrillDetailsModal
            drill={selectedDrill}
            assignmentId={selectedDrill.assignmentId}
            teamId={teamId}
            onClose={() => setSelectedDrill(null)}
          />
        )}

        {showDrillModal && (
          <CreateDrillModal
            handleClose={() => setShowDrillModal(false)}
          />
        )}

        <div className="fixed bottom-0 left-0 right-0">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
