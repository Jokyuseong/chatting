const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected user :", socket.id);

  socket.on("send message", (item) => {
    const msg = item.name + ":" + item.message;
    console.log(item);
    io.to(item.joinedRoom).emit("receive message", {
      name: item.name,
      message: item.message,
    });
  });

  socket.on("change room", (room, name) => {
    console.log("change room", room, name);

    socket.leave(room.prev);
    io.to(room.prev).emit("receive message", {
      name: "notice",
      message: `${name} leave the ${room.prev}`,
    });

    socket.join(room.next);
    io.to(room.next).emit("receive message", {
      name: "notice",
      message: `${name} join the ${room.next}`,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected: ", socket.id);
  });
});

server.listen(4002, function () {
  console.log("Socket IO server listening on port 4002");
});
