import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function JoinTeam() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const teamsRef = collection(db, "teams");
      const q = query(teamsRef, where("joinCode", "==", code.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Invalid join code. Please try again.");
        return;
      }

      const team = querySnapshot.docs[0];
      const teamId = team.id;

      // Save the teamId temporarily in session storage
      sessionStorage.setItem("pendingTeamId", teamId);

      // Redirect to player signup
      navigate("/player-register");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4 text-center"
      >
        <h2 className="text-xl font-semibold text-gray-800">Join a Team</h2>
        <p className="text-sm text-gray-500">Enter the code your coach gave you:</p>

        <input
          type="text"
          placeholder="Enter join code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded-xl uppercase tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          Continue
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
