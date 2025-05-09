import express from 'express'
import { getUserData, purchaseCourse, useEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',useEnrolledCourses)
userRouter.post('/purchase',purchaseCourse)

export default userRouter;