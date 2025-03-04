import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // Set up event stream for the response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Process the incoming request
    const { newMessage } = req.body;

    // Simple mock response for testing
    const words =
      `I received your message: "${newMessage}". This is a sample response from the GPT service. The actual GPT integration requires API keys and proper configuration.`.split(
        " ",
      );

    // Send words one by one with delay to simulate streaming
    for (let i = 0; i < words.length; i++) {
      res.write(`data: ${words[i]} `);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    res.write("\ndata: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Error in GPT API:", error);
    res.status(500).send({ error: "Failed to process GPT request" });
  }
});

module.exports = router;
