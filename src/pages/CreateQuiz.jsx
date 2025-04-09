import { useState, useEffect } from "react";

export default function CreateQuiz() {
  const saved = sessionStorage.getItem("quizData");
  const parsed = saved ? JSON.parse(saved) : null;

  const [quizData, setQuizData] = useState(parsed);
  const [title, setTitle] = useState(parsed?.title || "");
  const [questions, setQuestions] = useState(parsed?.questions || []);
  const [dueDate, setDueDate] = useState("");
  const [assignToTeam, setAssignToTeam] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

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

  if (!quizData) {
    return <p className="p-6 text-gray-500">No quiz data found. Please start from Create Assignment.</p>;
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-white to-blue-50 px-4 pt-6 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button className="text-blue-600 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-blue-800 text-center">Create Quiz</h1>
      </div>

      {/* Title Input */}
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
          <input
            value={q.question}
            onChange={(e) => updateQuestion(i, e.target.value)}
            className="w-full border rounded-lg px-4 py-2 mb-2"
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
              <input
                value={opt}
                onChange={(e) => updateOption(i, j, e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-800"
              />
            </div>
          ))}
        </div>
      ))}

      {/* Due Date */}
      <label className="block font-semibold mb-2">Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-6"
      />

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

      {/* Placeholder for players list */}
      {!assignToTeam && (
        <p className="text-sm text-gray-500 mb-2">[Player list goes here]</p>
      )}

      <button
        onClick={() => alert("Send Quiz logic here")}
        className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg w-full mt-6"
      >
        Send Quiz
      </button>
    </div>
  );
}
