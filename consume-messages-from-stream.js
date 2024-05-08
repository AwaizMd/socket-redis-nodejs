const Redis = require("ioredis");

// Connect to Redis server
const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

// Stream name
const streamName = "messages:4001"; // Use the appropriate stream name

// Start reading messages from the beginning (use "$" as the ID)
const startFrom = "$";

// Function to consume messages from the stream
async function consumeMessages() {
  // Continuously read messages from the stream
  while (true) {
    try {
      // Read messages from the stream
      const result = await redisClient.xread("BLOCK", 1000, "STREAMS", streamName, startFrom);

      // Extract messages from the result
      const messages = result?.[0]?.[1];

      // Process each message
      if (messages) {
        for (const [messageId, message] of messages) {
          console.log(`Received message ${messageId}: ${message}`);
          
          // Update the ID to read messages from next time
          startFrom = messageId;
        }
      }
    } catch (error) {
      console.error("Error consuming messages:", error);
    }
  }
}

// Start consuming messages
consumeMessages();
