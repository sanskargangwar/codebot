const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  console.log("Request to root received");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  console.log("POST /api/chat request received");
  try {
    const { message } = req.body;
    console.log("Received message:", message);

    if (!message) {
      return res.status(400).json({ error: "No message received" });
    }

    const COHERE_API_KEY = process.env.COHERE_API_KEY; 
    if (!COHERE_API_KEY) {
      return res.status(500).json({ error: "Missing Cohere API key" });
    }

    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command-light",
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response?.data?.generations?.[0]?.text?.trim();
    console.log("✅ Bot reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error("❌ Cohere API error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
