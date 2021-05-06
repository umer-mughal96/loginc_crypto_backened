const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jwt");
const bcrypt = require("bcrypt");
const cron = require("node-cron");
const sendEmailToUser = require("../utils/email");
const Token = require("../models/Token");
const randomstring = require("randomstring");
const authServices = require("../services/auth");


//POST        @REGISTER USER
//API         @  '/register '

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email, password , firstName , lastName } = req.body;
    let findUser = await User.findOne({ email });
    if (findUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already exist" });
    }
    let user = new User({
      email,
      password,
      role: "user",
      firstName,
      lastName
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = await generateToken(payload, req, res);

    // var job = cron.schedule(
    //   '* * * * *',
    //   async () => {
    //     try {
    //       const user1 = await User.findOne({
    //         email: user.email,
    //       });
    //       if (user1.isVerified === false) {
    //         try {
    //           await User.findOneAndDelete({
    //             email: user1.email,
    //           });
    //         } catch (er) {
    //           console.log(er);
    //         }
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    //   {
    //     scheduled: false,
    //   }
    // );
    // await sendEmailToUser();

    res.status(201).json({ success: true, msg: "Successfully registered!" });
    // job.start();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @LOGIN USER
//API         @  '/signin'

const userLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    const token = await generateToken(payload);
    const loginUser = await User.findOne({ email }).select("-password");
    res.status(200).json({ success: true, loginUser, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @FORGOT PASSWORD
//API         @  '/forgotpassword'

const forgotPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array() });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Email !" });
    }

    let forgetCode = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    let userToken = new Token({
      userId: user.id,
      token: forgetCode,
    });
    await sendEmailToUser(user, forgetCode);
    await userToken.save();
    res.status(200).json({ success: true, msg: "Send link to your email" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//POST        @VERIFY TOKEN
//API         @  '/verify'

const verifyToken = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, msg: "Provide Your Token" });
    }
    const tokenUser = await Token.findOne({ token });

    if (!tokenUser) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid Verify Code!" });
    }
    const user = await User.findOne({ _id: tokenUser.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid User!" });
    }

    if (!password) {
      return res
        .status(404)
        .json({ success: false, msg: "Provide Password Filed!" });
    }

    const salt = await bcrypt.genSalt(10);
    let newHashedPassword = await bcrypt.hash(password, salt);
    let updateUserWithNewPassword = { password: newHashedPassword };
    let updateUser = await authServices.updateUser(
      user.id,
      updateUserWithNewPassword
    );
    // await user.save();
    res.status(200).json({ success: true, updateUser, msg: "You Verified !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports = {
  registerUser,
  userLogin,
  forgotPassword,
  verifyToken,
};
