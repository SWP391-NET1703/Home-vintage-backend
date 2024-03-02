import { Router } from 'express'

import { wrapAsync } from '~/utils/handlers'
import {
  createCustomerReportValidator,
  deleteCustomerReportValidator,
  manageCustomerReportvalidator
} from './customer-report.middleware'
import { accessTokenStaffOrAdminValidator, accessTokenValidator } from '~/modules/users/user.middlewares'
import {
  createCustomerReportController,
  deleteCustomerReportController,
  manageCustomerReportController
} from './customer-report.controllers'
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
  deleteCustomerReportValidator,
  wrapAsync(deleteCustomerReportController)
)
/**
 * query : report-id
 * params : status
 * body : reason_not_valid
 */
customerReportRouter.post(
  '/manage/:id',
  accessTokenStaffOrAdminValidator,
  manageCustomerReportvalidator,
  wrapAsync(manageCustomerReportController)
)

export default customerReportRouter
