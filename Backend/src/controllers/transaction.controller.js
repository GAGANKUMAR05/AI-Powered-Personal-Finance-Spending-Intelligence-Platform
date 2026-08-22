import mongoose from "mongoose";
import transactionModel from "../models/transaction.model.js";


// ===============================
// CREATE TRANSACTION
// ===============================

const createTransaction = async (req, res) => {
    try {
        const {
            amount,
            type,
            paymentMethod,
            category
        } = req.body;

        if (!amount || !type || !paymentMethod || !category) {
            return res.status(400).json({
                message: "Please provide every detail"
            });
        }

        const transaction = await transactionModel.create({
            user: req.user.id,
            amount,
            type,
            paymentMethod,
            category
        });

        return res.status(201).json({
            message: "Transaction created successfully",
            transaction
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ===============================
// GET ALL TRANSACTIONS
// WITH FILTERING + PAGINATION
// ===============================

const getTransactions = async (req, res) => {
    try {
        const {
            type,
            category,
            paymentMethod,
            month,
            year,
            page = 1,
            limit = 10
        } = req.query;

        // -------------------------------
        // Build filter
        // -------------------------------

        const filter = {
            user: req.user.id
        };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (paymentMethod) {
            filter.paymentMethod = paymentMethod;
        }

        // -------------------------------
        // Filter by year
        // -------------------------------

        if (year) {
            const yearNumber = Number(year);

            if (Number.isNaN(yearNumber)) {
                return res.status(400).json({
                    message: "Invalid year"
                });
            }

            if (month) {
                const monthNumber = Number(month);

                if (
                    Number.isNaN(monthNumber) ||
                    monthNumber < 1 ||
                    monthNumber > 12
                ) {
                    return res.status(400).json({
                        message: "Invalid month"
                    });
                }

                const startDate = new Date(
                    yearNumber,
                    monthNumber - 1,
                    1
                );

                const endDate = new Date(
                    yearNumber,
                    monthNumber,
                    1
                );

                filter.date = {
                    $gte: startDate,
                    $lt: endDate
                };

            } else {
                const startDate = new Date(
                    yearNumber,
                    0,
                    1
                );

                const endDate = new Date(
                    yearNumber + 1,
                    0,
                    1
                );

                filter.date = {
                    $gte: startDate,
                    $lt: endDate
                };
            }
        }

        // -------------------------------
        // Pagination
        // -------------------------------

        const pageNumber = Math.max(
            parseInt(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            50
        );

        const skip = (pageNumber - 1) * limitNumber;

        // -------------------------------
        // Fetch transactions
        // -------------------------------

        const transactions = await transactionModel
            .find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNumber);

        // -------------------------------
        // Count total transactions
        // -------------------------------

        const totalTransactions =
            await transactionModel.countDocuments(filter);

        const totalPages = Math.ceil(
            totalTransactions / limitNumber
        );

        // -------------------------------
        // Response
        // -------------------------------

        return res.status(200).json({
            message: "Transactions fetched successfully",

            transactions,

            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalTransactions,
                totalPages
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ===============================
// GET TRANSACTION BY ID
// ===============================

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const transaction = await transactionModel.findOne({
            _id: id,
            user: req.user.id
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction fetched successfully",
            transaction
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ===============================
// UPDATE TRANSACTION
// ===============================

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const {
            amount,
            type,
            paymentMethod,
            category
        } = req.body;

        // PUT → require all fields
        if (!amount || !type || !paymentMethod || !category) {
            return res.status(400).json({
                message: "Please provide every detail"
            });
        }

        const transaction =
            await transactionModel.findOneAndUpdate(
                {
                    _id: id,
                    user: req.user.id
                },
                {
                    amount,
                    type,
                    paymentMethod,
                    category
                },
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction updated successfully",
            transaction
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ===============================
// DELETE TRANSACTION
// ===============================

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid transaction ID"
            });
        }

        const transaction =
            await transactionModel.findOneAndDelete({
                _id: id,
                user: req.user.id
            });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            message: "Transaction deleted successfully",
            transaction
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


// ===============================
// EXPORT
// ===============================

export {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};