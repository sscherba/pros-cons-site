const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read config.txt file
const config = fs.readFileSync("./config.txt", "utf-8");
const configParams = parseConfig(config);

// Parse the config.txt content
function parseConfig(configText) {
    const lines = configText.split("\n");
    const params = {};
    lines.forEach(line => {
        const [key, value] = line.split("=");
        if (key && value) params[key.trim()] = value.trim();
    });
    return params;
}

// Chatbot endpoint
app.post("/api/chat", async (req, res) => {
    const userMessage = req.body.message;

    // Define your config prompts here or pull from a file
    const prompts = [
        { user: "Hello", bot: "Hi! How can I help you today?" },
        { user: "Who are you?", bot: "I am Nikki, a chatbot designed to practice DBT skills." }
    ];

    const matchedPrompt = prompts.find(p => p.user.toLowerCase() === userMessage.toLowerCase());

    if (matchedPrompt) {
        return res.json({ reply: matchedPrompt.bot });
    }

    // If no predefined prompt matches, query OpenAI API
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: configParams["General Context"] || "You are Nikki, a chatbot helping with DBT skills." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch response from OpenAI API." });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));