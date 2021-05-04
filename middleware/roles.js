const isCreator = (req, res, next) => {
  try {
    if (req.user.role == 'creator') {
      next();
    } else {
      res.status(400).json({ success: false, msg: 'Access Denied' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




const isEditorOrIsCreator = (req, res, next) => {
  try {
    console.log("🚀 ~ file: roles.js ~ line 19 ~ isEditor ~ req.user.role", req.user.role)
    if (req.user.role == 'editor' || req.user.role == 'creator') {
      next();
    } else {
      res.status(400).json({ success: false, msg: 'Access Denied' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};






const isEditor = (req, res, next) => {
  try {
    console.log("🚀 ~ file: roles.js ~ line 19 ~ isEditor ~ req.user.role", req.user.role)
    if (req.user.role == 'editor') {
      next();
    } else {
      res.status(400).json({ success: false, msg: 'Access Denied' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


const isAdmin = (req, res, next) => {
  try {
    console.log("🚀 ~ file: roles.js ~ line 19 ~ isEditor ~ req.user.role", req.user.role)
    if (req.user.role == 'admin') {
      next();
    } else {
      res.status(400).json({ success: false, msg: 'Access Denied' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



module.exports = {isCreator,isEditor,isEditorOrIsCreator,isAdmin}
