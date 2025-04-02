import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PlayerRegister() {
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [pin, setPin] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateVerificationCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  // ✅ Send email directly using Resend API (for development only)
  const sendVerificationEmail = async (parentEmail, code) => {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "re_71QHCq8M_F6UEJGYTSBLpFPgEXLxY1yhj", // 🔐 Replace with your real key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FirstPitch <noreply@resend.dev>",
          to: parentEmail,
          subject: "Approve Your Child’s FirstPitch Account",
          html: `
            <p>Hi!</p>
            <p>Your child is registering for FirstPitch.</p>
            <p>To approve their account, enter this code in the app:</p>
            <h2>${code}</h2>
            <p>Thanks,<br>The FirstPitch Team</p>
          `,
        }),
      });

      const result = await response.json();
      console.log("Resend email sent:", result);
    } catch (error) {
      console.error("Resend email error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const teamId = sessionStorage.getItem("pendingTeamId");
    if (!teamId) {
      setError("Missing join code. Please re-enter.");
      setLoading(false);
      return;
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError("PIN must be a 4-digit number.");
      setLoading(false);
      return;
    }

    const verificationCode = generateVerificationCode();

    try {
      const docRef = await addDoc(collection(db, "players"), {
        displayName: `${firstName} ${lastInitial.toUpperCase()}`,
        pin,
        parentEmail,
        teamId,
        verified: false,
        verificationCode,
        createdAt: serverTimestamp(),
      });

      // Save player ID for verification screen
      sessionStorage.setItem("pendingPlayerId", docRef.id);

      // ✅ Send email
      await sendVerificationEmail(parentEmail, verificationCode);

      navigate("/verify-code");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
          {loading ? "Registering..." : "Register Player"}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
