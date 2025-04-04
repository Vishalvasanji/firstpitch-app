import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import BottomNav from "../components/BottomNav";
import { useUser } from "../hooks/useUser";

export default function CreateDrill() {
  const navigate = useNavigate();
  const { user, teamId } = useUser();

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
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

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

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

    let finalVideoLink = videoLink;
    if (videoFile) {
      const storageRef = ref(storage, `drill-videos/${uuidv4()}`);
      await uploadBytes(storageRef, videoFile);
      finalVideoLink = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "drills"), {
      title,
      instructions,
      videoURL: finalVideoLink,
      dueDate,
      teamId,
      coachId: user.uid,
      assignedTo: assignToTeam ? "all" : selectedPlayers,
      createdAt: serverTimestamp(),
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

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
        <h1 className="text-center text-2xl font-bold text-blue-700 mb-4">Create Drill</h1>

        <div className="space-y-4">

        <input
          type="text"
          placeholder="Drill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-1 ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && <p className="text-red-500 text-sm mb-2">{errors.title}</p>}

        <div className="flex items-center gap-2 mb-4">
          <label className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer">
            +
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
          </label>
          <input
            type="text"
            placeholder="Paste video link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="flex-grow border rounded-xl p-3"
          />
        </div>

        <textarea
          rows="6"
          placeholder="Instructions for the drill..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className={`w-full border rounded-xl p-3 mb-1 resize-y ${errors.instructions ? "border-red-500" : ""}`}
        />
        {errors.instructions && <p className="text-red-500 text-sm mb-2">{errors.instructions}</p>}

        <div className="flex items-center gap-4 mb-1">
          <label className="text-gray-700 font-medium">Due Date</label>
          $1 placeholder="Select Date"> setDueDate(e.target.value)}
            placeholder="Select Date"
            className={`border rounded-xl p-3 flex-grow ${errors.dueDate ? "border-red-500" : ""}`}
          />
        </div>
        {errors.dueDate && <p className="text-red-500 text-sm mb-2">{errors.dueDate}</p>}

        <div className="mt-6 mb-4">
          <div className="bg-white rounded-xl p-1 flex gap-1 mb-4 max-w-md mx-auto">
            <button
              onClick={() => {
                setAssignToTeam(true);
                setSelectedPlayers([]);
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                assignToTeam
                  ? "bg-white text-black shadow-sm"
                  : "bg-gray-100 text-gray-500"
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
                !assignToTeam
                  ? "bg-white text-black shadow-sm"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Specific Players
            </button>
          </div>

          {!assignToTeam && (
            <div className="space-y-2 max-w-md mx-auto">
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

        {/* Spacer to ensure visibility above fixed nav */}
        <div className="h-24" />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav />
      </div>
    </div>
  );
}
