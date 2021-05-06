const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  registerUser,
  userLogin,
  forgotPassword,
  verifyToken,
  userGoogleLogin,
  userFacebookLogin,
} = require("../controllers/auth");

router.post(
  "/register",
  [
    check(
      "password",
      "Please enter password that contains 6 or more characters"
    )
      .isLength({ min: 6 })
      .notEmpty(),
    check("email", "Enter Valid Email").isEmail().notEmpty(),
    check("firstName", "Please Enter First Name").notEmpty(),
    check("lastName", "Please Enter Last Name").notEmpty(),
  ],

  registerUser
);

router.post(
  "/signin",
  [
    check("email", "Enter Valid Email").isEmail(),
    check(
      "password",
      "Please enter password that contains 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  userLogin
);

router.post(
  "/forgotpassword",
  [check("email", "Enter Valid Email").isEmail()],
  forgotPassword
);

router.patch("/verify", verifyToken);

module.exports = router;
