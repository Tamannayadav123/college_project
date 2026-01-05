import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (req, res) => {
  const { topic, count } = req.body;

  if (!topic || !count) {
    return res.status(400).json({ error: 'Missing topic or count' });
  }

  try {
    const prompt = `Generate ${count} multiple-choice quiz questions about "${topic}". 
Return ONLY a valid JSON array of objects in this format:

[
  {
    "id": 1,
    "question": "What is 2 + 2?",
    "options": ["2", "3", "4"],
    "answer": "4"
  }
]

Make sure "options" is a real array, not a string. Do NOT include any explanation, comments, or Markdown formatting.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```/g, '')
      .trim();

    const quizData = JSON.parse(cleanText);
    res.json(quizData);
  } catch (err) {
    console.error('Gemini Error:', err.message);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
};
