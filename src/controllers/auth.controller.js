const express = require('express');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')



module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password both are required",
                status: "failed"
            })
        }

        const loggedInuser = await userModel.findOne({ email });
        if (!loggedInuser) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            })
        }

        if (!loggedInuser.isActive) {
            return res.status(403).json({
                message: "User is deactivated",
                status: "failed"
            });
        }


        const isPasswordvalid = await bcrypt.compare(password, loggedInuser.password);
        if (!isPasswordvalid) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            })
        }


        const token = jwt.sign({
            _id: loggedInuser._id,
            email: loggedInuser.email
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie("token", token);

        return res.status(200).json({
            message: "Logged in successfully",
            status: "success",
            user: {
                _id: loggedInuser._id,
                email: loggedInuser.email,
                role: loggedInuser.role
            },
        })


    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            status: "failed",
            error: err.message
        })
    }
}