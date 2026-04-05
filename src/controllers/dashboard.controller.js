const mongoose = require('mongoose');
const recordModel = require('../models/record.model');
const userModel = require('../models/user.model');



module.exports.dashboardSummary = async function (req, res) {
    try {
        const matchstage = { isDeleted: false };

        //Total income and expense
        const totals = await recordModel.aggregate([
            { $set: matchstage },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        totals.forEach(item => {
            if (item._id == "income") totalIncome = item.total;
            if (item._id == "expense") totalExpense = item.total;
        })


        const netBalance = totalIncome - totalExpense;

        //Calculating category wise Total
        const categoryTotals = await recordModel.aggregate([
            { $set: matchstage },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }

                }
            }
        ]);


        //Recent Transaction or records
        const recentTransactions = await recordModel.find(matchstage).sort({ createdAt: -1 }).limit(5);


        //Monthly trends
        const monthlyTrends = await recordModel.aggregate([
            { $set: matchstage },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);


        return res.status(200).json({
            message: "Dashboard data fetched successfully",
            status: "success",
            data: {
                totalIncome,
                totalExpense,
                netBalance,
                categoryTotals,
                recentTransactions,
                monthlyTrends
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching dashboard data",
            status: "failed",
            error: error.message
        });
    }
}