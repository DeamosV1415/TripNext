const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to communicate

const OPENROUTER_API_KEY =
  "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"; // Replace with your key
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = "deepseek/deepseek-r1-zero:free"; // The model we're using

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://deamosv1415.github.io/TripNext/", // Required by OpenRouter
        "X-Title": "Travel Assistant", // Optional - your app's name
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.error || "Unknown error"}`);
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching response from OpenRouter:", error);
    res.status(500).json({ error: "Failed to connect to OpenRouter." });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
