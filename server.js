const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

let users = {};
let chats = {}; // хранение комнат

function createRoom(id1, id2) {
  return [id1, id2].sort().join("_");
}

io.on("connection", (socket) => {

  socket.on("register", (nickname) => {
    const user = {
      id: uuidv4(),
      nickname,
      socketId: socket.id
    };

    users[socket.id] = user;
    socket.emit("yourId", user.id);
    io.emit("users", Object.values(users));
  });

  // Запрос на приватный чат
  socket.on("startPrivateChat", (targetId) => {
    const currentUser = users[socket.id];
    const targetUser = Object.values(users).find(u => u.id === targetId);

    if (!targetUser) return;

    const room = createRoom(currentUser.id, targetUser.id);

    socket.join(room);
    io.to(targetUser.socketId).emit("joinRoom", {
      room,
      from: currentUser
    });
  });

  // Подключение к комнате
  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  // Личное сообщение
  socket.on("privateMessage", ({ room, text }) => {
    const sender = users[socket.id];
    if (!sender) return;

    io.to(room).emit("privateMessage", {
      senderId: sender.id,
      senderName: sender.nickname,
      text,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log("Messenger running on " + PORT);
});
