import { Request, Response } from 'express'
import customerReportImageService from './customer-report-image.services'
import { CUSTOMER_REPORT } from '../customer-report/customer-report.messages'

export const createCustomerReportImageController = async (req: Request, res: Response) => {
  const imagesName = await customerReportImageService.handleUploadImage(req)
  const result = await customerReportImageService.createNewReportImage(imagesName)
  res.json({
    message: CUSTOMER_REPORT.CREATE_REPORT_IMAGE_SUCCESS,
    result: result
  })
}

export const deleteCustomerReportImageController = async (req: Request, res: Response) => {
  const { nameImage } = req.query
  const { reportId } = req.params
  await customerReportImageService.handleDeleteFileImage(nameImage as string)
  const result = await customerReportImageService.deleteImage(reportId as string, nameImage as string)
  res.json({
    message: CUSTOMER_REPORT.DELETE_REPORT_IMAGE_SUCCESS,
    result
  })
}
