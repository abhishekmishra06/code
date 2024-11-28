const socket = io('https://chat-room-deoh.onrender.com/'); // Connect to the Socket.IO server

// DOM Elements
const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('usernameInput');
const startChatButton = document.getElementById('startChatButton');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chat-messages');
const gifContainer = document.getElementById('gif-container');

document.addEventListener("DOMContentLoaded",()=>{
  setTimeout(()=>{
    gifContainer.style.display='none';
  },3000);
});

// Store the username
let username = '';

// Show the chat container after entering a username
startChatButton.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (username) {
    usernameContainer.style.display = 'none'; // Hide the username input
    chatContainer.style.display = 'flex'; // Show the chat UI
    socket.emit('userJoined', username); // Notify the server about the new user
  } else {
    alert('Please enter a username!');
  }
});

// Send message when the "Send" button is clicked
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key press
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Emit a message to the server
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    // Add the message to the UI as "self"
    addMessage(username, message, 'self');
    socket.emit('chatMessage', { username, message }); // Send to server
    messageInput.value = '';
  }
}

// Listen for incoming messages from the server
socket.on('chatMessage', ({ username, message }) => {
  addMessage(username, message, 'other'); // Add message to UI
});

// Function to add a message to the chat UI
function addMessage(sender, message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  if (type === 'self') messageDiv.classList.add('self');
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
}

// Listen for new user notifications
socket.on('userJoined', (newUser) => {
  const notification = document.createElement('div');
  notification.classList.add('message');
  notification.style.textAlign = 'center';
  notification.style.color = '#00cc00';
  notification.textContent = `${newUser} has joined the chat!`;
  chatMessages.appendChild(notification);
});