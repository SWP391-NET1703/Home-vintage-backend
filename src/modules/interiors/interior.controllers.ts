import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateInteriorReqBody, UpdateInteriorBody } from './interior.request'
import interiorService from './interior.services'
import { INTERIOR_MESSAGES } from './interior.messages'
import interiorImageServices from '../interior_images/interior_image.services'

export const createInteriorController = async (
  req: Request<ParamsDictionary, any, CreateInteriorReqBody>,
  res: Response
) => {
  const result = await interiorService.createInterior(req.body)

  res.json({
    message: INTERIOR_MESSAGES.CREATE_INTERIOR_SUCCESS,
    interior: result
  })
}

export const updateInteriorController = async (
  req: Request<ParamsDictionary, any, UpdateInteriorBody>,
  res: Response
) => {
  const { id } = req.params
  const { body } = req
  const result = await interiorService.updateInterior(id, body)

  res.json({
    message: INTERIOR_MESSAGES.UPDATE_INTERIOR_SUCCESS,
    interior: result
  })
}

export const deleteInteriorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await interiorService.disableInterior(id)
  res.json({
    message: INTERIOR_MESSAGES.DISABLE_INTERIOR_SUCCESS
  })
}

export const getInteriorById = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await interiorService.getInteriorById(id)
  res.json({
    message: INTERIOR_MESSAGES.GET_INTERRIOR_SUCCESS,
    interior: result
  })
}
