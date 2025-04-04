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

  useEffect(() => {
    async function fetchPlayers() {
      if (!teamId) return;
      const q = query(collection(db, "players"), where("teamId", "==", teamId), where("verified", "==", true));
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
    if (!title || !instructions || !dueDate || (!assignToTeam && selectedPlayers.length === 0)) {
      alert("Please complete all required fields.");
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
    <div className="min-h-screen bg-white pb-24 px-4">
      <h1 className="text-center text-2xl font-bold text-blue-700 my-4">Create Drill</h1>

      <input
        type="text"
        placeholder="Drill Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-xl p-3 mb-4"
      />

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Paste video link"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="flex-grow border rounded-xl p-3"
        />
        <label className="bg-blue-600 text-white px-4 rounded-xl flex items-center justify-center cursor-pointer">
          +
          <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <textarea
        rows="6"
        placeholder="Instructions for the drill..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full border rounded-xl p-3 mb-4 resize-y"
      />

      <div className="flex items-center gap-4 mb-4">
        <label className="text-gray-700 font-medium">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Select Date"
          className="border rounded-xl p-3 flex-grow"
        />
      </div>

      <div className="mb-2">
        <div
          onClick={() => {
            setAssignToTeam(true);
            setSelectedPlayers([]);
          }}
          className={`p-4 rounded-xl shadow cursor-pointer mb-2 ${
            assignToTeam ? "bg-blue-100 border-2 border-blue-500" : "bg-white"
          }`}
        >
          Assign to Entire Team
        </div>

        <div
          onClick={() => {
            setAssignToTeam(false);
            setSelectedPlayers([]);
          }}
          className={`text-sm text-blue-600 underline text-center cursor-pointer mb-3`}
        >
          Or assign to specific players
        </div>
      </div>

      {!assignToTeam && (
        <div className="space-y-2">
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
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white rounded-xl py-3 mt-6"
      >
        Send Drill
      </button>

      <BottomNav />
    </div>
  );
}
