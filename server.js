const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

let users = {};
let messages = [];

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

// 👉 Главная страница прямо в коде
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Uzbek Messenger</title>
      </head>
      <body style="font-family: Arial; text-align:center;">
        <h1>Uzbek Messenger работает 🚀</h1>
        <p>Сервер успешно запущен.</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Uzbek Messenger running on " + PORT);
});
