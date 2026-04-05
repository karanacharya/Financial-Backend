const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    amount: {
        type: Number,
        required: [true, "Please Specify the amount"]
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: [true, "Please specify the Type of this record"]
    },
    category: {
        type: String,
        required: [true, "please specify the category of this record"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String
    }
}, { timestamps: true });


const recordModel = mongoose.model("record", recordSchema);
module.exports = recordModel;