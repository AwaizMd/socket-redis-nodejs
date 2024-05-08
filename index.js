const io = require("socket.io");
const redis = require("redis");
const redisAdapter = require("socket.io-redis");

function createServer(port) {
  const server = io(port);
 
  console.log(`Client connected to Server on http://localhost:${port}`);
 
  let redisClient = redis.createClient({
    legacyMode: true,
    socket: {
      port: 6379,
      host: "13.200.31.150"
    }
 })
 
redisClient.connect().catch(console.error)
  server.adapter(
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
 
const port = process.env.PORT || 4001;
createServer(port);
 