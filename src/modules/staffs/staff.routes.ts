import { Router } from 'express'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { createStaffController, getListStaffController, updateActivityStaffController } from './staff.controller'
import { wrapAsync } from '~/utils/handlers'
import { createStaffValidator, updateActivityStaffValidator } from './staff.middlewares'
import { filterMiddleware } from '~/utils/common'
import { UpdateActivityStaff } from './staff.request'

const staffRouter = Router()
/*
  Description: Create new staff
  Path: /create-staff
  Method: POST
  Body: { ... }
*/
staffRouter.post('/create-staff', accessTokenAdminValidator, createStaffValidator, wrapAsync(createStaffController))
/*
  Description: get list new staff
  Path: /get-list-staff
  Method: POST
  Body: { ... }
*/
staffRouter.get('/get-list-staff', accessTokenAdminValidator, wrapAsync(getListStaffController))
/*
  Description: update activity staff
  Path: /update-activity-staff
  Method: patch
  Body: { ... }
*/
staffRouter.patch(
  '/update-activity-staff',
  accessTokenAdminValidator,
  updateActivityStaffValidator,
  wrapAsync(updateActivityStaffController)
)

export default staffRouter
