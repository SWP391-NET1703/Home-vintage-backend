import { Request, Response } from 'express'
import customerReportImageService from './customer-report-image.services'

export const createCustomerReportImageController = async (req: Request, res: Response) => {
  const imagesName = await customerReportImageService.handleUploadImage(req)
  const result = await customerReportImageService.createNewReportImage(imagesName)
  res.json({
    result: result
  })
}

export const deleteCustomerReportImageController = async (req: Request, res: Response) => {
  const { nameImage } = req.query
  const { id } = req.params
  await customerReportImageService.handleDeleteFileImage(nameImage as string)
  const result = await customerReportImageService.deleteImage(id as string, nameImage as string)
  res.json({
    result
  })
}
