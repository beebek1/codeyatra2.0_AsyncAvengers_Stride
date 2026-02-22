import bcrypt from "bcrypt";
import User from "./auth.models.js";
import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/token.js";

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    //check wheather the user Exists or not
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    //Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    //Check the user password to the password on database
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user.id,
      token: token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.user is set by authGuard
    const userId = req.user.userId;
    

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found in token",
      });
    }

    // Optionally, fetch user info from DB if needed
    // const user = await User.findByPk(userId);

    return res.status(200).json({
      success: true,
      userId, // this is the UUID from your database
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user info",
      error: error.message,
    });
  }
};