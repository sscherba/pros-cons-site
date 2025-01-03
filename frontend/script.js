const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

function addMessage(text, isBot) {
    const message = document.createElement("div");
    message.classList.add("message", isBot ? "bot-message" : "user-message");
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleInput(event) {
    event.preventDefault();

    const userText = userInput.value.trim();
    if (!userText) return;

    addMessage(userText, false);
    userInput.value = "";

    try {
        const response = await fetch("https://pros-cons-site-fl1ye646q-samanthas-projects-7267dbb8.vercel.app", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userText })
        });

        const data = await response.json();
        addMessage(data.reply, true);
    } catch (error) {
        console.error(error);
        addMessage("Something went wrong. Please try again.", true);
    }
}

chatForm.addEventListener("submit", handleInput);
