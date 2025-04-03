import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUser } from "../context/UserContext";
import BottomNav from "../components/BottomNav";

const CreateDrill = () => {
  const [title, setTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [assignToAll, setAssignToAll] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!userData?.teamId) return;
      const q = query(
        collection(db, "players"),
        where("teamId", "==", userData.teamId),
        where("verified", "==", true)
      );
      const snapshot = await getDocs(q);
      const playerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerList);
    };

    fetchPlayers();
  }, [userData?.teamId]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = true;
    if (!instructions.trim()) newErrors.instructions = true;
    if (!dueDate) newErrors.dueDate = true;
    if (!assignToAll && selectedPlayers.length === 0)
      newErrors.assignment = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDrillSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let videoUrl = videoLink;

      if (uploadFile) {
        const storageRef = ref(storage, `drills/${uploadFile.name}`);
        await uploadBytes(storageRef, uploadFile);
        videoUrl = await getDownloadURL(storageRef);
      }

      const drillData = {
        title,
        videoUrl,
        instructions,
        dueDate,
        teamId: userData.teamId,
        createdBy: userData.uid,
        createdAt: new Date(),
        assignedTo: assignToAll
          ? "all"
          : selectedPlayers.map((player) => player.id),
      };

      await addDoc(collection(db, "drills"), drillData);
      navigate("/drills");
    } catch (error) {
      console.error("Error creating drill:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayerSelection = (player) => {
    if (selectedPlayers.some((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <h1 className="text-2xl font-bold text-blue-800 text-center mt-6 mb-4">
        Create Drill
      </h1>
      <form onSubmit={handleDrillSubmit} className="px-4 space-y-4 mb-24">
        <input
          type="text"
          placeholder="Drill Title"
          className={`w-full px-4 py-2 border rounded-xl ${
            errors.title ? "border-red-500" : ""
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Paste video link"
            className="flex-1 px-4 py-2 border rounded-xl"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <label className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer">
            Upload
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files[0])}
            />
          </label>
        </div>

        <textarea
          placeholder="Instructions for the drill..."
          className={`w-full px-4 py-2 border rounded-xl ${
            errors.instructions ? "border-red-500" : ""
          }`}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        <input
          type="date"
          className={`w-full px-4 py-2 border rounded-xl ${
            errors.dueDate ? "border-red-500" : ""
          }`}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div>
          <div
            className={`px-4 py-3 rounded-xl border font-medium text-center mb-2 ${
              assignToAll ? "bg-blue-100 border-blue-500" : "bg-white"
            } ${errors.assignment ? "border-red-500" : ""}`}
            onClick={() => {
              setAssignToAll(true);
              setErrors((prev) => ({ ...prev, assignment: false }));
            }}
          >
            Assign to Entire Team
          </div>
          <p
            className="text-sm text-blue-700 underline text-center cursor-pointer"
            onClick={() => setAssignToAll(false)}
          >
            Or assign to specific players
          </p>
        </div>

        {!assignToAll && (
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`px-4 py-3 rounded-xl border cursor-pointer ${
                  selectedPlayers.some((p) => p.id === player.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white"
                }`}
                onClick={() => {
                  togglePlayerSelection(player);
                  setErrors((prev) => ({ ...prev, assignment: false }));
                }}
              >
                {player.firstName} {player.lastName.charAt(0)}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Drill"}
        </button>
      </form>

      <BottomNav />
    </div>
  );
};

export default CreateDrill;
