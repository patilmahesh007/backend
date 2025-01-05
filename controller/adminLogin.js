import jwt from "jsonwebtoken";
import Signup from "../models/signup.model.js";
import bcrypt from "bcrypt";
const postAdminLogin = async (req, res) => {
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
  
      const jwtToken = jwt.sign({ email: user.email ,role:"admin",_id:user._id}, process.env.JWT_SECRET);
  
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
  export {postAdminLogin}