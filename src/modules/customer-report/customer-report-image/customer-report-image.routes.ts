import { Router } from 'express'
import { accessTokenValidator } from '~/modules/users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
import {
  createCustomerReportImageController,
  deleteAllImageAndInforController,
  deleteCustomerReportImageController
} from './customer-report-image.controller'
import {
  createCustomerReportImageValidator,
  deleteAllImageAndInforValidator,
  deleteCustomerReportImageValidator
} from './customer-report-image.middlewares'

const customerReportImageRouter = Router()

/**
 * params : order_id
 * query : interior_id
 * body : image[]
 * response : customerReportImage
 */
customerReportImageRouter.post(
  '/:orderId',
  accessTokenValidator,
  createCustomerReportImageValidator,
  wrapAsync(createCustomerReportImageController)
)
/**
 * params : _id
 * query : nameImage
 * response : customerReportImage
 */
customerReportImageRouter.delete(
  '/:reportId',
  accessTokenValidator,
  deleteCustomerReportImageValidator,
  wrapAsync(deleteCustomerReportImageController)
)

customerReportImageRouter.delete(
  '/remove-all/:reportId',
  accessTokenValidator,
  deleteAllImageAndInforValidator,
  wrapAsync(deleteAllImageAndInforController)
)

export default customerReportImageRouter
