import express from 'express'
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


const app =express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use('/api/auth',authRoutes);
app.use('/api/transaction',transactionRoutes)
app.use('/api/dashboard',dashboardRoutes)



export default app