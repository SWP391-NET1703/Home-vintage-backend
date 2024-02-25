import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateOrderRequest } from './order.request'
import { orderService } from './order.services'
import { ORDER_MESSAGES } from './order.messages'
import interiorService from '../interiors/interior.services'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'
import { quantityValidator } from './order.middlewares'
import { OrderDetail } from './order.schema'

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
