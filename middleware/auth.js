const jwt = require("jsonwebtoken");

const authenticated = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ success: false, msg: "Not Authorized" });
  }

  try {
    // const newToken = token.split(" ")[1]; This is incorrect. It returns Undefined value
    // console.log("This is token : "+token);

    const decoded = await jwt.decode(token, process.env.JWT_SECRET);
    // console.log("In Middleware");

    // console.log(decoded);
    req.user = decoded.user;

    // console.log("In Middleware 2");
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { authenticated };
