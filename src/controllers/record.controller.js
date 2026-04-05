const express = require('express');
const recordModel = require('../models/record.model');
const { default: mongoose } = require('mongoose');



/**
 * @route /api/records/create
 * @description This route is used to create records
 * @access Admins only 
 */
module.exports.createRecord = async function (req, res) {
    try {
        const { amount, type, category, note } = req.body;

        if (amount === undefined || !type || !category || !note) {
            return res.status(400).json({
                message: "All Fields are required",
                status: "failed"
            })
        }



        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Type must be income or expense",
                status: "failed"
            });
        }

        const record = await recordModel.create({
            adminId: req.user._id,
            amount,
            type,
            category,
            note
        })

        return res.status(201).json({
            message: "Record created !",
            status: "success",
            record: {
                adminId: record.adminId,
                amount: record.amount,
                type: record.type,
                category: record.category,
                note: record.note,
                createdOn: record.date
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error occured while Creating record",
            status: "failed",
            error: error.message
        })
    }
}


/**
 * @route /api/records/getRecords
 * @description This route is used to get All the records and also can apply filters
 * @access Admins and analysts
 */
module.exports.getRecords = async function (req, res) {
    try {

        let { category, amount, type, startDate, endDate } = req.query;
        let filter = {};

        if (amount && isNaN(amount)) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (category) {
            filter.category = category;
        }

        if (type) {
            filter.type = type;
        }

        if (amount) {
            filter.amount = Number(amount);
        }

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                filter.date.$gte = new Date(startDate)
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate)
            }
        }


        const records = await recordModel.find({
            ...filter,
            isDeleted: false
        }).populate("adminId", "name email").sort({ date: -1 });

        if (records.length === 0) {
            return res.status(404).json({
                message: "Record Not Found",
                status: "failed"
            })
        }

        return res.status(200).json({
            message: "Records fetched sucessfully",
            status: "success",
            records
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error occured while fetching records",
            status: "failed",
            error: error.message
        })
    }
}


/**
 * @route /api/records/get-myRecords
 * @description This route will fetch all the records made by the current logged in admin only
 * @access Admins Only
 */
module.exports.getMyRecords = async function (req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
                status: "failed"
            })
        }

        const records = await recordModel.find({
            adminId: user._id,
            isDeleted: false
        })

        if (records.length === 0) {
            return res.status(400).json({
                message: "Records Not Found",
                status: "failed"
            })
        }

        return res.status(200).json({
            message: "Records fetched successfully",
            status: "success",
            Records: records
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error occured while fetching records",
            status: "failed",
            error: error.message
        })
    }
}


/**
 * @route /api/records/updated/:id
 * @description This route is used to update the records made by the logged in User(admin), and not others.
 * @access Admins Only
 */
module.exports.updateRecord = async function (req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                message: "Invalid Admin Id",
                status: "failed"
            })
        }

        if (!updates) {
            return res.status(400).json({
                message: "No fields provided to update",
                status: "failed"
            })
        }

        if (updates && updates.adminId) {
            return res.status(400).json({
                message: "You cannot change the Admin Id",
                status: "failed"
            })
        }


        const updatedRecord = await recordModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-adminId")

        if (!updatedRecord) {
            return res.status(404).json({
                message: "Record Not Found",
                status: "failed"
            })
        }



        return res.status(200).json({
            message: "Record is now updated",
            status: "success",
            updated_record: updatedRecord
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error occured while updating record",
            status: "failed",
            error: error.message
        })
    }
}


/**
 * @route /api/records/delete/:id
 * @description This route is used to delete the record (soft delete only).
 * @access Admins Only
 */
module.exports.deleteRecord = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Id ",
                status: "failed"
            })
        }

        const deletedRecord = await recordModel.findOneAndUpdate(
            { _id: id, isDeleted: false, adminId: req.user._id },
            { isDeleted: true },
            { new: true }
        );

        if (!deletedRecord) {
            return res.status(404).json({
                message: "Record not found",
                status: "failed"
            })
        }


        return res.status(200).json({
            message: "Record deleted successfully (Soft Delete Only)",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error occured while Deleting record",
            status: "failed",
            error: error.message
        })
    }
}






