/**
 * Mongoose to connect to MongoDB database
 * Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js
 * It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
 * Mongoose provides a straight-forward, schema-based solution to model your application data.
 * It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
 */

const moongoose = require("mongoose");

const connectionString = "{{CREDENTIALS}}";

const connectDB = async () => {
  await moongoose.connect(connectionString);
};

module.exports = connectDB;