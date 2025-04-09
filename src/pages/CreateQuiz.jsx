import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function CreateQuiz() {
  const saved = sessionStorage.getItem("quizData");
  const parsed = saved ? JSON.parse(saved) : null;

  const [quizData, setQuizData] = useState(parsed);
  const [title, setTitle] = useState(parsed?.title || "");
  const [questions, setQuestions] = useState(parsed?.questions || []);
  const [dueDate, setDueDate] = useState("");
  const [assignToTeam, setAssignToTeam] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("currentTeamId");
  const coachId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!teamId) return;
      const q = query(collection(db, "users"), where("teamId", "==", teamId), where("role", "==", "player"), where("verified", "==", true));
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

    const assignedTo = assignToTeam
      ? players.map((p) => p.id)
      : selectedPlayers;

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

  if (!quizData) {
    return <p className="p-6 text-gray-500">No quiz data found. Please start from Create Assignment.</p>;
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
  <button className="text-blue-600">← Back</button>
  <h1 className="text-lg font-bold text-blue-800 text-center flex-1 -ml-6">Create Quiz</h1>
</div>
<p className="text-sm text-gray-600 text-center mt-1 mb-4">
  Edit each question, update the answer options, and tap one to mark it correct.
</p>

      {/* Quiz Title */}
      <label className="text-sm font-semibold text-gray-700 block mb-1">Quiz Title</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter quiz title"
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={i} className="mb-6">
          <label className="block font-semibold mb-2">Question {i + 1}</label>
          <textarea
            value={q.question}
            onChange={(e) => updateQuestion(i, e.target.value)}
            rows={1}
            className="w-full border rounded-lg px-4 py-2 resize-none min-h-[3rem] mb-2"
          />
          {q.options.map((opt, j) => (
            <div
              key={j}
              onClick={() => updateCorrectAnswer(i, j)}
              className={`border rounded-lg px-3 py-2 mb-2 cursor-pointer ${
                q.answerIndex === j
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <textarea
                value={opt}
                onChange={(e) => updateOption(i, j, e.target.value)}
                rows={1}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-800 resize-none min-h-[2.5rem]"
              />
            </div>
          ))}
        </div>
      ))}

      {/* Due Date */}
      <div className="flex items-center space-x-3 mb-4">
        <label className="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* Assign To */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setAssignToTeam(true)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            assignToTeam
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          Entire Team
        </button>
        <button
          onClick={() => setAssignToTeam(false)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            !assignToTeam
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
        >
          Specific Players
        </button>
      </div>

      {!assignToTeam && (
        <div className="mb-4">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              className={`flex items-center bg-white shadow rounded-xl p-3 mb-2 cursor-pointer ${
                selectedPlayers.includes(player.id) ? "border border-blue-600" : ""
              }`}
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center mr-3">
                {player.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="text-md font-semibold text-gray-800">{player.name}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg w-full mt-6"
      >
        Send Quiz
      </button>
    </div>
  );
}
