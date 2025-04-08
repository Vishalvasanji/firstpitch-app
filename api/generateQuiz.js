export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { topic, scenario, ageGroup } = req.body;

  const prompt = `
You are a youth baseball coach creating a quiz for ${ageGroup} players.
Generate 3 multiple choice questions that teach the following topic:
Topic: ${topic}
${scenario ? `Scenario: ${scenario}` : ""}
If the topic is a rule, then one of the questions generated should test knowledge of the rule.
Make sure the questions are age-appropriate, use simple language, and focus on teaching the key concepts.
Also generate a short, appropriate title for the quiz. Do not include the age group in the title.
Each question must include 4 answer choices.
Respond ONLY in the following JSON format. Include a "title" key followed by "questions":

{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"]
    },
    ...
  ]
}
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const raw = await openaiRes.json();

    if (!raw.choices || !raw.choices[0]?.message?.content) {
      return res.status(500).json({ error: "Invalid OpenAI response", raw });
    }

    const parsed = JSON.parse(raw.choices[0].message.content);

    if (!parsed.title || !Array.isArray(parsed.questions)) {
      return res.status(500).json({ error: "Malformed quiz format", raw });
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quiz", message: err.message });
  }
}
