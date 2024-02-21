import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateOrderRequest } from './order.request'
import { orderService } from './order.services'
import { ORDER_MESSAGES } from './order.messages'
import interiorService from '../interiors/interior.services'
import { INTERIOR_MESSAGES } from '../interiors/interior.messages'

export const createOrderController = async (req: Request<ParamsDictionary, any, CreateOrderRequest>, res: Response) => {
  const { detail } = req.body
  detail.forEach(async (item) => {
    const { quantity } = item
    const interior = await interiorService.getInteriorById(item.interior_id.toString())
    if (interior !== null) {
      if (interior.quantity < quantity || parseInt(quantity) === 0) {
        return res.status(422).json({
          message: 'Validation error',
          errors: {
            Quantity: ORDER_MESSAGES.QUANTITY_IS_NOT_VALID
          }
        })
      }
    }
  })

  const result = await orderService.createOrder(req)
  return res.json({
    message: ORDER_MESSAGES.ORDER_SUCCESSFULL,
    orderInfor: result
  })
}
