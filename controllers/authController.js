const User = require("../models/user");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const customError = require("../utils/customError");

// =============== Contoller for sign-up/Register a new User =========
const register = async (req, res, next) => {
  const { email, password, repeatPassword } = req.body;

  if (!email) {
    // return res.status(400).json({ message: "Please provide an email address" });
    return next(customError("please provide an email", 400));
  }

  if (!password) {
    // return res.status(400).json({ message: "please provide a password" });
    return next(customError("please provide a password", 400));
  }

  if (password !== repeatPassword) {
    // return res.status(400).json({ message: "password doesn't match" });
    return next(customError("password does not match", 400));
  }

  //==== bcrypt for handling and unhashing passwords
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({ email, password: hashedPassword });
    return res.status(201).json({ message: "User Created" });
  } catch (error) {
    // return res.status(500).json({ message: error });
    if (error.code === 11000 && error.keyValue.email) {
      return next(customError("Email Already Exists", 401));
    }
    if (error.errors.email.message) {
      return next(customError(error.errors.email.message, 400));
    }
    next(customError("Something went wrong", 500));
  }
};

// ======== Controller to login an existing user ======
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return next(customError("please provide an email", 400));
  }

  if (!password) {
    return next(customError("please provide a password", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(customError("user does not exist", 401));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(customError("Wrong password", 400));
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.status(200).json({ message: "Login sucessfully", token });
};

//=== controller to get user based on valid token ===
const getUser = (req, res, next) => {
  const { userId } = req.user;

  res.status(200).json({ id: userId });
};

module.exports = { register, login, getUser };
