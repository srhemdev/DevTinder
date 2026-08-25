const mongoose = require("mongoose");
const validator = require("validator"); // Importing the validator library for email validation
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken library for JWT token generation
const bcrypt = require("bcrypt"); // Importing the bcrypt library for password hashing

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
    enum: {
      values: ["male", "female", "other"],
      message: "{VALUE} is not a valid gender type"
    },
    // validate(value) {
    //   if (!["male", "female", "other"].includes(value)) {
    //     throw new Error("Gender must be male, female, or other");
    //   }
    // }
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

userSchema.index({
  firstName: 1,
  lastName: 1
})

// Method to generate JWT token for the user
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$789", { expiresIn: "1d" }); // Replace "your_secret_key" with  
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;