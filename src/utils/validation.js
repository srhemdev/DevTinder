
const validator = require("validator");

const validatorSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 500) {
    throw new Error("First name must be between 4-500 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be a strong password");
  }
}

const validatorProfileData = (req) => {
  const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "about", "skills", "age"];
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
  return isEditAllowed;
}


module.exports = {
  validatorSignUpData,
  validatorProfileData
};