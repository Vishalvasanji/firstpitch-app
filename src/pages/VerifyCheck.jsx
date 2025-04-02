import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function VerifyCheck() {
  const [status, setStatus] = useState("Checking verification...");

  useEffect(() => {
    const checkVerification = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setStatus("Please log in using the link in the email.");
          return;
        }

        // Add 2-second delay to allow email verification to sync
        setTimeout(async () => {
          await user.reload();

          if (user.emailVerified) {
            try {
              const playerRef = doc(db, "players", user.uid);
              await updateDoc(playerRef, { verified: true });
              setStatus("✅ Email verified! This player account is now active.");
            } catch (err) {
              console.error(err);
              setStatus("Error updating player verification. Please try again.");
            }
          } else {
            setStatus("Still waiting for email verification. Try refreshing this page in a few seconds.");
          }
        }, 2000);
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
