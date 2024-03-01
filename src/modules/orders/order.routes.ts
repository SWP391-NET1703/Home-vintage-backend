import { accessTokenStaffOrAdminValidator } from './../users/user.middlewares'
import { Router } from 'express'
import { accessTokenStaffValidator, accessTokenValidator } from '../users/user.middlewares'
import {
  acceptOrderValidator,
  createOrderValidator,
  deleteOrderValidator,
  rejectOrderValidator,
  shippingOrderValidator
} from './order.middlewares'
import {
  acceptOrderController,
  createOrderController,
  deleteOrderController,
  getListOrderHistoryController,
  orderControllerTotal,
  rejectOrderController,
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
  '/delivery/:id',
  accessTokenStaffOrAdminValidator,
  shippingOrderValidator,
  wrapAsync(shippingOrderController)
)

//này của staff
orderRouter.post(
  '/reject/:id',
  accessTokenStaffOrAdminValidator,
  rejectOrderValidator,
  wrapAsync(rejectOrderController)
)

// orderRouter.post('/:id', accessTokenStaffOrAdminValidator, orderValidatorTotal, wrapAsync(orderControllerTotal))
//route này là của customer
orderRouter.delete('/:id', accessTokenValidator, deleteOrderValidator, wrapAsync(deleteOrderController))

orderRouter.get('/history', accessTokenValidator, wrapAsync(getListOrderHistoryController))

export default orderRouter
