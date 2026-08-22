const mongoose = require("mongoose");

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
  },
  password: {
    type: String,
    required: true,
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
    default: "https://img.magnific.com/premium-photo/silhouette-adult-woman-female-avatar-social-media-icon-illustration-isolated_314149-11966.jpg"
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