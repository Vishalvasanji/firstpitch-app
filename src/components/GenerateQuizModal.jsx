// Fix: sessionStorage hydration and loading fallback
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function CreateQuiz() {
  const [quizData, setQuizData] = useState(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [assignToTeam, setAssignToTeam] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState([]);

  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("currentTeamId");
  const coachId = auth.currentUser?.uid;

  useEffect(() => {
    const saved = sessionStorage.getItem("quizData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setQuizData(parsed);
      setTitle(parsed.title || "");
      setQuestions(parsed.questions || []);
    }
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!teamId) return;
      const q = query(
        collection(db, "users"),
        where("teamId", "==", teamId),
        where("role", "==", "player"),
        where("verified", "==", true)
      );
      const snapshot = await getDocs(q);
      const playerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(playerList);
    };
    fetchPlayers();
  }, [teamId]);

  const togglePlayer = (id) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const updateQuestion = (i, value) => {
    const updated = [...questions];
    updated[i].question = value;
    setQuestions(updated);
  };

  const updateOption = (i, j, value) => {
    const updated = [...questions];
    updated[i].options[j] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (i, index) => {
    const updated = [...questions];
    updated[i].answerIndex = index;
    setQuestions(updated);
  };

  const startEditingQuestion = (i) => {
    const updated = [...editingQuestion];
    updated[i] = true;
    setEditingQuestion(updated);
  };

  const setEditingQuestionOff = (i) => {
    const updated = [...editingQuestion];
    updated[i] = false;
    setEditingQuestion(updated);
  };

  const handleSubmit = async () => {
    if (!title || !dueDate || !questions.length) {
      alert("Please complete all required fields.");
      return;
    }

    for (let q of questions) {
      if (!q.question || q.options.length !== 4 || q.answerIndex === null || q.answerIndex === undefined) {
        alert("Please complete all questions and select correct answers.");
        return;
      }
    }

    const assignedTo = assignToTeam ? players.map((p) => p.id) : selectedPlayers;

    if (assignedTo.length === 0) {
      alert("You must assign the quiz to at least one player.");
      return;
    }

    try {
      const quizRef = await addDoc(collection(db, "quizzes"), {
        title,
        questions,
        createdBy: coachId,
        createdAt: serverTimestamp(),
      });

      const assignmentRef = await addDoc(collection(db, "assignments"), {
        contentId: quizRef.id,
        teamId,
        type: "quiz",
        dueDate,
        assignedTo,
        assignedBy: coachId,
        createdAt: serverTimestamp(),
      });

      const promises = assignedTo.map((playerId) =>
        addDoc(collection(db, "assignmentStatuses"), {
          assignmentId: assignmentRef.id,
          playerId,
          status: "assigned",
          lastUpdated: serverTimestamp(),
        })
      );
      await Promise.all(promises);

      alert("Quiz successfully assigned!");
      navigate("/quizzes");
    } catch (err) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  if (quizData === null) {
    return <p className="p-6 text-gray-500">Loading quiz data...</p>;
  }

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
  return <p className="p-6 text-red-600">Quiz is missing questions or could not be loaded.</p>;
}

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
      {/* full UI here */}
    </div>
  );
}
