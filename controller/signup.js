
import Signup from "../models/signup.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const postSign = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email are required" });
  }
  if (!password) {
    return res.status(400).json({ message: "password are required" });
  }
  if (!confirmPassword) {
    return res.status(400).json({ message: "confirmPassword are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await Signup.findOne({ email });
         if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const newUser = new Signup({ email,role:"user" ,password: await bcrypt.hashSync(password, 10) });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      email: newUser.email,
      password: newUser.password
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
}
const postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwtToken = jwt.sign({ email: user.email ,role:"admin"}, process.env.JWT_SECRET);

    res.setHeader("Authorization", `Bearer ${jwtToken}`);
    return res.status(200).json({
      message: "Login successful",
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error logging in" });
  }
};


export { postSign, postLogin };