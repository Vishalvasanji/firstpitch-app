import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

export default function VerifyCheck() {
  const [status, setStatus] = useState("Checking verification...");

  useEffect(() => {
    const checkLinkAndVerify = async () => {
      try {
        const email = window.localStorage.getItem("pendingParentEmail");

        if (!email) {
          setStatus("Missing email. Please open the link from the same browser used to register.");
          return;
        }

        if (isSignInWithEmailLink(auth, window.location.href)) {
          const result = await signInWithEmailLink(auth, email, window.location.href);

          if (result.user.emailVerified) {
            await updateDoc(doc(db, "players", result.user.uid), { verified: true });
            setStatus("✅ Email verified! This player account is now active.");
          } else {
            setStatus("Email is not verified yet. Try the link again.");
          }
        } else {
          setStatus("Invalid or expired verification link.");
        }
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong. Please try again.");
      }
    };

    checkLinkAndVerify();
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl text-center text-lg text-gray-800">
        {status}
      </div>
    </div>
  );
}
