import { Request } from 'express'
import Order, { OrderDetail } from './order.schema'
import databaseService from '../database/database.services'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '../users/User.request'
import { OrderStatus, PaymentMethod } from './order.enum'
import { CreateOrderRequest } from './order.request'
import interiorService from '../interiors/interior.services'

class OrderServices {
  async createOrder(req: Request) {
    const ValueTotalPayment = 20000000
    const {
      total_payment,
      payment_method,
      detail
    }: { total_payment: string; payment_method: PaymentMethod; detail: OrderDetail[] } = req.body
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
        status_of_order:
          parseInt(total_payment) >= ValueTotalPayment ? OrderStatus.Wait_for_confirm : OrderStatus.Pack_products
      })
    )

    if (parseInt(total_payment) < ValueTotalPayment) {
      updateInteriorQuantity(detail)
    }

    const orderInfor = await this.getOrderById(result.insertedId.toString())
    return orderInfor
  }

  async getOrderById(id: string) {
    const result = await databaseService.orders.findOne({ _id: new ObjectId(id) })
    return result
  }

  async changeStatusOrder(id: string, status: OrderStatus) {
    const result = await databaseService.orders.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status_of_order: OrderStatus.Pack_products
        }
      }
    )
    return result
  }

  async getListOrderHistory(user_id: string) {
    //vì user_id là string nên phải chuyển về ObjectId
    const result = await databaseService.orders.find({ customer_id: new ObjectId(user_id) }).toArray()
    return result
  }
}

//tách hàm này ra để còn sử dụng lại
export const updateInteriorQuantity = (detail: OrderDetail[]) => {
  detail.forEach(async (orderDetail: OrderDetail) => {
    const { interior_id, quantity } = orderDetail
    const interior = await interiorService.getInteriorById(interior_id.toString())
    if (interior) {
      const newQuantity = parseInt(interior.quantity) - parseInt(quantity)
      const result = await interiorService.updateInteriorQuantity(newQuantity, interior_id.toString())
    }
  })
}

export const orderService = new OrderServices()
