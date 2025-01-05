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

import {postSign,postLogin} from "./controller/signup.js";
import{postProducts,getProducts} from "./controller/products.js";

import{jwtmiddleware,checkRoleMiddleware} from "./middlewares/jwt.js";
import {postOrders} from "./controller/orders.js";







app.post("/register",postSign );
app.post("/login",postLogin );
app.post("/order",jwtmiddleware,postOrders)
app.post("/products",jwtmiddleware,checkRoleMiddleware,postProducts);

app.get("/products",getProducts)


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
