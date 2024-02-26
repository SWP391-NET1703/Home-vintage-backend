import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateOrderRequest } from './order.request'
import { orderService } from './order.services'
import { ORDER_MESSAGES } from './order.messages'
import interiorService from '../interiors/interior.services'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import { quantityValidator } from './order.middlewares'
import { OrderDetail } from './order.schema'
import { OrderStatus } from './order.enum'
import { TokenPayload } from '../users/User.request'

export const createOrderController = async (req: Request<ParamsDictionary, any, CreateOrderRequest>, res: Response) => {
  const { detail } = req.body as { detail: OrderDetail[] }
  //check quantity
  //cho chạy for rồi lưu các lỗi vào error message
  //check error message array\
  const errorMessages = await quantityValidator(detail)
  if (errorMessages.length > 0) {
    return res.status(422).json({
      message: errorMessages
    })
  }

  const result = await orderService.createOrder(req)
  res.json({
    message: ORDER_MESSAGES.ORDER_SUCCESSFULL,
    orderInfor: result
  })
}

export const acceptOrderController = async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await orderService.getOrderById(id)
  if (order) {
    const errorMessages = await quantityValidator(order.detail)
    if (errorMessages.length > 0) {
      return res.status(422).json({
        message: errorMessages
      })
    }
  }
  const result = await orderService.changeStatusOrder(id, OrderStatus.Pack_products)
  res.json({
    message: ORDER_MESSAGES.ACCEPT_ORDER_SUCCESSFULL,
    orderInfor: result
  })
}

export const shippingOrderController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await orderService.changeStatusOrder(id, OrderStatus.Delivery)
  res.json({
    message: ORDER_MESSAGES.ORDER_IS_DELIVERIED,
    orderInfor: result
  })
}

export const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const result = await orderService.changeStatusOrder(id, OrderStatus.Cancel)
  res.json({
    message: ORDER_MESSAGES.ORDER_IS_CANCEL,
    orderInfor: result
  })
}

export const getListOrderHistoryController = async (req: Request, res: Response) => {
  const { decoded_authorization } = req as { decoded_authorization: TokenPayload }
  const { user_id } = decoded_authorization
  const result = await orderService.getListOrderHistory(user_id)
  res.json({
    message: ORDER_MESSAGES.GET_LIST_ORDER_HISTORY_SUCCESS,
    list_order_history: result
  })
}
