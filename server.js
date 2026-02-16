const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

// Создаём HTTP сервер
const server = http.createServer(app);

// Подключаем Socket.IO
const io = new Server(server);

let users = {};
let messages = [];

// Socket логика
io.on("connection", (socket) => {

  socket.on("register", (userData) => {
    users[socket.id] = userData;
    io.emit("users", Object.values(users));
    socket.emit("chatHistory", messages);
  });

  socket.on("message", (text) => {
    if (!users[socket.id]) return;

    const msg = {
      id: uuidv4(),
      sender: users[socket.id].nickname,
      text,
      time: new Date().toLocaleTimeString()
    };

    messages.push(msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

// 👉 ВАЖНО: отдаём папку public
app.use(express.static(path.join(__dirname, "public")));

// 👉 ВАЖНО: маршрут главной страницы
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 👉 Обязательный порт для Render
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Uzbek Messenger running on " + PORT);
});
