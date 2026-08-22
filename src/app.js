console.log("Starting new project")

const express = require("express");
const connectDB = require("./config/database");


const app = express();

const User = require("./models/user");

const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {

  // Creating a new instance of the User model with the userObj data
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully!")
  } catch (error) {
    console.error("Error saving user to the database", error);
    res.status(500).send("Error saving user to the database", error.message);
  }
})

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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId; // Assuming the user ID is sent in the request body
  const updateData = req.body; // Assuming the update data is sent in the request body
  try {
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

