import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function generateJoinCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState(null);
  const [createdTeamName, setCreatedTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTeam = async (e) => {
  e.preventDefault();
  if (!teamName.trim()) return;

  setLoading(true);
  const code = generateJoinCode();
  const coachId = auth.currentUser?.uid;

  try {
    const teamRef = await addDoc(collection(db, "teams"), {
      teamName,
      coachId,
      joinCode: code,
      createdAt: serverTimestamp(),
    });

    // ✅ Store team ID and name in sessionStorage
    sessionStorage.setItem("currentTeamId", teamRef.id);
    sessionStorage.setItem("currentTeamName", teamName);

    setJoinCode(code);
    setCreatedTeamName(teamName);
  } catch (err) {
    console.error("Error creating team:", err);
    alert("There was a problem creating your team.");
  } finally {
    setLoading(false);
  }
};


  const handleShare = async () => {
    const message = `Join my FirstPitch team "${createdTeamName}" using this code: ${joinCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join My Team on FirstPitch",
          text: message,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(message);
        alert("Join code copied to clipboard!");
      } catch (err) {
        alert("Could not copy to clipboard.");
      }
    }
  };

  if (joinCode) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-white to-blue-50 relative">

        {/* X button in top-right */}
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{createdTeamName}</h1>
        <p className="text-lg text-gray-600 mb-2">Share this code with your players:</p>

        <div className="text-4xl font-mono tracking-widest text-blue-700 bg-white px-6 py-4 rounded-2xl shadow-xl mb-6">
          {joinCode}
        </div>

        <button
          onClick={handleShare}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition mb-2"
        >
          Share Code
        </button>

        <p className="text-sm text-gray-500">They’ll need it to register and join your team.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center px-4 bg-gradient-to-b from-white to-blue-50">
      <form onSubmit={handleCreateTeam} className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800">Create Your Team</h2>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-xl font-medium hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}
