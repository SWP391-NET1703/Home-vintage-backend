import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { CreateOrderRequest } from './order.request'
import { orderService } from './order.services'

export const createOrderController = async (req: Request<ParamsDictionary, any, CreateOrderRequest>, res: Response) => {
  const result = await orderService.createOrder(req)
}
