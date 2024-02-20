import { Request, Response } from 'express'
import { formidable } from 'formidable'
import path from 'path'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorImageServices from './interior_image.services'
import interiorService from '../interiors/interior.services'
import { ErrorWithStatus } from '../errors/error.model'
import HTTP_STATUS from '~/constants/httpStatus'
import Interior from '../interiors/interior.schema'

export const uploadImageController = async (req: Request, res: Response) => {
  const data = await interiorImageServices.handleUploadImage(req)
  if (data === INTERIOR_MESSAGES.MAX_IMAGE_IS_5) {
    return res.status(422).json({
      error: data
    })
  }
  res.json({
    message: INTERIOR_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: data
  })
}

export const updateImageController = async (req: Request, res: Response) => {
  const { interior } = req
  const url = await interiorImageServices.handleUpdateImage(req, interior as Interior)
  res.json({
    message: INTERIOR_MESSAGES.UPDATE_IMAGE_SUCCESS,
    result: url
  })
}

export const deleteImageController = async (req: Request, res: Response) => {
  const { interior } = req
  await interiorImageServices.handleDeleteImage(req, interior as Interior)
  res.json({
    message: INTERIOR_MESSAGES.DELETE_IMAGE_SUCCESS
  })
}
