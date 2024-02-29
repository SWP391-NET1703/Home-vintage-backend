import { Router } from 'express'
import { accessTokenValidator } from '~/modules/users/user.middlewares'
import { wrapAsync } from '~/utils/handlers'

const customerReportRouter = Router()

//customerReportRouter.post('/new-report/:order-id', accessTokenValidator, wrapAsync(createCustomerReportController))

export default customerReportRouter
