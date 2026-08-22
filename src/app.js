console.log("Starting new project")

const express = require("express");
const connectDB = require("./config/database");


const app = express();

const User = require("./models/user");

const port = 3000;

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat1988@gmail.com",
    password: "123457",
  }

  // Creating a new instance of the User model with the userObj data
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User added successfully!")
  } catch (error) {
    console.error("Error saving user to the database", error);
    res.status(500).send("Error saving user to the database", error.message);
  }
})

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

