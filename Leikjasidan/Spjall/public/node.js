const popup = document.getElementById('popup');
const chat = document.getElementById('chat');
const usernameForm = document.getElementById('username-form');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

let username;

// Nafnaskráning
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    username = document.getElementById('username').value;
    popup.classList.add('hidden');
    chat.classList.remove('hidden');
});

// Tengjast WebSocket
const socket = io();

// Hlaða spjallskilaboðum
socket.on('chat history', (messages) => {
    messages.forEach(displayMessage);
});

// Fá ný skilaboð
socket.on('new message', (message) => {
    displayMessage(message);
});

// Senda ný skilaboð
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = {
        user: username,
        text: messageInput.value,
        timestamp: new Date().toLocaleTimeString(),
    };
    socket.emit('send message', message);
    messageInput.value = '';
});

// Birtu skilaboð
function displayMessage({ user, text, timestamp }) {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${user}:</strong> ${text} <span>${timestamp}</span>`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
