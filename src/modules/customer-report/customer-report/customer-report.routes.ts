import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import { createCustomerReportValidator, deleteOrCancelCustomerReportValidator } from './customer-report.middleware'
import { accessTokenValidator } from '~/modules/users/user.middlewares'
import { cancelOrDeleteCustomerReportController, createCustomerReportController } from './customer-report.controllers'
import { wrap } from 'module'

const customerReportRouter = Router()

/**
 * body : {report_id, interior_id, order_id, images, rate_interior, description}
 * url : /new-report
 * headers : accesstoken
 */

customerReportRouter.post(
  '/new-report',
  accessTokenValidator,
  createCustomerReportValidator,
  wrapAsync(createCustomerReportController)
)
/**
 * params : report_id
 * query : type : cancel || none
 */
customerReportRouter.delete(
  '/:id',
  accessTokenValidator,
  deleteOrCancelCustomerReportValidator,
  wrapAsync(cancelOrDeleteCustomerReportController)
)

export default customerReportRouter
