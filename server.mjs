import express from "express";
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "/")));

// Basic logging middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Heartbeat endpoint
app.post("/heartbeat", (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"] || "";
    if (!sessionId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing session ID" });
    }
    return res.json({ status: "ok" });
  } catch (error) {
    console.error("Error in heartbeat endpoint:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

// Broadcasts endpoint
app.get("/get-broadcasts/:sessionId", (_req, res) => {
  try {
    // For now, just return an empty response to avoid errors
    return res.json({});
  } catch (error) {
    console.error("Error in get-broadcasts endpoint:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

// Individual messages endpoint
app.get("/get-message/:sessionId", (_req, res) => {
  try {
    // For now, just return an empty response to avoid errors
    return res.json({});
  } catch (error) {
    console.error("Error in get-message endpoint:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

// URL logging endpoint
app.post("/log", (req, res) => {
  try {
    const { url } = req.body;
    const sessionId = req.headers["x-session-id"] || "";
    console.log(`[LOG] Session ${sessionId} visited: ${url}`);
    return res.json({ status: "ok" });
  } catch (error) {
    console.error("Error in log endpoint:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

// Account-related endpoints
app.post("/acc/create-account", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Here you would store the account in a database
    console.log(`New account created: ${username}`);
    return res.json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/acc/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Here you would verify the account in a database
    console.log(`Login attempt for: ${username}`);
    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/acc/store-referral", (req, res) => {
  try {
    const { username, referralCode } = req.body;
    if (!username || !referralCode) {
      return res
        .status(400)
        .json({ error: "Username and referral code are required" });
    }
    // Here you would store the referral in a database
    console.log(`New referral created by ${username}: ${referralCode}`);
    return res.json({ message: "Referral created successfully" });
  } catch (error) {
    console.error("Error storing referral:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/acc/get-referral-stats", (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    // Here you would fetch referral stats from a database
    // For now, return mock data
    return res.json({
      referralLinks: [],
      referredCount: 0,
      perkStatus: 0,
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Handle GPT API route
const gptRouter = require("./gpt-api.js");
app.use("/api/gpt", gptRouter);

// Service worker route
app.get("/sw.js", (_req, res) => {
  res.sendFile(path.join(__dirname, "sw.js"));
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// Fallback route
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your application at http://0.0.0.0:${PORT}`);
  console.log("Your application is also available at the Replit URL");
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});