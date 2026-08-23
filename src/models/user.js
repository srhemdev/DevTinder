const mongoose = require("mongoose");
const validator = require("validator"); // Importing the validator library for email validation

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 500
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please enter a valid email address");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password must be a strong password");
      }
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender must be male, female, or other");
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://img.magnific.com/premium-photo/silhouette-adult-woman-female-avatar-social-media-icon-illustration-isolated_314149-11966.jpg",
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Please enter a valid URL for the photo");
      }
    }
  },
  about: {
    type: String,
    default: "Hey there! I am using DevTinder.",
  },
  skills: {
    type: [String],
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
}
);

const User = mongoose.model("User", userSchema);

module.exports = User;