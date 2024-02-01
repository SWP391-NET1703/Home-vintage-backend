import { Request, Response } from 'express'
import { formidable } from 'formidable'
import path from 'path'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorImageServices from './interior_image.services'
import interiorService from '../interiors/interior.services'
import { ErrorWithStatus } from '../errors/error.model'
import HTTP_STATUS from '~/constants/httpStatus'

export const uploadImageController = async (req: Request, res: Response) => {
  const { id } = req.params
  const interior = await interiorService.checkInteriorExist(id)
  if (!interior) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: INTERIOR_MESSAGES.INTERIOR_NOT_FOUND
    })
  }
  const url = await interiorImageServices.handleUploadImage(req)
  res.json({
    message: INTERIOR_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: url
  })
}
