import express from 'express'
import {loginController, logoutController, registerController} from '../controllers/auth.controller.js'

const authRoutes= express.Router()



authRoutes.post('/register',registerController)
authRoutes.post('/login',loginController)
authRoutes.get('/logout',logoutController)



export default authRoutes