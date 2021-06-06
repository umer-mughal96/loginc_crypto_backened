const express = require("express");
const {
  getAllUsers,
  editUser,
  deleteUser,
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
  getPackages,
  deActivateUser,
  activateUser
} = require("../../controllers/admin/admin");
const { authenticated } = require("../../middleware/auth");
const { isAdmin } = require("../../middleware/roles");
const router = express.Router();

router.get("/users", authenticated, isAdmin, getAllUsers);

router.patch("/edit/user/:user_id", authenticated, isAdmin, editUser);
router.delete("/delete/user/:user_id", authenticated, isAdmin, deleteUser);
router.patch("/deactivate/user/:user_id", authenticated, isAdmin, deActivateUser);
router.patch("/activate/user/:user_id", authenticated, isAdmin, activateUser);

router.post("/create/article", authenticated, isAdmin, createArticle);
router.get("/articles", authenticated, isAdmin, getAllArticles);

router.patch(
  "/edit/article/:article_id",
  authenticated,
  isAdmin,
  updateArticle
);
router.delete(
  "/delete/article/:article_id",
  authenticated,
  isAdmin,
  deleteArticle
);



router.get("/packages", authenticated, isAdmin, getPackages);

module.exports = router;
