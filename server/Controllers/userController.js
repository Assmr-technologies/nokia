const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = id => {
  const jwtkey = supersecretkey987654;
  return jwt.sign({ id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ error: "User with given email already exist..." });

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required..." });

    if (!validator.isEmail(email))
      return res.status(400).json({ error: "Email must be a valid email..." });

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .json({ error: "Password must be a strong password..." });

    // Get the latest userId from the database
    const latestUser = await userModel.findOne().sort({ userId: -1 });

    const userId = latestUser ? latestUser.userId + 1 : 1;

    user = new userModel({ userId, name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user.id);
    res
      .status(200)
      .json({ id: user.id, userId: user.userId, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "user not exist with given email" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user.id);

    res.status(200).json({
      id: user.id,
      userId: user.userId,
      name: user.name,
      email,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// get single user
const fetchUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// get all user
const fetchAllUser = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    console.log(users);

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = { registerUser, loginUser, fetchUser, fetchAllUser };
