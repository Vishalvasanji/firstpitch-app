import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../hooks/useUser";

export default function CreateDrillModal({ handleClose }) {
  const navigate = useNavigate();
  const { user, teamId } = useUser(); 
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignToTeam, setAssignToTeam] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchPlayers() {
      if (!teamId) return;
      const q = query(
        collection(db, "players"),
        where("teamId", "==", teamId),
        where("verified", "==", true)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(list);
    }
    fetchPlayers();
  }, [teamId]);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required.";
    if (!instructions) newErrors.instructions = "Instructions are required.";
    if (!dueDate) newErrors.dueDate = "Due date is required.";
    if (!assignToTeam && selectedPlayers.length === 0)
      newErrors.players = "Select at least one player.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const drillRef = await addDoc(collection(db, "drills"), {
      title,
      instructions,
      videoUrl: videoLink,
      teamId,
      createdBy: user?.uid,
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, "assignments"), {
      contentId: drillRef.id,
      teamId,
      dueDate,
      assignedTo: assignToTeam ? "all" : selectedPlayers,
      type: "drill",
      createdAt: serverTimestamp(),
      status: "open",
    });

    navigate("/drills");
  };

  const togglePlayer = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleVideoLinkChange = (e) => {
    const url = e.target.value;
    setVideoLink(url);

    const rawId = url.includes("v=")
      ? url.split("v=")[1]?.split("&")[0]
      : url.split("/").pop()?.split("?")[0];

    const videoId = rawId?.trim();
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/0.jpg`);
    } else {
      setThumbnailUrl("");
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 px-4 pt-6 pb-28 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-800">Create Drill</h1>
        <button onClick={handleClose} className="text-blue-600 font-medium">Close</button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Drill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-1 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>}

        <input
          type="text"
          placeholder="Paste video link"
          value={videoLink}
          onChange={handleVideoLinkChange}
          className="w-full border rounded-xl p-3"
        />

        {thumbnailUrl && (
          <div className="mt-3 aspect-video items-center w-full max-w-sm overflow-hidden rounded-lg shadow-md">
            <img
              src={thumbnailUrl}
              alt="Video preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <textarea
          rows="6"
          placeholder="Instructions for the drill..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-1 resize-y ${errors.instructions ? "border-red-500" : ""}`}
        />
        {errors.instructions && <p className="text-red-500 text-sm mb-2">{errors.instructions}</p>}

        <div className="flex items-center gap-2 mb-2">
          <label className="text-gray-700 font-medium">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Select Date"
            className={`border rounded-xl p-3 flex-grow ${errors.dueDate ? "border-red-500" : ""}`}
          />
        </div>
        {errors.dueDate && <p className="text-red-500 text-sm mb-2">{errors.dueDate}</p>}

        <div className="mt-6 mb-4">
          <div className="bg-white rounded-xl p-1 flex gap-1 mb-4 w-[80%] mx-auto">
            <button
              onClick={() => {
                setAssignToTeam(true);
                setSelectedPlayers([]);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                assignToTeam ? "bg-white text-black shadow-sm" : "bg-gray-100 text-gray-500"
              }`}
            >
              Entire Team
            </button>
            <button
              onClick={() => {
                setAssignToTeam(false);
                setSelectedPlayers([]);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                !assignToTeam ? "bg-white text-black shadow-sm" : "bg-gray-100 text-gray-500"
              }`}
            >
              Specific Players
            </button>
          </div>

          {!assignToTeam && (
            <div className="space-y-4 max-w-md mx-auto">
              {players.map((p) => (
                <div
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={`p-4 rounded-xl shadow cursor-pointer ${
                    selectedPlayers.includes(p.id)
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white"
                  }`}
                >
                  {p.firstName} {p.lastName[0]}
                </div>
              ))}
              {errors.players && <p className="text-red-500 text-sm mt-2">{errors.players}</p>}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-xl py-3 mt-6"
        >
          Send Drill
        </button>
      </div>
    </div>
  );
}
