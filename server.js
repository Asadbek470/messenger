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
let privateRequests = {};
let privateChats = {};

io.on("connection", (socket) => {

  // Регистрация
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

  // Запрос на личный чат
  socket.on("privateRequest", (targetId) => {
    const sender = users[socket.id];
    const target = Object.values(users).find(u => u.id === targetId);

    if (!target) return;

    io.to(target.socketId).emit("privateRequestReceived", {
      fromId: sender.id,
      fromName: sender.nickname
    });
  });

  // Ответ на запрос
  socket.on("privateResponse", ({ fromId, accepted }) => {
    const currentUser = users[socket.id];
    const requester = Object.values(users).find(u => u.id === fromId);

    if (!requester) return;

    if (accepted) {
      const chatId = uuidv4();
      privateChats[chatId] = [currentUser.id, requester.id];

      io.to(requester.socketId).emit("privateAccepted", {
        chatId,
        with: currentUser
      });

      socket.emit("privateAccepted", {
        chatId,
        with: requester
      });
    } else {
      io.to(requester.socketId).emit("privateRejected");
    }
  });

  // Личное сообщение
  socket.on("privateMessage", ({ chatId, text }) => {
    const chat = privateChats[chatId];
    if (!chat) return;

    const sender = users[socket.id];

    chat.forEach(userId => {
      const user = Object.values(users).find(u => u.id === userId);
      if (user) {
        io.to(user.socketId).emit("privateMessage", {
          chatId,
          sender: sender.nickname,
          text,
          time: new Date().toLocaleTimeString()
        });
      }
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
