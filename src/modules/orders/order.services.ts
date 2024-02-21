import { Request } from 'express'
import Order from './order.schema'
import databaseService from '../database/database.services'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '../users/User.request'
import { OrderStatus, PaymentMethod } from './order.enum'
import { CreateOrderRequest } from './order.request'

class OrderServices {
  async createOrder(req: Request) {
    const { total_payment, payment_method, detail } = req.body
    const { user_id } = req.decoded_authorization as TokenPayload
    const order_id = new ObjectId()
    const result = await databaseService.orders.insertOne(
      new Order({
        _id: order_id,
        customer_id: new ObjectId(user_id),
        staff_id: '',
        date_order: new Date(),
        total_payment: total_payment,
        payment_method: payment_method,
        detail: detail,
        status_of_order: OrderStatus.Wait_for_confirm
      })
    )

    const orderInfor = await this.getOrderById(result.insertedId.toString())
    return orderInfor
  }

  async getOrderById(id: string) {
    const result = await databaseService.orders.findOne({ _id: new ObjectId(id) })
    return result
  }
}

export const orderService = new OrderServices()
