import axios from "axios";

const API_KEY = process.env.Gemini_API_KEY;
// const MODEL = "models/gemini-pro";
// const MODEL = "models/text-bison-001"
const MODEL = "models/gemini-1.5-flash";

export const generateContent = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) return res.status(400).json({ error: "Input text is required" });

    const apiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: input }],
          },
        ],
      }
    );

    res.json(apiResponse.data);
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch data from Gemini API" });
  }
};
