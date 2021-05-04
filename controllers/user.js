const userServices = require("../services/user");
const authServices = require("../services/auth");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//Update User By Id

const getUserById = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const loginUser = await userServices.getUserById(userId);

    res.status(200).json({ success: true, loginUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: true, msg: "User Not Found" });
    }
    if (!req.body.email) {
      return res.status(400).json({ success: true, msg: "Invalid Email" });
    }
    let updatedUser = {
      email: req.body.email,
    };
    await authServices.updateUser(req.user.id, updatedUser);
    return res.status(200).json({ success: true, msg: "User Updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: true, msg: "User Not Found" });
    }
    if (!req.body.currentPassword) {
      return res.status(400).json({ success: true, msg: "Invalid Password" });
    }
    let user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ success: true, msg: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: true, msg: "Invalid Credentials" });
    }

    let salt = await bcrypt.genSalt(10);
    let newPassword = await bcrypt.hash(req.body.newPassword, salt);
    let updatedUser = {
      password: newPassword,
    };
    await authServices.updateUser(req.user.id, updatedUser);
    return res.status(201).json({ success: true, msg: "User Updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const reportAboutArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: true, msg: "Login To Report Article" });
    }
    let reportObj = {
      user: userId,
      message: req.body.message,
    };
    let article = await getArticle(articleId);
    article.report.unshift(reportObj);
    await article.save();
    return res
      .status(200)
      .json({ success: true, msg: "SuccessFully Reported" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    let users = await userServices.getAllUsers();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllEditors = async (req, res, next) => {
  try {
    let editors = await userServices.getAllConditionalUsers({ role: "editor" });
    return res.status(200).json({ success: true, editors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllUserArchives = async (req, res, next) => {
  try {
    let userId = req.user.id;
    let userArchivedArticles = await getUserArchivedArticles(userId);
    return res.status(200).json({ success: true, userArchivedArticles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  updateUser,
  getUserById,
  updateUserPassword,
  reportAboutArticle,
  getAllUsers,
  getAllEditors,
  getAllUserArchives,
};
