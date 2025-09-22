const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { createClient } = require("redis");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const redisClient = createClient({
  socket: {
    host: process.env.ENDPOINT,
    port: process.env.PORT,
  },
  password: process.env.PASSWORD,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect().then(() => console.log("Connected to Redis"));

/* --- Store Feedback --- */
/* --- Store Feedback --- */
app.post("/feedback", async (req, res) => {
  const { name, email, message, subscribed } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: "All fields are required" });

  const id = Date.now().toString();
  const feedback = JSON.stringify({
    id,
    name,
    email,
    message,
    subscribed: !!subscribed,            // ✅ save subscribed
    read: false,
    time: new Date().toISOString()       // ✅ save timestamp
  });

  await redisClient.hSet("feedbacks", id, feedback);
  res.status(200).json({ message: "Feedback saved" });
});

/* --- Get All Feedbacks --- */
app.get("/api/feedbacks", async (req, res) => {
  const data = await redisClient.hGetAll("feedbacks");
  const feedbacks = Object.values(data).map(JSON.parse);
  res.json(feedbacks);
});

/* --- Mark as Read --- */
app.post("/api/feedbacks/read", async (req, res) => {
  const { id } = req.body;
  const data = await redisClient.hGet("feedbacks", id);
  if (!data) return res.status(404).json({ error: "Not found" });

  const feedback = JSON.parse(data);
  feedback.read = true;
  await redisClient.hSet("feedbacks", id, JSON.stringify(feedback));
  res.json({ message: "Marked as read" });
});

/* --- Delete Feedback --- */
app.post("/api/feedbacks/delete", async (req, res) => {
  const { id } = req.body;
  await redisClient.hDel("feedbacks", id);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
