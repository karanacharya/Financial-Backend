const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');


module.exports.isLoggedIn = async function (req, res, next) {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({
        message: "Unauthorized Access, Token Not Found",
        status: "failed",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById(decoded._id).select("-password");

    if (!user || user.isDeleted) {
      return res.status(401).json({
        message: "User Not Found or Deleted",
        status: "failed",
      });
    }


    if (!user.isActive) {
      return res.status(403).json({
        message: "User is inactive",
        status: "failed",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "User Not Authorized",
      status: "failed",
      error: error.message,
    });
  }
};



module.exports.authorizeRoles = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied",
        status: "failed"
      });
    }

    next();
  };
};
