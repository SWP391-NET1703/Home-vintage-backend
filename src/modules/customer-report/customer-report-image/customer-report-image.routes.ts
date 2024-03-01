import { Router } from 'express'
import { accessTokenValidator } from '~/modules/users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
import {
  createCustomerReportImageController,
  deleteCustomerReportImageController
} from './customer-report-image.controller'
import {
  createCustomerReportImageValidator,
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
  '/:id',
  accessTokenValidator,
  deleteCustomerReportImageValidator,
  wrapAsync(deleteCustomerReportImageController)
)

export default customerReportImageRouter
