const express = require('express');
const cookieparser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const recordRoutes = require('./routes/record.routes');
const dashboardRoutes = require('./routes/dashboard.routes.');
const app = express();


app.use(express.json());
app.use(cookieparser());


/**
 * @description This route contains authentication related to a user
 */
app.use('/api/auth' , authRoutes);

/**
 * @description This route is user related routes
 */
app.use('/api/user' , userRoutes)


/**
 * @route /api/records,
 * @description This route is to handle the record routes
 */
app.use('/api/records', recordRoutes)

/**
 * @route /api/dashboard,
 * @description This route is to provide summary for the dashboard data
 */
app.use('/api/dashboard' , dashboardRoutes)



module.exports = app;