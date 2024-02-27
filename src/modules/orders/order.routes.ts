import { accessTokenStaffOrAdminValidator } from './../users/user.middlewares'
import { Router } from 'express'
import { accessTokenStaffValidator, accessTokenValidator } from '../users/user.middlewares'
import {
  acceptOrderValidator,
  createOrderValidator,
  deleteOrderValidator,
  shippingOrderValidator
} from './order.middlewares'
import {
  acceptOrderController,
  createOrderController,
  deleteOrderController,
  getListOrderHistoryController,
  shippingOrderController
} from './order.controllers'
import { wrapAsync } from '~/utils/handlers'

const orderRouter = Router()

orderRouter.post('/checkout', accessTokenValidator, createOrderValidator, wrapAsync(createOrderController))

orderRouter.post(
  '/accept/:id',
  accessTokenStaffOrAdminValidator,
  acceptOrderValidator,
  wrapAsync(acceptOrderController)
)

orderRouter.post(
  '/shipping/:id',
  accessTokenStaffOrAdminValidator,
  shippingOrderValidator,
  wrapAsync(shippingOrderController)
)

orderRouter.delete('/:id', accessTokenValidator, deleteOrderValidator, wrapAsync(deleteOrderController))

orderRouter.get('/history', accessTokenValidator, wrapAsync(getListOrderHistoryController))
export default orderRouter
