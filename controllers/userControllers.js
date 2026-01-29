const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;

    // 1. check existing user
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //handle password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create user
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    // 4. response
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    //filter
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .select("-password")
      .sort({ userName: -1 });

    res.status(200).json({
      data: {
        users,
      },
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({ message: "Login successful", access_token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  getUsers,
  login,
};
