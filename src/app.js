console.log("Starting new project")

const express = require("express");
const app = express();
const port = 3000;

// app.use((req, res) => {
//   res.send("Hello World!");
// });

app.use('/test', (req, res) => {
  res.send("Hello World namaste!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});