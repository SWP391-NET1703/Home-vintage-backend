import { Router } from 'express'
import { accessTokenValidator } from '~/modules/users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
import { createCustomerReportValidator } from './customer-report.middleware'
import { createCustomerReportController } from './customer-report.controllers'

const customerReportRouter = Router()

customerReportRouter.post(
  '/new-report/:order-id',
  accessTokenValidator,
  //createCustomerReportValidator,
  wrapAsync(createCustomerReportController)
)

export default customerReportRouter
