import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },

        type: {
            type: String,
            enum: ["income", "expense"],
            required: true
        },

        category: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "card", "upi", "bank"],
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;