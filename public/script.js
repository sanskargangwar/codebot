document.body.style.overflow = "hidden";
//tab changing
document.getElementById("defaultPageOpen").click();
function openpage(page, p_name) {
  var i, pages, navbtn;
  pages = document.getElementsByClassName("pages");
  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  navbtn = document.getElementsByClassName("nav-link");
  for (i = 0; i < navbtn.length; i++) {
    navbtn[i].className = navbtn[i].className.replace("active", "");
  }
  document.getElementById(p_name).style.display = "block";
  page.currentTarget.className += " active";
}

//main script

document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chat-container");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");

  // Add welcome message
  addBotMessage("Hello! I'm your chatbot assistant. How can I help you today?");

  // Send message when button is clicked
  sendButton.addEventListener("click", sendMessage);

  // Send message when Enter key is pressed
  userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addUserMessage(message);
      userInput.value = "";

      // Show "typing" indicator
      const typingIndicator = document.createElement("div");
      typingIndicator.id = "typing-indicator";
      typingIndicator.textContent = "Bot is typing...";
      chatContainer.appendChild(typingIndicator);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Call API to get response
      getBotResponse(message)
        .then((response) => {
          // Remove typing indicator
          document.getElementById("typing-indicator").remove();
          addBotMessage(response);
        })
        .catch((error) => {
          document.getElementById("typing-indicator").remove();
          addBotMessage(
            "Sorry, I encountered an error. Please try again later."
          );
          console.error("Error:", error);
        });
    }
  }

  function addUserMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "user-message";
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function addBotMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "bot-message";
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, I couldn't process your request.";
    }
  }
});
