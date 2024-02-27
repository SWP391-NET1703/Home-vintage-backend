import { getInteriorById } from './../interiors/interior.controllers'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateOrderRequest } from './order.request'
import { orderService, updateInteriorQuantity } from './order.services'
import { ORDER_MESSAGES } from './order.messages'
import interiorService from '../interiors/interior.services'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import { quantityValidator } from './order.middlewares'
import Order, { OrderDetail } from './order.schema'
import { OrderStatus } from './order.enum'
import { TokenPayload } from '../users/User.request'
import { callOrderController, convertQueryStringToStatusOrder } from './order.helper'

export const createOrderController = async (req: Request<ParamsDictionary, any, CreateOrderRequest>, res: Response) => {
  const { detail } = req.body as { detail: OrderDetail[] }
  const ValueNeedToConfirmOfOrder: number = 5000000
  //check quantity
  //cho chạy for rồi lưu các lỗi vào error message
  //check error message array\
  const errorMessages = await quantityValidator(detail)
  if (errorMessages.length > 0) {
    //check lỗi rồi lưu lại có thì chửi
    return res.status(422).json({
      message: errorMessages
    })
  }

  const user_id = (req.decoded_authorization as TokenPayload).user_id
  const isBuyFirstTime = await orderService.checkBuyFirstTime(user_id) //
  let order_status: OrderStatus = OrderStatus.Pack_products
  const { total_payment } = req.body
  if (!isBuyFirstTime || parseInt(total_payment) > ValueNeedToConfirmOfOrder) {
    //check xem mua lần nào chưa và giá trị đơn hàng có lớn hơn giá trị quy định của doanh nghiệp không
    order_status = OrderStatus.Wait_for_confirm
  }

  const result = await orderService.createOrder(req, order_status)
  res.json({
    message: ORDER_MESSAGES.ORDER_SUCCESSFULL,
    orderInfor: result
  })
}

export const acceptOrderController = async (req: Request, res: Response) => {
  const { id } = req.params
  //lấy order ra này
  const order = await orderService.getOrderById(id)
  if (order) {
    //lấy xong check quantity
    const errorMessages = await quantityValidator(order.detail)
    if (errorMessages.length > 0) {
      //có lỗi thì nổ bug ra
      return res.status(422).json({
        message: errorMessages
      })
    }
    updateInteriorQuantity(order.detail, OrderStatus.Pack_products)
  }

  //ko nổ bug thì thay đổi trạng thái đơn hàng
  const result = await orderService.changeStatusOrder(id, OrderStatus.Pack_products)
  res.json({
    message: ORDER_MESSAGES.ACCEPT_ORDER_SUCCESSFULL,
    orderInfor: result
  })
}

export const shippingOrderController = async (req: Request, res: Response) => {
  const { id } = req.params
  //chỉ cần thay đổi trạng thái
  const result = await orderService.changeStatusOrder(id, OrderStatus.Delivery)
  res.json({
    message: ORDER_MESSAGES.ORDER_IS_DELIVERIED,
    orderInfor: result
  })
}

export const deleteOrderController = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const order = await orderService.getOrderById(id)
  if (order && order.status_of_order === OrderStatus.Pack_products) {
    //nếu status là pack product thì sẽ update lại quantity của interior
    updateInteriorQuantity(order.detail, OrderStatus.Pack_products)
  }
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

export const rejectOrderController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await orderService.changeStatusOrder(id, OrderStatus.Cancel)
  res.json({
    message: ORDER_MESSAGES.REJECT_ORDER_SUCCESS
  })
}

export const orderControllerTotal = async (req: Request, res: Response) => {
  console.log(1)
  const { status } = req.query
  const status_string = status as string
  const status_order = convertQueryStringToStatusOrder(status_string)
  if (status_order === null) {
    return res.status(422).json({
      message: ORDER_MESSAGES.STATUS_IS_NOT_VALID
    })
  }
  const controller = callOrderController(status_order)
  console.log(controller)
  return controller
}
