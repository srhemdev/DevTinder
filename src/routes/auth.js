const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const { validatorSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    // Creating a new instance of the User model with the userObj data

    // validate the data
    validatorSignUpData(req);

    const { password } = req.body;

    // encrypt the password
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const { firstName, lastName, emailId } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword, // Store the hashed password instead of the plain text password
    });

    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    console.error("Error saving user to the database", error);
    res.status(500).send("Error saving user to the database: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      return res.send(user);
    }

    throw new Error("Invalid credentials");
  } catch (error) {
    console.error("Error during login", error);
    res.status(400).send("Error during login: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // TODO: Some other clean up activities if required
  // Remove token from cookie, expire the cookie
  res.cookie("token", null, {
    expires: new Date(Date.now())
  });
  res.send();
});

module.exports = authRouter;

