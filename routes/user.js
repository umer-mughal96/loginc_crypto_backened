const express = require('express');
const router = express.Router();
const { getUserById,updateUser,updateUserPassword,reportAboutArticle,getAllUsers,getAllEditors,getAllUserArchives } = require('../controllers/user');
const { authenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');





router.get('/', authenticated, getUserById);
router.get('/users', authenticated , isAdmin , getAllUsers);
router.get('/editors', authenticated , isAdmin , getAllEditors);
router.patch('/updateuser', authenticated, updateUser);
router.patch('/updateuserp', authenticated, updateUserPassword);
router.get('/archives', authenticated, getAllUserArchives);


router.post('/report/:id', authenticated, reportAboutArticle);

module.exports = router;
