const express = require('express');
const { isLoggedIn, authorizeRoles } = require('../middleware/isLoggedIn');
const { createRecord , getRecords , getMyRecords, updateRecord, deleteRecord} = require('../controllers/record.controller');
const recordRoutes = express.Router();


/**
 * @route /api/records/create
 * @description This route is to Create a record,
 * @access Admin Only
 */
recordRoutes.post('/create', isLoggedIn, authorizeRoles("admin"), createRecord);

/**
 * @route /api/records/getRecords
 * @description This route is to get all the record and also let you use filters to get data,
 * @access Admin and Analysts
 */
recordRoutes.get('/getRecords' , isLoggedIn , authorizeRoles("admin" , "analyst") , getRecords)


/**
 * @route /api/records/get-myRecords
 * @description This route is to get all the record that are made by the logged in admin only,
 * @access Admin
 */
recordRoutes.get('/get-myRecords' , isLoggedIn , authorizeRoles("admin"), getMyRecords)

/**
 * @route /api/records/update/:id
 * @description This route is to update a record,
 * @access Admin Only
 */
recordRoutes.patch('/update/:id' , isLoggedIn , authorizeRoles("admin") , updateRecord)

/**
 * @route /api/records/delete/:id
 * @description This route is to delte a record (soft delete Only),
 * @access Admins ONly
 */
recordRoutes.delete('/delete/:id' , isLoggedIn , authorizeRoles("admin") , deleteRecord)



module.exports = recordRoutes