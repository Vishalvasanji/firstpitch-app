import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

export default function CreateDrill() {
  const [title, setTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [assignToAll, setAssignToAll] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      const teamId = sessionStorage.getItem("currentTeamId");
      if (!teamId) return;

      const playerQuery = query(
        collection(db, "players"),
        where("teamId", "==", teamId),
        where("verified", "==", true)
      );
      const snapshot = await getDocs(playerQuery);
      const playerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerList);
    };

    fetchPlayers();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setVideoFile(file);
  };

  const togglePlayer = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const coach = auth.currentUser;
    if (!coach) return;

    const teamId = sessionStorage.getItem("currentTeamId");
    if (!teamId) return;

    let videoURL = videoLink;

    if (videoFile) {
      const storageRef = ref(storage, `drills/${uuidv4()}-${videoFile.name}`);
      await uploadBytes(storageRef, videoFile);
      videoURL = await getDownloadURL(storageRef);
    }

    const drillDoc = {
      title,
      instructions,
      videoURL,
      dueDate,
      teamId,
      createdBy: coach.uid,
      assignedTo: assignToAll ? "all" : selectedPlayers,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "drills"), drillDoc);
    navigate("/drills");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-6 pb-28">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Title */}
        <input
          type="text"
          placeholder="Drill Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-xl shadow-sm"
          required
        />

        {/* Video Section */}
        <div className="flex space-x-2">
          <input
            type="url"
            placeholder="Paste video link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="flex-1 p-3 border rounded-xl"
          />
          <label className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-blue-700">
            Upload
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        {/* Instructions */}
        <textarea
          placeholder="Instructions for the drill..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-xl shadow-sm"
        />

        {/* Due Date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-3 border rounded-xl shadow-sm"
        />

        {/* Assign To */}
        <div className="space-y-3">
          {/* Entire Team Option */}
          <div
            onClick={() => {
              setAssignToAll(true);
              setSelectedPlayers([]);
            }}
            className={`p-4 rounded-xl shadow cursor-pointer ${
              assignToAll
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-white"
            }`}
          >
            Assign to Entire Team
          </div>

          {/* Individual Players */}
          {!assignToAll &&
            players.map((player) => (
              <div
                key={player.id}
                onClick={() => togglePlayer(player.id)}
                className={`p-4 rounded-xl shadow cursor-pointer ${
                  selectedPlayers.includes(player.id)
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-white"
                }`}
              >
                {`${player.firstName} ${player.lastName[0]}`}
              </div>
            ))}

          {assignToAll ? (
            <button
              type="button"
              onClick={() => setAssignToAll(false)}
              className="text-sm text-blue-600 underline mt-1"
            >
              Or assign to specific players
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Tap player cards to select or deselect.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          Send Drill
        </button>
      </form>
    </div>
  );
}
