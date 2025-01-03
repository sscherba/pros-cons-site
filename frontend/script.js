// Chatbot Logic
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Add a message to the chat window
function addMessage(text, isBot) {
    const message = document.createElement("div");
    message.classList.add("message", isBot ? "bot-message" : "user-message");
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle user input
async function handleInput(event) {
    event.preventDefault();

    const userText = userInput.value.trim();
    if (!userText) return;

    // Add user message to the chat window
    addMessage(userText, false);
    userInput.value = "";

    try {
        // Send user message to the backend
        const response = await fetch("pros-cons-site-fl1ye646q-samanthas-projects-7267dbb8.vercel.app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userText })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch response from backend");
        }

        // Add bot response to the chat window
        const data = await response.json();
        addMessage(data.reply, true);
    } catch (error) {
        console.error("Error:", error);
        addMessage("Sorry, something went wrong.", true);
    }
}

// Event listener for form submission
chatForm.addEventListener("submit", handleInput);
