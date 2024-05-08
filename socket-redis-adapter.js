const io = require("socket.io");
const redisAdapter = require("socket.io-redis");
const Redis = require("ioredis");

function createServer(port) {
  const server = io(port); // a new instance of socket.io is initialized with a specific port number.

  console.log(`Client connected to Server on http://localhost:${port}`);

  const redisClient = new Redis({
    // a connection to the Redis server is established using the ioredis library
    host: "localhost",
    port: 6379,
  });

  server.adapter( // redis adapter is attached to socket.io
    // This step enables the socket.io server to use Redis as a backend for broadcasting events and managing channels.
    redisAdapter({ pubClient: redisClient, subClient: redisClient.duplicate() })
  );
  server.on("connection", (socket) => { 
    console.log(`user with id: ${socket.id} is connected!`);

    socket.on("chat message", (msg) => {
      console.log(`message from Server on port ${port}: ` + msg);
      server.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected from Server on port ${port}`);
    });
  });

  return server;
}

//creating multiple servers
createServer(4001);
createServer(4002);
createServer(4003);
