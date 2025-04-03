// src/hooks/useUser.js
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useUser() {
  const [user, setUser] = useState(null);
  const [teamId, setTeamId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const coachDoc = await getDoc(doc(db, "coaches", currentUser.uid));
        if (coachDoc.exists()) {
          setTeamId(coachDoc.data().teamId);
        }
      } else {
        setUser(null);
        setTeamId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, teamId };
}
