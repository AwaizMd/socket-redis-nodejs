const { RedisStreamAdapter } = require("socket.io-redis");
const Redis = require("ioredis");
const io = require("socket.io");

function createServer(port) {
  const server = io(port);
  console.log(`Client connected to Server on http://localhost:${port}`);

  const redisClient = new Redis({
    host: "localhost",
    port: 6379,
  });

  const redisStreamAdapter = new RedisStreamAdapter({
    redis: redisClient,
    key: `socket.io:${port}`, // Unique key for each server instance
  });

  server.adapter(redisStreamAdapter);

  server.on("connection", (socket) => {
    console.log(`user with id: ${socket.id} is connected!`);

    socket.on("chat message", (msg) => {
      console.log(`message from Server on port ${port}: ` + msg);
      server.emit("chat message", msg);
      
      // Publish the message to a Redis Stream
      redisClient.xadd(`messages:${port}`, "*", "message", msg);
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
