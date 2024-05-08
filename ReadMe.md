# Socket.io with Redis


**Socket :-** Socket.IO is a library for real-time web applications, enabling bidirectional communication between web clients and servers

**Redis :-** Redis is a powerful in-memory data store often used as a database, cache, or message broker.

*When combined, Redis and Socket.IO can provide a scalable and distributed solution for real-time communication.*


**Redis Adapter :-**

The Redis Adapter for Socket.IO allows multiple Socket.IO instances to communicate with each other using a Redis pub/sub mechanism. This is particularly useful in scenarios where you have multiple Node.js processes or servers running Socket.IO instances and need to share events/messages between them.

Ex:-
``` js

io.adapter(redisAdapter({ pubClient: redisClient, subClient: redisClient.duplicate() }));

```

Here, the socket.io server instance (io) is configured to use Redis as an adapter for handling pub/sub operations. The redisAdapter function is used to create the adapter configuration.

**pubClient:** This is the Redis client used for publishing messages. It is set to redisClient, which is the original Redis client instance created earlier.

**subClient:** This is the Redis client used for subscribing to channels. However, instead of using the original redisClient, a duplicated client is used by calling redisClient.duplicate(). This ensures that the subscribing Redis client operates independently from the publishing client.

By using a duplicated Redis client for subscribing, it allows the adapter to safely manage the subscription without interfering with the publishing operations. This is important because the adapter may need to subscribe to specific Redis channels to receive messages related to socket.io events.

**Redis as Message Broker:-**

Redis acts as a message broker between the servers.
When a server broadcasts a message, it publishes the message to Redis.
All other servers subscribed to Redis receive the message and broadcast it to their connected clients.


# Here's how Redis pub/sub works as a message broker:

1. **Publishers:** Publishers are clients that send messages to Redis channels. They use the PUBLISH command to send messages to specific channels. When a publisher sends a message to a channel, Redis delivers the message to all subscribers of that channel.

2. **Subscribers:** Subscribers are clients that receive messages from Redis channels. They use the SUBSCRIBE command to subscribe to one or more channels. Once subscribed, the client enters a listening mode where it receives messages published to the subscribed channels in real-time.

3. **Channels:** Channels are named communication paths in Redis. Publishers publish messages to specific channels, and subscribers subscribe to channels to receive messages. Channels are created dynamically as messages are published to them. There's no need to explicitly create channels before using them.

4. **Message Delivery:** When a publisher sends a message to a channel, Redis delivers the message to all subscribers of that channel in a broadcast manner. Subscribers receive the message in real-time as long as they remain subscribed to the channel.


# Step by step working :-

how the combination of socket.io and Redis, along with the Redis adapter, works step by step for the scenario described in the provided code(in combinedServers.js).

1. **Socket.IO Initialization**:
   - When your Node.js application starts, it initializes three instances of the `socket.io` library, one for each server, on ports 4001, 4002 and 4003.

2. **Connection Establishment**:
   - When a client (web browser or any other client application) connects to one of the servers, a WebSocket connection is established between the client and the server. This connection allows real-time bidirectional communication between the client and the server.

3. **Socket.IO Events**:
   - The connection event is emitted when a client successfully establishes a WebSocket connection with the server. This event handler is responsible for executing code when a new client connects to the server.

4. **Redis Initialization**:
   - Meanwhile, your Node.js application also initializes a connection to the Redis server using the `ioredis` library. This connection allows your application to communicate with Redis and utilize its pub/sub functionality.

5. **Redis Pub/Sub**:
   - Redis provides a pub/sub mechanism where clients can publish messages to channels and subscribe to receive messages from channels.
   - In your scenario, both servers use the same Redis instance for pub/sub messaging.

6. **Redis Adapter Integration**:
   - The `socket.io-redis` library provides an adapter for socket.io to integrate with Redis for broadcasting events across multiple server instances.
   - The Redis adapter is configured to use the same Redis instance for both publishing (`pubClient`) and subscribing (`subClient`).

7. **Socket.IO-Redis Integration**:
   - The Redis adapter is attached to each `socket.io` instance using the `io.adapter()` method.
   - This integration allows `socket.io` instances to transparently forward events and messages to other instances via Redis, enabling communication between clients connected to different server instances.

8. **Message Broadcasting**:
   - When a client sends a message to one of the servers, the server emits the message to all connected clients using `io.emit()` or `socket.emit()`, depending on the desired scope of the message.
   - Additionally, the Redis adapter intercepts these events and publishes them to the Redis server.

9. **Redis Message Distribution**:
   - The Redis server receives the published messages and distributes them to all subscribers (other `socket.io` instances) that are listening on the corresponding channels.
   - Each subscribed `socket.io` instance receives the message and emits it to all connected clients, ensuring that clients on different servers receive the broadcasted messages.

10. **Client Response**:
   - Clients connected to different servers receive the broadcasted messages via their WebSocket connections and update their UI or perform any necessary actions based on the received messages.

In summary, the combination of socket.io and Redis, along with the Redis adapter, allows for seamless real-time communication between clients connected to different server instances. Redis acts as a central message broker, facilitating the distribution of messages across server instances and enabling clients to communicate with each other in a distributed environment.