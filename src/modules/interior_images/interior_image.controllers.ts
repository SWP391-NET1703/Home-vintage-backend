import { Request, Response } from 'express'
import { formidable } from 'formidable'
import path from 'path'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorImageServices from './interior_image.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await interiorImageServices.handleUploadImage(req)
  res.json({
    message: INTERIOR_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result: url
  })
}
