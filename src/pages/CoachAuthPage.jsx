import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function CoachAuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          role: "coach",
          email: email,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "coach") {
          alert("Access denied. Not a coach account.");
          return;
        }
      }
      navigate("/create-team");
    } catch (err) {
      alert("Authentication failed: " + err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="bg-white shadow rounded-xl w-full max-w-md p-6">
        <h1 className="text-center text-xl font-bold text-blue-800 mb-4">
          {isRegistering ? "Coach Registration" : "Coach Login"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mb-3"
        >
          {isRegistering ? "Register" : "Login"}
        </button>
        <p className="text-center text-sm text-gray-600">
          {isRegistering ? "Already have an account?" : "New coach?"} {" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
