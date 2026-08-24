const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const { firstName } = req.body;
  try {
    const sender = firstName;

    if (!sender) {
      return res.status(404).send("Sender or receiver not found");
    }
    res.send(firstName + " Connection request sent successfully!");
  } catch (error) {
    console.error("Error sending connection request", error);
    res.status(500).send("Error sending connection request: " + error.message);
  }
});

module.exports = requestsRouter;