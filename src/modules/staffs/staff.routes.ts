import { Router } from 'express'
import { accessTokenAdminValidator } from '../users/user.middlewares'
import { createStaffController, getListStaffController } from './staff.controller'
import { wrapAsync } from '~/utils/handlers'
import { createStaffValidator } from './staff.middlewares'
import { filterMiddleware } from '~/utils/common'

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
export default staffRouter
