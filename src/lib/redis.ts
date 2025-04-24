import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });

client.on("error", (err) => console.log("Redis Client Error", err));

if (!client.isOpen) {
  console.log("Connecting to Redis...");
  client.connect();
} else {
  console.log("Redis is already connected");
}

export default client;
