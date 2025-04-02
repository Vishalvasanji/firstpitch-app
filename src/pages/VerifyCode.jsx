import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VerifyCode() {
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const playerId = sessionStorage.getItem("pendingPlayerId");

  useEffect(() => {
    if (!playerId) {
      setError("Missing player ID. Please re-register.");
    }
  }, [playerId]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      const ref = doc(db, "players", playerId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError("Player not found.");
        return;
      }

      const player = snap.data();

      if (player.verificationCode !== codeInput.trim()) {
        setError("Incorrect code. Please check your parent’s email.");
        return;
      }

      await updateDoc(ref, { verified: true });

      setStatus("✅ You're verified! Welcome to the team!");
      sessionStorage.removeItem("pendingPlayerId");

      // Optional: Redirect to player dashboard after a short delay
      setTimeout(() => {
        navigate("/player-home");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl text-center space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">Enter Parent Code</h2>
        <p className="text-sm text-gray-500">Type the 6-digit code your parent received by email.</p>

        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          maxLength={6}
          className="w-full p-2 border rounded-xl tracking-widest text-center text-lg"
          placeholder="123456"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-xl font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {status && <p className="text-green-600 text-sm">{status}</p>}
      </form>
    </div>
  );
}
