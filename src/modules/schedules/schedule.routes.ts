import { Router } from 'express'
import { wrap } from 'module'
import { accessTokenStaffOrAdminValidator, accessTokenValidator } from '../users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { confirmScheduleValidator, registerScheduleValidator, rejectScheduleValidator } from './schedule.middlewares'
import {
  confirmScheduleController,
  getListScheduleToConfirm,
  registerScheduleController,
  rejectScheduleController
} from './schedule.controllers'

const scheduleRouter = Router()

scheduleRouter.post('/register', accessTokenValidator, registerScheduleValidator, wrapAsync(registerScheduleController))

scheduleRouter.get('/list-schedule-to-confirm', accessTokenStaffOrAdminValidator, wrapAsync(getListScheduleToConfirm))

scheduleRouter.post(
  '/reject',
  accessTokenStaffOrAdminValidator,
  rejectScheduleValidator,
  wrapAsync(rejectScheduleController)
)

scheduleRouter.post(
  '/confirm',
  accessTokenStaffOrAdminValidator,
  confirmScheduleValidator,
  wrapAsync(confirmScheduleController)
)
export default scheduleRouter
