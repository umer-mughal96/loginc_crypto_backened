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
    console.log("🚀 ~ file: auth.js ~ line 166 ~ verifyToken ~ user", user);

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
    console.log(
      "🚀 ~ file: auth.js ~ line 184 ~ verifyToken ~ updateUser",
      updateUser
    );
    // await user.save();
    res.status(200).json({ success: true, updateUser, msg: "You Verified !" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const userGoogleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body;
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "577210671376-f8jma6jbeh2ise31rgp23jv42hfmbpgg.apps.googleusercontent.com",
    });
    const { email_verified, name, email } = response.payload;
    console.log(
      "🚀 ~ file: auth.js ~ line 216 ~ userGoogleLogin ~ email_verified",
      email_verified
    );
    if (email_verified) {
      let user = await User.findOne({ email }).select("-password");
      if (user) {
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };

        const token = await generateToken(payload);
        return res.status(200).json({ success: true, loginUser: user, token });
      } else {
        const password = name + process.env.JWT_SECRET;
        let newUser = new User({
          email,
          password,
          role: "user",
          accType: "google",
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        const payload = {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        };
        const token = await generateToken(payload);
        return res
          .status(200)
          .json({ success: true, loginUser: newUser, token });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Something Wrong at Google" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const userFacebookLogin = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (email) {
      let user = await User.findOne({ email }).select("-password");
      console.log(
        "🚀 ~ file: auth.js ~ line 219 ~ userGoogleLogin ~ user",
        user
      );
      if (user) {
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };

        const token = await generateToken(payload);
        return res.status(200).json({ success: true, loginUser: user, token });
      } else {
        const password = name + process.env.JWT_SECRET;
        let newUser = new User({
          email,
          password,
          role: "user",
          accType: "facebook",
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        const payload = {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        };
        const token = await generateToken(payload);
        return res
          .status(200)
          .json({ success: true, loginUser: newUser, token });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Something Wrong at Facebook" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  registerUser,
  userLogin,
  forgotPassword,
  verifyToken,
  userGoogleLogin,
  userFacebookLogin,
};
