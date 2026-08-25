const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  /**
   * Read coookies from req cookies object. If token is not present, send 401 Unauthorized response.
   * If token is present, call next() to proceed to the next middleware or route handler.
   * This middleware can be used to protect routes that require authentication.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @param {Function} next - The next middleware function.
   * @returns {void}
   */
  try {
    const token = req.cookies.token;

    const decodedObject = jwt.verify(token, "DEV@Tinder$789"); // Verify the token
    const { _id } = decodedObject; // Get the user ID from the decoded token
    const user = await User.findById(_id);
    if (!token) {
      throw new Error("Token is not valid");
    }
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach the user object to the request for further use in the route handler
    console.log(next, "inside next")
    return next(); // move to request handler  
  } catch (error) {
    console.error("Error during authentication", error);
    res.status(401).send("ERROR" + error.message);
  }

};

module.exports = {
  userAuth
};