import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import customerReportImageService from '../customer-report-image/customer-report-image.services'
import { CreateCustomerReportReqBody } from './customer-report.request'
import customerReportService from './customer-report.services'
import { JwkKeyExportOptions } from 'crypto'
import { TokenPayload } from '~/modules/users/User.request'
import { JwtPayload } from 'jsonwebtoken'
import { CUSTOMER_REPORT } from './customer-report.messages'

export const createCustomerReportController = async (
  req: Request<ParamsDictionary, any, CreateCustomerReportReqBody>,
  res: Response
) => {
  const { decoded_authorization } = req as JwtPayload
  const { user_id } = decoded_authorization
  const result = await customerReportService.createCustomerReport(req.body, user_id)
  res.json({
    message: CUSTOMER_REPORT.CREATE_RERPORT_SUCCESS,
    data: result
  })
}

export const cancelOrDeleteCustomerReportController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { type } = req.query

  if (type) {
    const result = await customerReportImageService.cancelCustomerReport(id)
    return res.json({
      message: CUSTOMER_REPORT.CANCEL_SUCCESS
    })
  }
  const result = await Promise.all([
    customerReportImageService.cancelCustomerReport(id),
    customerReportService.deleteCustomerReport(id)
  ])
  res.json({
    message: CUSTOMER_REPORT.DELETE_CUSTOMER_REPORT_SUCCESS
  })
}
