import { Request, Response } from 'express'
import { formidable } from 'formidable'
import path from 'path'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorImageServices from './interior_image.services'
import interiorService from '../interiors/interior.services'
import { ErrorWithStatus } from '../errors/error.model'
import HTTP_STATUS from '~/constants/httpStatus'

export const uploadImageThumbnailController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { type } = req.query
  const images = await interiorImageServices.handleUploadImage(req)
}
