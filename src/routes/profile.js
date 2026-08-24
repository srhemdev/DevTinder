const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth"); // Importing the userAuth middleware for authentication
const { validatorProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validatorProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);
    await loggedInUser.save();
    res.send("Welcome, " + loggedInUser.firstName);
  } catch (e) {
    return res.status(400).send("ERROR:" + e.message);
  }
});

// forgot password api, add validate logic
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {

  } catch (e) {
    return res.status(400).send("ERROR:" + e.message);
  }
});

module.exports = profileRouter;