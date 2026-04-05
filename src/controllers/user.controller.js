const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { default: mongoose } = require('mongoose');



/**
 * @route POST /api/user/create
 * @access Admins only
 * @param {name, email , password, role} req
 * @returns the created user.
 */
module.exports.createUser = async function (req, res) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please Provide all the required Fields",
        status: "failed"
      })
    }

    const isExists = await userModel.findOne({ email });
    if (isExists) {
      return res.status(409).json({
        message: "User already exists with this account",
        status: "failed"
      })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hash,
      role
    })

    return res.status(201).json({
      message: "user created successfully",
      status: "success",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error occured while creating user",
      status: "failed",
      error: error.message
    })
  }




}


/**
 * @route GET /api/user/getUsers
 * @description This route will be used to getAll the Users present in the DB.
 * @Access Only Admins can Access
 */
module.exports.getAllUsers = async function (req, res) {
  try {
    const users = await userModel.find({
      isDeleted: false
    }).select("-password");

    return res.status(200).json({
      message: "All users fetched Successfully",
      status: "success",
      users
    })
  } catch (error) {
    return res.status(500).json({
      message: "Error occured while fetching users",
      status: "failed",
      error: error.message
    })
  }
}


/**
 * @route GET /api/user/getUser/:id
 * @description This route will be used to get a single user by its ID.
 * @Access Only Admins can Access
 */
module.exports.getUserById = async function (req, res) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid User Id",
        status: "failed"
      });
    }


    const user = await userModel.findOne({
      _id: id,
      isDeleted: false
    }).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed"
      })
    }


    return res.status(200).json({
      message: "User fetched",
      status: "success",
      user
    })

  } catch (error) {
    return res.status(500).json({
      message: "Some Error occured",
      status: "failed",
      error: error.message
    })
  }
}

/**
 * @route GET /api/user/updateUser/:id
 * @description This route will be used to update the User.
 * @Access Only Admins can Access
 */
module.exports.updateUser = async function (req, res) {
  try {
    const { id } = req.params;
    let updates = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Invalid User Id",
        status: "failed"
      })
    }


    // convert string boolean to actual boolean
    if (updates.isActive !== undefined) {
      if (updates.isActive === "true") updates.isActive = true;
      if (updates.isActive === "false") updates.isActive = false;
    }

    //prevent sensitive updates
    if (updates.password) {
      return res.status(400).json({
        message: "Password Updates Not Allowed",
        status: "failed"
      })
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User Not found",
        status: "failed"
      })
    }

    return res.status(200).json({
      message: "User Updated Successfully",
      status: "success",
      updatedUser
    })

  } catch (error) {
    return res.status(500).json({
      message: "Error occured while Updating User",
      status: "failed",
      error: error.message
    })
  }
}


/**
 * @route Delete /api/user/deleteUser/:id
 * @description This route will be used to delete the User(Soft Delete).
 * @Access Only Admins can Access
 */
module.exports.deleteUser = async function (req, res) {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid User Id",
        status: "failed"
      });
    }

    const user = await userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed"
      });
    }

    return res.status(200).json({
      message: "User deleted successfully (soft delete)",
      status: "success"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user",
      status: "failed",
      error: error.message
    });
  }
};