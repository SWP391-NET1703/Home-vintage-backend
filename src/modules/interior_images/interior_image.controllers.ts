import { InteriorImage } from './interior_image.schema'
import { Request, Response } from 'express'
import { formidable } from 'formidable'
import path from 'path'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import interiorImageServices from './interior_image.services'
import interiorService from '../interiors/interior.services'
import { ErrorWithStatus } from '../errors/error.model'
import HTTP_STATUS from '~/constants/httpStatus'
import { totalUploadImage, totalUploadImageThumbnail } from './interior_image.constants'

export const uploadImageThumbnailController = async (req: Request, res: Response) => {
  const { id } = req.query
  const isExist = await interiorImageServices.getInteriorImageByInteriorId(id as string)
  const images = await interiorImageServices.handleUploadImage(req, totalUploadImageThumbnail)
  if (!isExist) {
    const interiorImage = await interiorImageServices.createNewInteriorThumbnail(images[0])
    return res.json({
      message: INTERIOR_MESSAGES.UPLOAD_IMAGE_THUMBNAIL_SUCCESS,
      interiorImage
    })
  }

  const newInteriorImage = await interiorImageServices.updateThumbnailImageInterior(id as string, images[0])
  res.json({
    message: INTERIOR_MESSAGES.UPLOAD_IMAGE_THUMBNAIL_SUCCESS,
    newInteriorImage
  })
}

export const uploadImageController = async (req: Request, res: Response) => {
  const { id } = req.query
  const isExist = await interiorImageServices.getInteriorImageByInteriorId(id as string)
  const images = await interiorImageServices.handleUploadImage(req, totalUploadImage)
  if (!isExist) {
    const interiorImage = await interiorImageServices.createNewInteriorImage(images)
    return res.json({
      message: INTERIOR_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      interiorImage
    })
  }

  const interiorImage = await interiorImageServices.importImageInterior(id as string, images)
  res.json({
    message: INTERIOR_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    interiorImage
  })
}

export const deleteImageInteriorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { type, index } = req.query
  if (index) {
    const result = await interiorImageServices.deleteInteriorImage(id, index as string)
  }
}
