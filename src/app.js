console.log("Starting new project")
// validator library can be used to validate email, phone number, etc. It can also be used to sanitize data. It is a popular library for data validation and sanitization in Node.js applications. It provides a set of functions that can be used to validate and sanitize strings, numbers, dates, and other data types. It can be used to check if a string is a valid email address, phone number, URL, or IP address. It can also be used to check if a string contains only letters, numbers, or special characters. It can also be used to sanitize data by removing unwanted characters or formatting data in a specific way.
const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt"); // Importing the bcrypt library for password hashing
const cookieParser = require("cookie-parser"); // Importing the cookie-parser library for handling cookies
const { userAuth } = require("./middlewares/auth"); // Importing the userAuth middleware for authentication
const authRouter = require("./routes/auth"); // Importing the authRouter for authentication routes
const profileRouter = require("./routes/profile"); // Importing the profileRouter for profile routes  
const requestRouter = require("./routes/request"); // Importing the requestsRouter for requests routes
const userRouter = require("./routes/user");
const cors = require('cors')
  ;

const app = express();

const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



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

