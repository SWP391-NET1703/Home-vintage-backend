import { Router } from 'express'
import { accessTokenValidator } from '../users/user.middlewares'
import { createOrderValidator } from './order.middlewares'
import { createOrderController } from './order.controllers'

const orderRouter = Router()

orderRouter.post('/checkout', accessTokenValidator, createOrderValidator, createOrderController)
