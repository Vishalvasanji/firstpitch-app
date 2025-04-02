import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function VerifyCheck() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const checkVerification = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setStatus("Please log in using the link in the email.");
          return;
        }

        await user.reload(); // refresh emailVerified status

        if (user.emailVerified) {
          const ref = doc(db, "players", user.uid);
          await updateDoc(ref, { verified: true });
          setStatus("✅ Player registration approved! You may now close this tab.");
        } else {
          setStatus("Email not verified yet. Please click the link in your inbox.");
        }
      });
    };

    checkVerification();
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl text-center text-lg text-gray-800">
        {status}
      </div>
    </div>
  );
}
