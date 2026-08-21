import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";

const getDashboardSummary = async (req, res) => {
    try {
        const result = await transactionModel.aggregate([
            {
               $match: {
                    user: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: "$type",

                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        result.forEach(item => {
            if (item._id === "income") {
                totalIncome = item.total;
            }

            if (item._id === "expense") {
                totalExpense = item.total;
            }
        });

        const balance = totalIncome - totalExpense;

        return res.status(200).json({
            totalIncome,
            totalExpense,
            balance
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


const getCategorySummary = async (req, res) => {
    try {
        const categories = await transactionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ]);

        return res.status(200).json({
            categories
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getMonthlySummary = async (req, res) => {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();

        const monthly = await transactionModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user.id),

                    type: "expense",

                    date: {
                        $gte: new Date(year, 0, 1),
                        $lt: new Date(year + 1, 0, 1)
                    }
                }
            },

            {
                $group: {
                    _id: {
                        month: {
                            $month: "$date"
                        }
                    },

                    total: {
                        $sum: "$amount"
                    }
                }
            },

            {
                $sort: {
                    "_id.month": 1
                }
            }
        ]);

        return res.status(200).json({
            year,
            monthly
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export {
    getDashboardSummary,
    getCategorySummary,
    getMonthlySummary
};