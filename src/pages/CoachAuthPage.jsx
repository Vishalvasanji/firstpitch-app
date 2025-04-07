import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
 } from "firebase/auth";
 import { auth, db } from "../firebase";
 import { doc, setDoc, getDoc } from "firebase/firestore";
 
 export default function CoachAuthPage() {
   const navigate = useNavigate();
   const [isRegistering, setIsRegistering] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
 
   const handleSubmit = async (e) => {
     e.preventDefault();
 
     try {
       if (isRegistering) {
         const userCredential = await createUserWithEmailAndPassword(
           auth,
           email,
           password
         );
 
         const uid = userCredential.user.uid;
 
         await setDoc(doc(db, "users", uid), {
           firstName,
           lastName, // ✅ Save but not displayed
           email,
           createdAt: new Date(),
         });
 
         sessionStorage.setItem("coachName", firstName);
         alert("Account created successfully!");
         navigate("/create-team");
       } else {
         await signInWithEmailAndPassword(auth, email, password);
 
         const uid = auth.currentUser.uid;
         const userRef = doc(db, "users", uid);
         const userSnap = await getDoc(userRef);
 
         if (userSnap.exists()) {
           const userData = userSnap.data();
 
           sessionStorage.setItem("coachName", userData.firstName);
           sessionStorage.setItem("currentTeamId", userData.teamId || "");
 
           if (userData.teamId) {
             const teamRef = doc(db, "teams", userData.teamId);
             const teamSnap = await getDoc(teamRef);
 
             if (teamSnap.exists()) {
               sessionStorage.setItem(
                 "currentTeamName",
                 teamSnap.data().teamName
               );
             }
           }
 
           alert(`Welcome back, Coach ${userData.firstName}`);
           navigate("/dashboard");
         } else {
           alert("Coach profile not found.");
         }
       }
     } catch (err) {
       console.error("Authentication error:", err);
       alert("There was a problem. Please try again.");
     }
   };
 
   return (
     <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4 overflow-y-auto">
       <form
         onSubmit={handleSubmit}
         className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-4"
       >
         <h2 className="text-2xl font-bold text-center text-blue-700">
           {isRegistering ? "Coach Sign Up" : "Coach Login"}
         </h2>
 
         {isRegistering && (
           <>
             <input
               type="text"
               placeholder="First Name"
               value={firstName}
               onChange={(e) => setFirstName(e.target.value)}
               className="w-full p-3 border rounded-xl"
               required
             />
             <input
               type="text"
               placeholder="Last Name"
               value={lastName}
               onChange={(e) => setLastName(e.target.value)}
               className="w-full p-3 border rounded-xl"
               required
             />
           </>
         )}
 
         <input
           type="email"
           placeholder="Email Address"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           className="w-full p-3 border rounded-xl"
           required
         />
 
         <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="w-full p-3 border rounded-xl"
           required
         />
 
         <button
           type="submit"
           className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
         >
           {isRegistering ? "Create Account" : "Login"}
         </button>
 
         <p
           className="text-sm text-center text-blue-600 underline cursor-pointer"
           onClick={() => setIsRegistering(!isRegistering)}
         >
           {isRegistering
             ? "Already have an account? Login"
             : "New coach? Create an account"}
         </p>
       </form>
     </div>
   );
 }
