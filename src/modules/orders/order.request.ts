import { OrderStatus, PaymentMethod } from './order.enum'
import { OrderDetail } from './order.schema'

export interface CreateOrderRequest {
  payment_method?: PaymentMethod
  total_payment: number
  status_of_order: OrderStatus
  detail: OrderDetail[]
}
