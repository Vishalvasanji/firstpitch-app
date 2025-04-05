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
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setTeamId(userDoc.data().teamId);
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
