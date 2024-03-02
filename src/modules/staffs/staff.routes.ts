import { Router } from 'express'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { createStaffController } from './staff.controller'
import { wrapAsync } from '~/utils/handlers'
import { createStaffValidator } from './staff.middlewares'

const staffRouter = Router()
staffRouter.post('/create-staff', accessTokenAdminValidator, createStaffValidator, wrapAsync(createStaffController))
export default staffRouter
