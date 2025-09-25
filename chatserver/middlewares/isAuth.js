import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token =
      req.headers.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No authentication token found. Please login.",
      });
    }

    let decode;
    try {
      decode = jwt.verify(token, process.env.Jwt_sec);
    } catch (jwtError) {
      console.error("JWT Verification failed:", jwtError.message);
      return res.status(401).json({
        message: "Invalid or expired token. Please login again.",
      });
    }

    const user = await User.findById(decode._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Internal server error during authentication.",
    });
  }
};
