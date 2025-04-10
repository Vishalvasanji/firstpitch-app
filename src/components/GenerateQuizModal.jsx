import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GenerateQuizModal({ handleClose, ageGroup }) {
  const [topic, setTopic] = useState("");
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    const timeout = setTimeout(() => {
      alert("The quiz generation is taking too long. Please try again.");
      setLoading(false);
    }, 30000);

    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, scenario, ageGroup, questionCount: 3 }),
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("quizData", JSON.stringify(data));
        navigate("/create-quiz", { state: data });
      } else {
        alert("Something went wrong while generating the quiz. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      clearTimeout(timeout);
      console.error("Failed to generate quiz:", err);
      alert("Something went wrong while generating the quiz. Please try again.");
      setLoading(false);
    }
  };

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
        disabled={loading}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-12"
      />

      <textarea
        placeholder="Optional scenario or coaching context..."
        value={scenario}
        onChange={(e) => setScenario(e.target.value)}
        disabled={loading}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6"
      />

      <button
        disabled={loading || !topic}
        onClick={handleGenerate}
        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full disabled:opacity-60 flex items-center justify-center"
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">🌀</span>
            Generating quiz...
          </>
        ) : (
          "Generate Questions"
        )}
      </button>
    </div>
  );
}
