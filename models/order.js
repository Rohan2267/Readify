const mongoose = require("mongoose");

const order = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "books",
    },
    status: {
        type: String,
        enum: ["Order Placed", "Out for delivery", "Delivered", "Canceled"],
        default: "Order Placed",
    },
}, { timestamps: true }
);


module.exports = mongoose.model("order", order);