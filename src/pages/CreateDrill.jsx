import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
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
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
      videoLink: finalVideoLink,
      dueDate,
      teamId,
      coachId: user.uid,
      assignedTo: assignToTeam ? "team" : selectedPlayers,
      createdAt: new Date(),
    });

    navigate("/drills");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between pb-20">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">Create Drill</h1>

        <input
          type="text"
          placeholder="Drill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl p-3 mb-3"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Paste video link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="flex-grow border rounded-xl p-3"
          />
          <label className="bg-blue-600 text-white px-4 rounded-xl flex items-center justify-center">
            +
            <input type="file" accept="video/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <textarea
          rows="4"
          placeholder="Instructions for the drill..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full border rounded-xl p-3 h-32 resize-y mb-3"
        />

        <label className="text-gray-600 mb-1 block ml-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-xl p-3 mb-3"
        />

        <div className="border rounded-xl p-4 mb-2 bg-blue-100 text-center font-semibold" onClick={() => setAssignToTeam(true)}>
          Assign to Entire Team
        </div>

        <p className="text-center text-sm text-blue-700 mb-2 underline" onClick={() => setAssignToTeam(false)}>
          Or assign to specific players
        </p>

        {!assignToTeam && players.map((p) => (
          <div
            key={p.id}
            onClick={() =>
              setSelectedPlayers((prev) =>
                prev.includes(p.id)
                  ? prev.filter((id) => id !== p.id)
                  : [...prev, p.id]
              )
            }
            className={`border rounded-xl p-3 mb-2 ${selectedPlayers.includes(p.id) ? "bg-blue-200" : ""}`}
          >
            {p.firstName} {p.lastInitial}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white rounded-xl py-3 mt-4"
        >
          Send Drill
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
