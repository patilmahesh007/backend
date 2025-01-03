import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

import Signup from "./models/signup.model.js";
import {postSign,postLogin} from "./controller/signup.js";
import{postProducts} from "./controller/products.js";

import{jwtmiddleware,checkRoleMiddleware} from "./middlewares/jwt.js";



app.get("/test", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Signup.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, name, createdAt } = user;
    return res.status(200).json({
      message: "User found",
      user: { email, name, createdAt },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error(err);
    return res.status(500).json({ message: "Error verifying token" });
  }
});



app.post("/register",postSign );
app.post("/login",postLogin );



app.post("/order",jwtmiddleware,async (req, res) => {
  res.json({ message: "Order placed werfg" ,user:req.user});
})


app.post("/products",jwtmiddleware,checkRoleMiddleware,postProducts);
const uri = process.env.URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }                                             
};

app.listen(5000, () => {
  connectDB();
  console.log("Server is running on port 5000");
});
