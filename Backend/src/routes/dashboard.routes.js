import express from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import { getCategorySummary, getDashboardSummary, getMonthlySummary } from '../controllers/dashboard.controller'

const dashboardRoutes = express.Router()

dashboardRoutes.get('/summary',authMiddleware,getDashboardSummary)
dashboardRoutes.get('/category',authMiddleware,getCategorySummary)
dashboardRoutes.get('/monthly',authMiddleware,getMonthlySummary)




export default dashboardRoutes
