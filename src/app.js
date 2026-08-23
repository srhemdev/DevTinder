console.log("Starting new project")
// validator library can be used to validate email, phone number, etc. It can also be used to sanitize data. It is a popular library for data validation and sanitization in Node.js applications. It provides a set of functions that can be used to validate and sanitize strings, numbers, dates, and other data types. It can be used to check if a string is a valid email address, phone number, URL, or IP address. It can also be used to check if a string contains only letters, numbers, or special characters. It can also be used to sanitize data by removing unwanted characters or formatting data in a specific way.
const express = require("express");
const connectDB = require("./config/database");
const { validatorSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt"); // Importing the bcrypt library for password hashing
const cookieParser = require("cookie-parser"); // Importing the cookie-parser library for handling cookies
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for JWT token generation and verification
const { userAuth } = require("./middlewares/auth"); // Importing the userAuth middleware for authentication


const app = express();

const User = require("./models/user");

const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.post("/signup", async (req, res) => {
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
    res.send("User added successfully!")
  } catch (error) {
    console.error("Error saving user to the database", error);
    res.status(500).send("Error saving user to the database", error.message);
  }
})

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create JWT token
      const token = jwt.sign({ _id: user._id }, "DEV@Tiner$789", { expiresIn: "1d" }); // Replace "your_secret_key" with

      res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true }); // Set the token in a cookie
      // Add the token to cookie and send the response back to the user
      res.send("Login successful!");
    }
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Error during login", error);
    res.status(400).send("Error during login", error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  res.send("Welcome, " + req.user.firstName);
});

app.get("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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

app.patch("/user/:userId", async (req, res) => {
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

app.post("sendConnectionRequest", userAuth, async (req, res) => {
  const { firstName } = req.body;
  try {
    const sender = firstName;

    if (!sender) {
      return res.status(404).send("Sender or receiver not found");
    }
    res.send(firstName + "Connection request sent successfully!");
  } catch (error) {
    console.error("Error sending connection request", error);
    res.status(500).send("Error sending connection request" + error.message);
  }
});

connectDB().then(() => {
  console.log("Connected to MongoDB database");
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB database", err);
});

// app.use((req, res) => {
//   res.send("Hello World!");
// });

// app.get('/user/:userId', (req, res) => {
//   console.log("req.params", req.params); // get path params
//   // console.log("req.query", req.query); // get query params
//   res.send({ firstName: "John", lastName: "Doe" });
// });

// app.post('/user', (req, res) => {
//   res.send("Data saved successfully to the database!");
// });

// app.delete('/user', (req, res) => {
//   res.send("Data deleted successfully from the database!");
// });

// app.use('/test', (req, res) => {
//   res.send("Hello World namaste!");
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

/**
 * 
 app.use('/test', (req, res, next) => {
  //res.send("Hello World namaste!");
  next();
}, (req, res, next) => {
  res.send("Hello World namaste 2!"); //Hello World namaste 2! would be returned as the response because next() was called in the previous middleware function, allowing this function to execute and send the response.
});
 */

