import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function PlayerRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [pin, setPin] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const teamId = sessionStorage.getItem("pendingTeamId");
    if (!teamId) {
      setError("Missing join code. Please try again.");
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError("PIN must be a 4-digit number.");
      return;
    }

    const autoPassword = `firstpitch${Math.floor(Math.random() * 100000)}`;

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, parentEmail, autoPassword);
      window.localStorage.setItem("pendingParentEmail", parentEmail);
      await sendEmailVerification(cred.user, {
        url: "https://firstpitch-app.vercel.app/verify-check",
        handleCodeInApp: true,
      });

      await setDoc(doc(db, "players", cred.user.uid), {
        displayName: `${firstName} ${lastInitial.toUpperCase()}`,
        pin,
        teamId,
        parentEmail,
        role: "player",
        verified: false,
        createdAt: new Date().toISOString(),
      });

      setMessage(
        "We sent a verification email to the parent. Please check the inbox to approve this player account."
      );

      // Log out so the parent doesn't stay signed in
      await signOut(auth);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl space-y-4 text-center"
      >
        <h2 className="text-xl font-semibold text-gray-800">Player Registration</h2>
        <p className="text-sm text-gray-500">Fill in your info to join your team</p>

        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 border rounded-xl"
          required
        />
        <input
          type="text"
          placeholder="Last initial"
          value={lastInitial}
          onChange={(e) => setLastInitial(e.target.value)}
          className="w-full p-2 border rounded-xl"
          maxLength={1}
          required
        />
        <input
          type="password"
          placeholder="4-digit PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-2 border rounded-xl"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          required
        />
        <input
          type="email"
          placeholder="Parent's email"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          className="w-full p-2 border rounded-xl"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-xl font-medium hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register Player"}
        </button>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
