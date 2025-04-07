import { useState } from "react";

export default function GenerateQuizModal({ handleClose, handleGenerate }) {
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [scenario, setScenario] = useState("");

  return (
    <div className="fixed inset-0 bg-white z-50 px-4 pt-6 pb-28 overflow-y-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-blue-800">Generate Quiz with AI</h1>
        <button onClick={handleClose} className="text-blue-600 font-medium">
          Close
        </button>
      </div>

      {/* Form Fields */}
      <input
        type="text"
        placeholder="Enter quiz topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
      />

      <select
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
      >
        <option value="">Select number of questions</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="10">10</option>
      </select>

      <textarea
        placeholder="Optional scenario or coaching context..."
        value={scenario}
        onChange={(e) => setScenario(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
      />

      <button
        disabled={!topic || !questionCount}
        onClick={() => handleGenerate({ topic, questionCount, scenario })}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full disabled:opacity-50"
      >
        Generate Questions
      </button>
    </div>
  );
}
