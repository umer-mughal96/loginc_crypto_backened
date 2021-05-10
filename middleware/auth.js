const jwt = require("jsonwebtoken");

const authenticated = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ success: false, msg: "Not Authorized" });
  }

  try {
    const newToken = token.split(" ")[1];

    const decoded = await jwt.decode(newToken, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { authenticated };
