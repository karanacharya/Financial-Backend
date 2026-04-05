const express = require('express');
const { loginUser } = require('../controllers/auth.controller');
const authRoutes = express.Router();


authRoutes.post('/login', loginUser);


module.exports = authRoutes