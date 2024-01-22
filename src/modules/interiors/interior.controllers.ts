import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateInteriorReqBody } from './interior.request'
import interiorService from './interior.services'
import { INTERIOR_MESSAGES } from './interior.messages'

export const createInteriorController = async (
  req: Request<ParamsDictionary, any, CreateInteriorReqBody>,
  res: Response
) => {
  const result = await interiorService.createInterior(req.body)
  res.json({
    message: INTERIOR_MESSAGES.CREATE_INTERIOR_SUCCESS
  })
}
