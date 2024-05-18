const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store connected players
const players = {};

io.on('connection', (socket) => {
    console.log('A player connected');

    // Assign a unique ID to the player
    const playerId = socket.id;
    players[playerId] = {
        x: Math.random() * 800,
        y: Math.random() * 600,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Random color
    };

    // Send the player's initial position and color
    socket.emit('initialData', { playerId, players });

    // Handle player movements
    socket.on('playerMoved', (data) => {
        players[playerId].x = data.x;
        players[playerId].y = data.y;
        // Broadcast the updated player position to all other players
        socket.broadcast.emit('playerMoved', { playerId, x: data.x, y: data.y });
    });

    // Handle player disconnection
    socket.on('disconnect', () => {
        console.log('A player disconnected');
        delete players[playerId];
        // Broadcast the disconnection to all other players
        io.emit('playerDisconnected', playerId);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
