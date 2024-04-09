const bcrypt = require("bcrypt");

const User = require("../model/user.model");
const jwt = require("../middleware/jwt");
const BlockedUser = require("../model/blocked-user.model");
const catchAsync = require("..//utils/catch-async");

const signup = catchAsync(async (req, res) => {
  const { email, username, password, role, name } = req.body;

  if (!email || !password || !username || !role) {
    return res.status(404).json({ message: "all fields required" });
  } else if (role === "company" && !name) {
    return res.status(404).json({ message: "all fields required" });
  }
  const exitingUser = await User.findOne({ email });
  const existingBlockedUser = await BlockedUser.findOne({ email });

  if (exitingUser) {
    return res.status(409).json({ message: "email already exist" });
  } else if (existingBlockedUser) {
    return res.status(409).json({
      message: "You are a blocked user and cannot create your account",
    });
  } else {
    const hashPaswd = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashPaswd,
      role,
      name: name === "" ? username : name,
    });

    await newUser.save();
    const token = jwt.sign({ newUser });
    return res.status(200).json({ message: "Signup Successful", token, role });
  }
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Enter email please" });
  } else if (!password) {
    return res.status(401).json({ message: "Enter Password " });
  } else {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "wrong credentials" });
    }
    const isPaswd = await bcrypt.compare(password, user.password);
    console.log(isPaswd, "isPaswd");
    if (!isPaswd) {
      return res.status(401).json({ message: "wrong credentials" });
    }

    if (user) {
      if (user.role === "admin") {
        const token = jwt.sign({ user });
        console.log(user);
        res
          .status(200)
          .json({ message: "login successful", token, role: user.role });
      } else if (user.role === "student") {
        const token = jwt.sign({ user });
        res
          .status(200)
          .json({ message: "login successful", token, role: user.role });
      } else {
        const token = jwt.sign({ user });
        res.status(200).json({
          message: "login successful",
          name: user.name,
          token,
          role: user.role,
        });
      }
    }
  }
});

module.exports = { login, signup };
