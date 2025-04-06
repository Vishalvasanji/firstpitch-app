import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function DrillDetailsModal({ drill, assignmentId, teamId, onClose }) {
  const [players, setPlayers] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!assignmentId || !teamId) return;

      // Get all players on the team
      const playerQuery = query(
        collection(db, "players"),
        where("teamId", "==", teamId),
        where("verified", "==", true)
      );
      const playerSnap = await getDocs(playerQuery);
      const playersList = playerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get all assignment statuses for this drill
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
    const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeId(drill.videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

  return (
    <div className="fixed inset-0 bg-white z-50 px-4 pt-6 pb-28 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800">{drill.title}</h2>
        <button onClick={onClose} className="text-blue-600 font-medium">Close</button>
      </div>

      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt="Video thumbnail"
          className="w-full max-w-md mx-auto rounded-lg shadow-md"
        />
      )}

      <a
        href={drill.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-blue-600 underline my-2"
      >
        View Full Video
      </a>

      <p className="text-sm text-gray-600 mb-4 text-center">Due: {formatDate(drill.dueDate)}</p>

      <p className="text-sm font-semibold text-green-600 mb-1">Completed ({completed.length})</p>
      <div className="space-y-2 mb-4">
        {completed.map(player => (
          <div key={player.id} className="bg-green-50 px-3 py-2 rounded-lg text-sm text-gray-700">
            {player.firstName} {player.lastName[0]}
          </div>
        ))}
      </div>

      <p className="text-sm font-semibold text-red-600 mb-1">Not Completed ({incomplete.length})</p>
      <div className="space-y-2">
        {incomplete.map(player => (
          <div key={player.id} className="bg-red-50 px-3 py-2 rounded-lg text-sm text-gray-700">
            {player.firstName} {player.lastName[0]}
          </div>
        ))}
      </div>
    </div>
  );
}
