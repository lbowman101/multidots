const socket = io();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Receive initial data from the server
socket.on('initialData', (data) => {
    const { playerId, players } = data;
    // Draw initial player positions
    Object.values(players).forEach(player => {
        drawPlayer(player);
    });
});

// Update player position on mouse move
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    socket.emit('playerMoved', { x, y });
});

// Receive player movement updates from the server
socket.on('playerMoved', (data) => {
    drawPlayer(data);
});

// Handle player disconnection
socket.on('playerDisconnected', (playerId) => {
    // Remove the disconnected player from the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Function to draw a player dot
function drawPlayer(player) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}
