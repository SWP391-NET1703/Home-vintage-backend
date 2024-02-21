import { Router } from 'express'
import { accessTokenValidator } from '../users/user.middlewares'
import { createOrderValidator } from './order.middlewares'
import { createOrderController } from './order.controllers'
import { wrapAsync } from '~/utils/handlers'

const orderRouter = Router()

orderRouter.post('/checkout', accessTokenValidator, createOrderValidator, wrapAsync(createOrderController))

export default orderRouter
