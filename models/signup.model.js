import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator", "editor"],
      default: "user"
    }
  },
  { timestamps: true }
);

const Signup = mongoose.model("Signup", signupSchema);
export default Signup;
