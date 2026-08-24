const express = require("express");

const userRouter = express.Router();

const User = require("../models/user");

userRouter.get("/user", async (req, res) => {
  const email = req.body.emailId; // Assuming the email is sent in the request body
  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error("Error fetching user from the database", error);
    res.status(500).send("Error fetching user from the database", error.message);
  }
});

userRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is sent in the request body
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully!");
    }
  } catch (error) {
    console.error("Error deleting user from the database", error);
    res.status(500).send("Error deleting user from the database", error.message);
  }
});

userRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId; // Getting the user ID from the URL parameters
  const updateData = req.body; // Assuming the update data is sent in the request body
  try {
    const ALLOWED_UPDATE_FIELDS = [
      "gender", "photoUrl", "about", "skills"
    ];

    const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATE_FIELDS.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      returnDocument: "after", // Return the updated document
      runValidators: true, // Run schema validators on the update
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User updated successfully!");
    }
  } catch (error) {
    console.error("Error updating user in the database", error);
    res.status(500).send("Error updating user in the database" + error.message);
  }
});

userRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    console.error("Error fetching users from the database", error);
    res.status(500).send("Error fetching users from the database", error.message);
  }
});

module.exports = userRouter;