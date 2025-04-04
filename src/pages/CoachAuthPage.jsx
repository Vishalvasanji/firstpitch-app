import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function CoachAuthPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        await setDoc(doc(db, "users", uid), {
          firstName,
          lastName,
          email,
          role: "coach",
          createdAt: new Date().toISOString(),
        });

        navigate("/create-team"); // redirect after signup
      } else {
  await signInWithEmailAndPassword(auth, email, password);

  const uid = auth.currentUser.uid;
  const coachRef = doc(db, "coaches", uid);
  const coachSnap = await getDoc(coachRef);

  if (coachSnap.exists()) {
    const coachData = coachSnap.data();

    sessionStorage.setItem("coachName", coachData.firstName);
    sessionStorage.setItem("currentTeamId", coachData.teamId);

    // Now get the team name using teamId
    const teamRef = doc(db, "teams", coachData.teamId);
    const teamSnap = await getDoc(teamRef);

    if (teamSnap.exists()) {
      sessionStorage.setItem("currentTeamName", teamSnap.data().teamName);
    }

    alert(`Welcome back, Coach ${coachData.firstName}`);
    navigate("/dashboard");
  } else {
    alert("Coach profile not found.");
  }
}


  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-4">
          {isSignup ? "Coach Sign Up" : "Coach Log In"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <div>
                <label className="text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {isSignup ? "Create Coach Account" : "Log In"}
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          {isSignup ? "Already have an account?" : "Need to sign up?"}{" "}
          <button
            className="text-blue-600 hover:underline font-medium"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
