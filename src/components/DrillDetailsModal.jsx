import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
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
          className="w-full max-w-md mx-auto rounded-lg shadow-md aspect-video object-cover mb-4"
        />
      )}

      <p className="text-xl font-semibold text-gray-600 mb-4 text-left">Due: {formatDate(drill.dueDate)}</p>

      <div className="flex items-center gap-2 mb-1">
  <p className="text-xl font-semibold text-green-600">Completed</p>
  <span className="text-lg font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
    {completed.length}
  </span>
</div>
      <div className="space-y-2 mb-4">
        {completed.map(player => (
          <div key={player.id} className="flex items-center bg-white shadow rounded-xl p-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center mr-3">
              {`${player.firstName[0]}${player.lastName[0]}`}
            </div>
            <p className="text-md font-semibold text-gray-800">{player.firstName} {player.lastName}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-1">
  <p className="text-xl font-semibold text-red-600">Not Completed</p>
  <span className="text-md font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full">
    {incomplete.length}
  </span>
</div>
      <div className="space-y-2 mb-4">
        {incomplete.map(player => (
          <div key={player.id} className="flex items-center bg-white shadow rounded-xl p-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center mr-3">
              {`${player.firstName[0]}${player.lastName[0]}`}
            </div>
            <p className="text-md font-semibold text-gray-800">{player.firstName} {player.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
