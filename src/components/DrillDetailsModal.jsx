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
      <div className="flex justify-center items-center relative mb-4">
        <h2 className="text-xl font-bold text-blue-800 text-center w-full">{drill.title}</h2>
        <button onClick={onClose} className="text-blue-600 font-medium">Close</button>
      </div>

      {thumbnailUrl && (
        <a
          href={drill.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block w-full max-w-md mx-auto aspect-video"
        >
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="rounded-lg shadow-md w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </a>
      )}

      

      <p className="text-xl font-semibold text-gray-600 mb-4 text-left">Due: {formatDate(drill.dueDate)}</p>

      <p className="text-xl font-semibold text-green-600 mb-1">Completed ({completed.length})</p>
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

      <p className="text-xl font-semibold text-red-600 mb-1">Not Completed ({incomplete.length})</p>
      <div className="space-y-2">
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
