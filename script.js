const chatMessages = document.getElementById('chat-messages');

function sendMessage() {
  const userInput = document.getElementById('user-input').value.trim();

  if (userInput) {
    // Display user's message
    displayMessage(userInput, 'user');

    // Send user's message to ChatGPT API and display response
    fetchChatGPTResponse(userInput);
  }
}

function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.innerText = message;
  chatMessages.appendChild(messageElement);

  // Scroll to bottom of chat window
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchChatGPTResponse(userInput) {
  try {
    const response = await fetch('your-chatgpt-api-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key' // Replace with your ChatGPT API key
      },
      body: JSON.stringify({ input: userInput })
    });

    const data = await response.json();

    // Display ChatGPT's response
    displayMessage(data.output, 'chatgpt');
  } catch (error) {
    console.error('Error fetching ChatGPT response:', error);
    displayMessage('An error occurred while fetching the response.', 'chatgpt');
  }
}