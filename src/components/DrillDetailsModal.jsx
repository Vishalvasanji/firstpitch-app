import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function DrillDetailsModal({ drill, assignmentId, teamId, onClose }) {
  const [players, setPlayers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!assignmentId || !teamId) return;

      const playerQuery = query(
        collection(db, "players"),
        where("teamId", "==", teamId),
        where("verified", "==", true)
      );
      const playerSnap = await getDocs(playerQuery);
      const playersList = playerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const statusSnap = await getDocs(collection(db, "assignments", assignmentId, "assignmentStatuses"));
      const statusList = statusSnap.docs.map(doc => doc.data());

      setPlayers(playersList);
      setStatuses(statusList);
    }

    fetchData();
  }, [assignmentId, teamId]);

  const completed = players.filter(player =>
    statuses.find(status => status.playerId === player.id && status.status === "completed")
  );

  const incomplete = players.filter(player =>
    !completed.find(c => c.id === player.id)
  );

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const extractYouTubeId = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'youtu.be') {
        return parsedUrl.pathname.split('/')[1];
      } else if (parsedUrl.hostname.includes('youtube.com')) {
        return parsedUrl.searchParams.get('v');
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const videoId = extractYouTubeId(drill.videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

  const isClosed = new Date(drill.dueDate) < new Date();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{drill.title}</h2>
            <p className="text-sm text-gray-500">Due: {formatDate(drill.dueDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isClosed ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
            }`}>
              {isClosed ? 'Closed' : 'Open'}
            </span>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {thumbnailUrl && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-green-600">Completed</h3>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {completed.length}
                </span>
              </div>
              <div className="grid gap-2">
                {completed.map(player => (
                  <div key={player.id} className="flex items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 text-white font-bold rounded-full flex items-center justify-center mr-3">
                      {`${player.firstName[0]}${player.lastName[0]}`}
                    </div>
                    <p className="font-medium text-gray-900">{player.firstName} {player.lastName}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-red-600">Not Completed</h3>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {incomplete.length}
                </span>
              </div>
              <div className="grid gap-2">
                {incomplete.map(player => (
                  <div key={player.id} className="flex items-center bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 text-white font-bold rounded-full flex items-center justify-center mr-3">
                      {`${player.firstName[0]}${player.lastName[0]}`}
                    </div>
                    <p className="font-medium text-gray-900">{player.firstName} {player.lastName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
