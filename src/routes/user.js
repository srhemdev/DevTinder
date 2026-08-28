const express = require("express");
const { userAuth } = require("../middlewares/auth");

const userRouter = express.Router();

const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";

userRouter.get("/user", async (req, res) => {
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

userRouter.delete("/user", async (req, res) => {
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

userRouter.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId; // Getting the user ID from the URL parameters
  const updateData = req.body; // Assuming the update data is sent in the request body
  try {
    const ALLOWED_UPDATE_FIELDS = [
      "gender", "photoUrl", "about", "skills"
    ];

    const isUpdateAllowed = Object.keys(updateData).every((k) => ALLOWED_UPDATE_FIELDS.includes(k));

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }

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

// userRouter.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       return res.status(404).send("Users not found");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     console.error("Error fetching users from the database", error);
//     res.status(500).send("Error fetching users from the database", error.message);
//   }
// });

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  try {
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl"
    ]);
    /**
     * populate("fromUserId", "firstName lastName");
     */
    res.json({
      message: "Data fetched successfully!",
      data: connectionRequests
    })

  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  /**
   * Ramesh => Nimmi
   * Nimmi => Ramesh
   */

  try {
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", [
      "firstName",
      "lastName"
    ]).populate("toUserId", [
      "firstName",
      "lastName"
    ])
    // Return connections to logged in user
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id === loggedInUser._id) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    /**
     * populate("fromUserId", "firstName lastName");
     */
    res.json({
      message: "Data fetched successfully!",
      data
    })

  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});


userRouter.get("/feed", userAuth, async (req, res) => {
  /**
   * user should see all cards in database except 
   * 0. his own card
   * 1. his connections
   * 2. ignored people
   * 3. already sent the connection request
   */
  // Example: Shweta = [Ramesh, Nimmi]
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const hideUsersFromFeed = new Set([loggedInUser._id.toString()]);
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    connectionRequests.forEach((connectionRequest) => {
      hideUsersFromFeed.add(connectionRequest.fromUserId.toString());
      hideUsersFromFeed.add(connectionRequest.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }
      ]

    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.send(users);
  } catch (error) {
    res.status(400).send("Error fetching feed:", error.message);
  }
});

module.exports = userRouter;