const express  = require('express');
const { isLoggedIn, authorizeRoles } = require('../middleware/isLoggedIn');
const { dashboardSummary } = require('../controllers/dashboard.controller');
const dashboardRoutes = express.Router();

/**
 * @routes /api/dashboard/summary
 * @description This route is responsibe for generating summary for the records
 */
dashboardRoutes.get('/summary' , isLoggedIn, authorizeRoles("admin" , "analyst" , "viewer") , dashboardSummary)



module.exports = dashboardRoutes