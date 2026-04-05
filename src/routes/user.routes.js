const express = require('express');
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const { isLoggedIn, authorizeRoles } = require('../middleware/isLoggedIn');
const userRoutes = express.Router();



/**
 * @route /api/user/create
 * @description This is to create a user.
 * @access Only Admins can access this.
 */
userRoutes.post('/create', isLoggedIn , authorizeRoles("admin") , createUser);


/**
 * @route /api/user/getUsers
 * @description This is the route to fetch all the users present in the DB,
 * @access Only Admins can access this.
 */
userRoutes.get('/getUsers' , isLoggedIn , authorizeRoles("admin") , getAllUsers)


/**
 * @route /api/user/getUser/:id
 * @description This is the route to fetch the users by the id provided in the params,
 * @access Only Admins can access this.
 */
userRoutes.get('/getUser/:id' , isLoggedIn , authorizeRoles("admin") , getUserById)

/**
 * @route /api/user/updateUser/:id
 * @description This is the route update a user,
 * @access Only Admins can access this.
 */
userRoutes.patch('/updateUser/:id' , isLoggedIn , authorizeRoles("admin") , updateUser )

/**
 * @route /api/user/deleteUser/:id
 * @description This is the route to delete a user(Soft Delete Only),
 * @access Only Admins can access this.
 */
userRoutes.delete('/deleteUser/:id' , isLoggedIn , authorizeRoles("admin") , deleteUser)




module.exports = userRoutes;