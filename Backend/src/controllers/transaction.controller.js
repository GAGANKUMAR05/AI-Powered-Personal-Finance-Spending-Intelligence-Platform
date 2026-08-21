
import transactionModel from './../models/transaction.model.js';

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

const getTransactions = async (req, res) => {
    try {
        const {
            type,
            category,
            paymentMethod,
            month,
            year
        } = req.query;

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

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);

            filter.date = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const transactions = await transactionModel
            .find(filter)
            .sort({ date: -1 });

        return res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            transactions
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const id = req.params.id;

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


const updateTransaction = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            amount,
            type,
            paymentMethod,
            category
        } = req.body;

        const transaction = await transactionModel.findOneAndUpdate(
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


const deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;

        const transaction = await transactionModel.findOneAndDelete({
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

export {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};