import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { topic, questionCount, scenario, ageGroup } = req.body;

  console.log("BODY:", req.body);
  console.log("API KEY PRESENT:", !!process.env.OPENAI_API_KEY);
  console.log("RAW RESPONSE:", raw);

  if (!topic || !questionCount || !ageGroup) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
You are a youth baseball coach creating a quiz for ${ageGroup} players.

Generate ${questionCount} multiple choice questions that teach the following topic:
Topic: ${topic}

${scenario ? `Scenario: ${scenario}` : ""}

Make sure the questions are age-appropriate, use simple language, and focus on teaching the key concepts.

Each question must include 4 answer choices and exactly one correct answer.

Also generate a short, appropriate title for the quiz.

Respond ONLY in the following JSON format:

{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answerIndex": 0
    }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content;
    console.log("RAW RESPONSE:", raw);

    const data = JSON.parse(raw);

    if (!data.title || !Array.isArray(data.questions)) {
      throw new Error("Invalid AI response structure");
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("AI generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz", debug: err.message });
  }
}
