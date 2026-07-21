const jwt = require('jsonwebtoken');
const User = require('../models/user');

const refresh = async (req, res) => {
  // 1. Grab the HTTP-only cookie from the incoming headers
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // 2. Cryptographically verify the token signature
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 3. Ensure the user account still exists and is healthy
    const user = await User.findById(decoded.userId);
    if (!user || user.accountStatus !== 'active') {
      return res.status(403).json({ message: "User account is invalid or suspended" });
    }

    // 4. Verification successful! Create a brand-new short-lived access token
    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // 5. Send it back to frontend application memory
    return res.status(200).json({
      accessToken: newAccessToken,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });

  } catch (error) {
    console.error("Refresh token validation error:", error.message);
    return res.status(403).json({ message: "Session expired or invalid token" });
  }
}

module.exports = { refresh }