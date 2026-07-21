require('dotenv').config()

const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcrypt')

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate the same 7-day token configuration
    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

    // ESSENTIAL: Send a clean JSON response back to Postman/Browser
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}




const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate ONE long-lived token (e.g., 7 days)
    const token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });

    // ESSENTIAL: Send a clean JSON response back to end the request smoothly
    return res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



module.exports = {
    login , Register
}