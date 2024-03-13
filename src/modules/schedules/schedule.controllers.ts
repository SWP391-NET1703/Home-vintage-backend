import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterScheduleReqBody, RejectScheduleReqBody } from './schedule.request'
import { Request, Response, NextFunction } from 'express'
import scheduleServices from './schedule.services'
import { TokenPayload } from '../users/User.request'
import { SCHEDULE_MESSAGES } from './schedule.message'
export const registerScheduleController = async (
  req: Request<ParamsDictionary, any, RegisterScheduleReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await scheduleServices.registerSchedule(req.body, user_id as string)
  return res.json({
    message: SCHEDULE_MESSAGES.SCHEDULE_REGISTERED_SUCCESS,
    infor_schedule: result[0]
  })
}

export const getListScheduleToConfirm = async (req: Request, res: Response) => {
  const result = await scheduleServices.getListScheduleToConfirm()
  //sort cho nhung thang chua xac len truoc
  result.sort((a, b) => {
    return a.status === 'pending' ? -1 : 1
  })
  return res.json({
    message: SCHEDULE_MESSAGES.GET_LIST_SCHEDULE_TO_CONFIRM_SUCCESS,
    list_schedules: result
  })
}

export const rejectScheduleController = async (
  req: Request<ParamsDictionary, any, RejectScheduleReqBody>,
  res: Response
) => {
  await scheduleServices.rejectSchedule(req.body)
  return res.json({
    message: SCHEDULE_MESSAGES.REJECT_SCHEDULE_SUCCESS
  })
}

export const confirmScheduleController = async (req: Request, res: Response) => {
  const id = req.body.schedule_id
  await scheduleServices.confirmSchedule(id)
}
