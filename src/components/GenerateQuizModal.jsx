import { useState } from "react";

export default function GenerateQuizModal({ handleClose, handleGenerate, ageGroup }) {
  const [topic, setTopic] = useState("");
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

      {/* Explainer Text */}
      <p className="text-sm text-gray-600 mb-4">
        Tell us what the quiz should cover. We'll generate age-appropriate questions your team can answer in-app. You’ll be able to review and edit the questions and answers before sending.
      </p>

      {/* Form Fields */}
      <input
        type="text"
        placeholder="Enter quiz topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-12"
      />

      <textarea
        placeholder="Optional scenario or coaching context..."
        value={scenario}
        onChange={(e) => setScenario(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
      />

      <button
        disabled={!topic}
        onClick={() => handleGenerate({ topic, questionCount: 3, scenario, ageGroup })}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full disabled:opacity-50"
      >
        Generate Questions
      </button>
    </div>
  );
}
