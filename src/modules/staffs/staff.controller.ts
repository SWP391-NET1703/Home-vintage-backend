import { ParamsDictionary } from 'express-serve-static-core'
import userServices from '../users/user.services'
import { Request, Response, NextFunction } from 'express'
import { STAFFS_MESSAGES } from './staff.mesage'
import { CreateStaffReqBody } from './staff.request'

export const createStaffController = async (req: Request<ParamsDictionary, any, CreateStaffReqBody>, res: Response) => {
  const result = await userServices.createStaff(req.body)
  res.json({
    message: STAFFS_MESSAGES.CREATE_STAFF_SUCCESS,
    result
  })
}
