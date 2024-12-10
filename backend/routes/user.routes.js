import express from "express";
import { registerUser, loginUser, logoutUser, uploadProfilePicture, getUser } from "../controllers/user.controller.js";
import { body } from "express-validator";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register",
  [
    body("fullname").isLength({ min: 3 }).withMessage("Full name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  registerUser
);

router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
] ,loginUser);

router.get("/logout", logoutUser);

router.get("/get-user", protectRoute, getUser);

router.post("/upload-profile-picture", uploadProfilePicture);

export default router;
