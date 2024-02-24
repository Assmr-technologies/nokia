const express = require("express");
const {
  registerUser,
  loginUser,
  fetchUser,
  fetchAllUser,
} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:userId", fetchUser);
router.get("/users", fetchAllUser);


module.exports = router;
