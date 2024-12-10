import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    profilePicture: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};


export default mongoose.model("User", userSchema);
