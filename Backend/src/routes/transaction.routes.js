import express from 'express'
import authMiddleware from './../middlewares/auth.middleware.js';
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from '../controllers/transaction.controller.js';

const transactionRoutes = express.Router();

transactionRoutes.post('/',authMiddleware,createTransaction)
transactionRoutes.get('/',authMiddleware,getTransactions)
transactionRoutes.get('/:id',authMiddleware,getTransactionById)
transactionRoutes.put('/:id',authMiddleware,updateTransaction)
transactionRoutes.delete('/:id',authMiddleware,deleteTransaction)


export default transactionRoutes